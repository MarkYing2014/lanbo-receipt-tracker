import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

/**
 * Test endpoint to simulate a receipt upload and processing
 * This lets you test the Convex and Inngest integration without uploading real PDFs
 */
export async function POST(request: Request) {
  try {
    console.log("Test receipt endpoint called");
    const body = await request.json();
    const { 
      userId = "test-user-123",
      merchant,
      date,
      total,
      items = [] 
    } = body;
    
    console.log("Test receipt data:", { userId, merchant, date, total, items });
    
    try {
      // 1. Create a receipt in Convex with required fields
      console.log("Creating receipt with userId:", userId);
      
      // Include the required fileId field
      const receiptId = await convex.mutation(api.receipts.createReceipt, {
        userId,
        fileId: "test-file-123" as unknown as Id<"_storage">, // Required field
        fileName: "test-receipt.pdf",
      });
      
      console.log("Test receipt created with ID:", receiptId);
      
      if (!receiptId) {
        throw new Error("Receipt ID was not returned from Convex");
      }
      
      // 2. Update the receipt with the provided data
      await convex.mutation(api.receipts.updateReceiptData, {
        receiptId: receiptId as unknown as Id<"receipts">,
        merchant,
        date,
        total: parseFloat(total || "0"),
        items: items || [],
        status: "completed"
      });
      
      console.log("Test receipt updated with provided data");
      
      // 3. Try to send a test event to Inngest if we have the API route
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/inngest/send-event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName: "receipt/extracted",
            eventData: {
              receiptId,
              userId,
              merchant,
              date,
              total: parseFloat(total || "0"),
              items: items || []
            },
          }),
        });
        console.log("Test event sent for receipt processing");
      } catch (inngestError) {
        console.warn("Inngest event sending failed, but receipt was created:", inngestError);
        // We won't fail the overall request if just the event sending fails
      }
      
      return NextResponse.json({
        success: true,
        message: "Test receipt created and updated with provided data",
        receiptId,
      });
    } catch (convexError) {
      console.error("Error in Convex operations:", convexError);
      throw new Error(`Convex operation failed: ${convexError instanceof Error ? convexError.message : String(convexError)}`);
    }
  } catch (error) {
    console.error("Error creating test receipt:", error);
    // Create a more detailed error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace available";
    
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    
    return NextResponse.json(
      { 
        error: "Failed to create test receipt", 
        details: errorMessage,
        stack: errorStack
      },
      { status: 500 }
    );
  }
}
