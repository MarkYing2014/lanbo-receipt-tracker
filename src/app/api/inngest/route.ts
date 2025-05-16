import { serve } from "inngest/next";
import { Inngest } from "inngest";
import { extractReceiptData } from "@/lib/inngest/functions";

// Log environment variables (first few chars only for security)
console.log(`INNGEST_EVENT_KEY prefix: ${process.env.INNGEST_EVENT_KEY?.substring(0, 5) || 'undefined'}`);
console.log(`DEPLOYMENT_URL: ${process.env.INNGEST_DEPLOYMENT_URL}`);

// Create Inngest client with the key
const inngest = new Inngest({ 
  id: "lanbo-receipt-tracker",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

// Simple test function
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: "Hello, World!" };
  }
);

// Standard serve implementation
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [extractReceiptData, helloWorld],
});
