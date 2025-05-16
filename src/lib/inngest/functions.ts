import { Inngest } from "inngest";
import type { Events } from "./client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Create a dedicated Inngest client for functions
const functionInngest = new Inngest({ 
  id: "lanbo-receipt-tracker",
  deploymentURL: "https://lanbo-receipt-tracker.vercel.app"
});

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

// Function to extract receipt data using AI
export const extractReceiptData = functionInngest.createFunction(
  { id: "extract-receipt-data" },
  { event: "receipt/uploaded" },
  async ({ event, step }) => {
    const { userId, receiptId, fileId } = event.data;
    
    try {
      // Get the file URL from Convex
      const fileData = await step.run("get-file-url", async () => {
        return await convex.query(api.files.getFile, { fileId });
      });
      
      if (!fileData || !fileData.url) {
        throw new Error("File not found or URL is missing");
      }
      
      // This would be where we'd call an AI service (e.g., OpenAI) to extract data from the PDF
      // For now, we'll simulate the extraction process with a delay
      const extractedData = await step.run("extract-with-ai", async () => {
        // In a real implementation, this would call an AI API with the PDF file URL
        // For this demo, we're simulating it with simple extraction results
        
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Return simulated extraction results
        return {
          merchant: "Sample Store",
          date: new Date().toISOString(),
          total: 42.99,
          items: [
            {
              name: "Item 1",
              quantity: 2,
              unitPrice: 9.99,
              totalPrice: 19.98
            },
            {
              name: "Item 2",
              quantity: 1,
              unitPrice: 23.01,
              totalPrice: 23.01
            }
          ]
        };
      });
      
      // Update the receipt in Convex with the extracted data
      await step.run("update-receipt", async () => {
        await convex.mutation(api.receipts.updateReceiptData, {
          receiptId,
          merchant: extractedData.merchant,
          date: extractedData.date,
          total: extractedData.total,
          items: extractedData.items,
          status: "completed"
        });
      });
      
      // Send the extracted data event with all receipt information
      await functionInngest.send({
        name: "receipt/extracted",
        data: {
          merchant: extractedData.merchant,
          date: extractedData.date,
          total: extractedData.total,
          items: extractedData.items,
          userId,
          receiptId,
        },
      });
    } catch (error) {
      console.error("Error extracting receipt data:", error);
      
      // Update receipt status to failed
      await step.run("mark-as-failed", async () => {
        await convex.mutation(api.receipts.updateReceiptData, {
          receiptId,
          status: "failed",
          processingError: error instanceof Error ? error.message : "Unknown error during extraction"
        });
      });
      
      // Emit a receipt/error event
      return await step.sendEvent("receipt/error", {
        name: "receipt/error",
        data: {
          userId,
          receiptId,
          errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
        },
      });
    }
  }
);
