import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

/**
 * API route to send Inngest events
 * This keeps Inngest imports on the server side only
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventData } = body;
    
    if (!eventName || !eventData) {
      return NextResponse.json(
        { error: "Missing required fields: eventName and eventData" },
        { status: 400 }
      );
    }
    
    // Send event to Inngest
    await inngest.send({
      name: eventName,
      data: eventData,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending Inngest event:", error);
    return NextResponse.json(
      { error: "Failed to send event", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
