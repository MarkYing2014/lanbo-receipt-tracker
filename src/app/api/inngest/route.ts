import { serve } from "inngest/next";
import { Inngest } from "inngest";
import { extractReceiptData } from "@/lib/inngest/functions";

// Create a dedicated Inngest client for the API route
// This ensures it has the correct deployment URL at runtime rather than build time
const apiInngest = new Inngest({ 
  id: "lanbo-receipt-tracker",
  deploymentURL: "https://lanbo-receipt-tracker.vercel.app"
});

// Create an API that serves the Inngest functions
export const { GET, POST, PUT } = serve({
  client: apiInngest,
  functions: [extractReceiptData],
});
