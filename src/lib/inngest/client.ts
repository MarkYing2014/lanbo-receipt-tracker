import { Inngest } from "inngest";

// Create an Inngest client
export const inngest = new Inngest({ 
  id: "lanbo-receipt-tracker",
  // These will be pulled from environment variables in production
  // INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY
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
