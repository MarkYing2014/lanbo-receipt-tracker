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
    const body = await request.json();
    const { 
      userId = "test-user-123",
      merchant,
      date,
      total,
      items = [] 
    } = body;
    
    console.log("Creating test receipt for user:", userId);
    
    // 1. Create a dummy receipt in Convex
    const receiptId = await convex.mutation(api.receipts.createReceipt, {
      userId,
      fileId: "test-file-123" as unknown as Id<"_storage">, // Simulated file ID
      fileName: "test-receipt.pdf",
    });
    
    console.log("Test receipt created with ID:", receiptId);
    
    // 2. Update the receipt with the provided data
    // Cast the receiptId to the correct Convex Id type
    await convex.mutation(api.receipts.updateReceiptData, {
      receiptId: receiptId as unknown as Id<"receipts">,
      merchant,
      date,
      total: parseFloat(total),
      items,
      status: "completed"
    });
    
    console.log("Test receipt updated with provided data");
    
    // 3. Send a test event to Inngest
    // We're using a standard fetch to avoid direct Inngest imports in API routes
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
          total: parseFloat(total),
          items
        },
      }),
    });
    
    console.log("Test event sent for receipt extraction");
    
    return NextResponse.json({
      success: true,
      message: "Test receipt created and updated with provided data",
      receiptId,
    });
  } catch (error) {
    console.error("Error creating test receipt:", error);
    return NextResponse.json(
      { 
        error: "Failed to create test receipt", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
