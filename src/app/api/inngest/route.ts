import { serve } from "inngest/next";
import { Inngest } from "inngest";
import { extractReceiptData } from "@/lib/inngest/functions";

// Create a dedicated Inngest client for the API route using environment variables
const apiInngest = new Inngest({ 
  id: "lanbo-receipt-tracker",
  // Use environment variables for configuration
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  deploymentURL: process.env.INNGEST_DEPLOYMENT_URL
});

// Create an API that serves the Inngest functions
export const { GET, POST, PUT } = serve({
  client: apiInngest,
  functions: [extractReceiptData],
});
