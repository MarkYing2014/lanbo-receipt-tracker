import { NextResponse } from "next/server";

// This is a direct API approach for testing Inngest without Convex integration

/**
 * Test endpoint to simulate a receipt upload and processing
 * This is a MOCK implementation that doesn't use Convex, just for testing Inngest
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
    
    // Create a mock receipt ID (no actual Convex interaction)
    const mockReceiptId = `mock-receipt-${Date.now()}`;
    
    console.log("Created mock receipt with ID:", mockReceiptId);
        
    // Send a test event directly to Inngest
    try {
      // Send event to the Inngest API route directly
      console.log("Sending event to Inngest API route");
      
      const eventResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/inngest/send-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: "receipt/uploaded",
          eventData: {
            userId,
            receiptId: mockReceiptId,
            fileId: "mock-file-id", // Required by the event type
            merchant,
            date,
            total: parseFloat(total || "0"),
            items: items || [],
            mockData: true // Flag to indicate this is test data
          },
        }),
      });
      
      const result = await eventResponse.json();
      console.log("Inngest API response:", result);
      
      return NextResponse.json({
        success: true,
        message: "Test receipt event sent to Inngest",
        receiptId: mockReceiptId,
        inngestResult: result
      });
    } catch (inngestError) {
      console.error("Error sending Inngest event:", inngestError);
      throw new Error(`Inngest event failed: ${inngestError instanceof Error ? inngestError.message : String(inngestError)}`);
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
