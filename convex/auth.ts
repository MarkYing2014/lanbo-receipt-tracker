import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Define the JWT structure we expect from Clerk
interface ClerkJWT {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

// Simple function for development to extract Clerk identity
export async function clerkIdentity(clerkJWT: ClerkJWT | null) {
  if (!clerkJWT) {
    // For development, allow anonymous access
    return { id: "anonymous" };
  }
  
  // Return a simplified user identity with just the ID
  return { id: clerkJWT.sub };
}

// Auth configuration for Clerk integration
export default {
  // Support anonymous access for development
  anonymous: true,
  
  // Define an explicit identity function
  customUserIdentity: clerkIdentity,
};

