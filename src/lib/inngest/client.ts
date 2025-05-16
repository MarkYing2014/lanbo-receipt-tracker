import { Inngest } from "inngest";

// Create an Inngest client using environment variables
export const inngest = new Inngest({ 
  id: "lanbo-receipt-tracker",
  // Use environment variables for configuration
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  // For deploymentURL, use environment variable with fallback based on environment
  deploymentURL: process.env.INNGEST_DEPLOYMENT_URL || 
    (process.env.NODE_ENV === "production" 
      ? "https://lanbo-receipt-tracker.vercel.app" 
      : "http://localhost:3000")
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
