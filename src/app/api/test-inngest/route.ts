import { NextResponse } from "next/server";
import { Inngest } from "inngest";

// Create a standalone test client
const testInngest = new Inngest({
  id: "test-inngest-client",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

/**
 * Simple API endpoint to test Inngest directly
 */
export async function GET() {
  console.log("Testing Inngest directly");
  
  try {
    // Log environment variables
    console.log("INNGEST_EVENT_KEY prefix:", 
      process.env.INNGEST_EVENT_KEY?.substring(0, 5) || "undefined");
    console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL || "undefined");
    
    // Create a simple test event
    const result = await testInngest.send({
      name: "test.ping",
      data: {
        message: "Hello from direct test",
        timestamp: new Date().toISOString()
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "Test event sent directly to Inngest",
      result
    });
  } catch (error) {
    console.error("Error testing Inngest:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
