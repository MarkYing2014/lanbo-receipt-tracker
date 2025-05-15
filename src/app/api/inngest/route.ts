import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { extractReceiptData } from "@/lib/inngest/functions";

// Create an API that serves the Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [extractReceiptData],
});
