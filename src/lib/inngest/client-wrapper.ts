"use client";

// This is a browser-safe wrapper for Inngest
// It will only call Inngest on the server side through an API route

/**
 * Helper function to send Inngest events from client components
 * This avoids importing Inngest directly in client components
 */
export async function sendInngestEvent(eventName: string, eventData: any): Promise<boolean> {
  try {
    // Send the event through our own API endpoint instead of importing Inngest directly
    const response = await fetch("/api/inngest/send-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        eventData,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send Inngest event:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending Inngest event:", error);
    return false;
  }
}
