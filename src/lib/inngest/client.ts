import { Inngest } from "inngest";

// Determine base URL for Inngest deployment
const getBaseUrl = () => {
  // In production, use the VERCEL_URL or user-provided URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // In development or local preview, use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  
  // Default to production URL if available
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Fallback if all else fails
  return "https://lanbo-receipt-tracker.vercel.app";
};

// Create an Inngest client
export const inngest = new Inngest({ 
  id: "lanbo-receipt-tracker",
  // These will be pulled from environment variables in production
  // INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY
  deploymentURL: getBaseUrl(),
});

// Define event types for our application
export type Events = {
  // Event triggered when a new receipt is uploaded
  "receipt/uploaded": {
    data: {
      userId: string;
      receiptId: string;
      fileId: string;
    };
  };
  // Event triggered when receipt data extraction is complete
  "receipt/extracted": {
    data: {
      userId: string;
      receiptId: string;
      merchant: string | null;
      date: string | null;
      total: number | null;
      items: Array<{
        name: string;
        quantity?: number;
        unitPrice?: number;
        totalPrice?: number;
      }> | null;
    };
  };
  // Event triggered when receipt data extraction fails
  "receipt/extraction-failed": {
    data: {
      userId: string;
      receiptId: string;
      errorMessage: string;
    };
  };
};
