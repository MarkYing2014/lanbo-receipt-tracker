import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { StorageReader } from "./_generated/server";
import { getUser } from "./helpers";

// Generate upload URL for receipt PDFs
export const generateUploadUrl = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check user's quota
    const user = await getUser(ctx, args.userId);
    
    // Get current month's usage
    const month = getCurrentMonth();
    const usageRecord = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId_month", (q) => 
        q.eq("userId", args.userId)
         .eq("month", month)
      )
      .first();
    
    const currentUsage = usageRecord?.receiptsUploaded || 0;
    
    // Check if user has exceeded their quota
    if (currentUsage >= user.quota.receipts) {
      throw new ConvexError("Monthly receipt quota exceeded");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});

// Get a file from storage
export const getFile = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    // Get file metadata
    const file = await ctx.storage.getMetadata(args.fileId);
    if (!file) {
      throw new ConvexError("File not found");
    }
    
    // Get file URL
    const url = await ctx.storage.getUrl(args.fileId);
    
    return {
      ...file,
      url,
    };
  },
});

// Delete a file from storage
export const deleteFile = mutation({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    // Check if file exists
    const file = await ctx.storage.getMetadata(args.fileId);
    if (!file) {
      throw new ConvexError("File not found");
    }
    
    // Delete file from storage
    await ctx.storage.delete(args.fileId);
    
    return { success: true };
  },
});

// Helper function to validate file type (PDF)
export async function validatePdfFile(
  storage: StorageReader, 
  fileId: string
): Promise<boolean> {
  const file = await storage.getMetadata(fileId);
  if (!file) {
    return false;
  }
  
  return file.contentType === 'application/pdf';
}

// Helper function to get the current month in YYYY-MM format
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
