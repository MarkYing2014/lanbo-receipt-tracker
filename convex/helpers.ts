import { ConvexError } from "convex/values";
import { DatabaseReader } from "./_generated/server";

// Helper function to get a user from the database
export async function getUser(
  ctx: { db: DatabaseReader },
  userId: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  
  if (!user) {
    // Default to free tier if user doesn't exist yet
    return {
      planTier: "free",
      quota: { receipts: 10 },
    };
  }
  
  return user;
}
