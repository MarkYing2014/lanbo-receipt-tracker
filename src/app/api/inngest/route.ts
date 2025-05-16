import { serve } from "inngest/next";
import { Inngest } from "inngest";
import { extractReceiptData } from "@/lib/inngest/functions";

// Create the simplest possible Inngest client
const inngest = new Inngest({ id: "lanbo-receipt-tracker" });

// Create a test function directly in this file
const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s"); // Use proper duration format
    return { message: "Hello, World!" };
  }
);

// Create an API that serves the Inngest functions with explicit options
export const { GET, POST, PUT } = serve({
  client: inngest, // Use the correct client name
  functions: [extractReceiptData, helloWorld],
});
