import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUser } from "./helpers";
import { Id } from "./_generated/dataModel";

// Query to get user receipt statistics
export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get all receipts for this user
    const receipts = await ctx.db
      .query("receipts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Current date for calculations
    const now = new Date();
    
    // Calculate stats
    const total = receipts.length;
    
    // Receipts this month
    const thisMonthReceipts = receipts.filter(receipt => {
      if (!receipt.date) return false;
      const receiptDate = new Date(receipt.date);
      return (
        receiptDate.getMonth() === now.getMonth() &&
        receiptDate.getFullYear() === now.getFullYear()
      );
    });
    
    // Receipts this week (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const thisWeekReceipts = receipts.filter(receipt => {
      if (!receipt.date) return false;
      const receiptDate = new Date(receipt.date);
      return receiptDate >= oneWeekAgo;
    });
    
    // Find last uploaded receipt
    const sortedReceipts = [...receipts].sort((a, b) => 
      b._creationTime - a._creationTime
    );
    const lastUploaded = sortedReceipts.length > 0 
      ? sortedReceipts[0]._creationTime
      : null;

    return {
      total,
      thisMonth: thisMonthReceipts.length,
      thisWeek: thisWeekReceipts.length,
      lastUploaded
    };
  }
});

// Query to get monthly summary
export const getMonthlySummary = query({
  args: { 
    userId: v.string(),
    startDate: v.string(),
    endDate: v.string()
  },
  handler: async (ctx, args) => {
    // Parse date strings to Date objects
    const startDate = new Date(args.startDate);
    const endDate = new Date(args.endDate);
    
    // Get all receipts for this user within the date range
    const receipts = await ctx.db
      .query("receipts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Filter receipts within the date range
    const filteredReceipts = receipts.filter(receipt => {
      if (!receipt.date) return false;
      const receiptDate = new Date(receipt.date);
      return receiptDate >= startDate && receiptDate <= endDate;
    });

    // Calculate total spent
    let total = 0;
    
    // Group by category
    const categoryMap = new Map();
    
    filteredReceipts.forEach(receipt => {
      const amount = receipt.total || 0;
      total += amount;
      
      // Group by category
      const category = receipt.category || "Uncategorized";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0);
      }
      categoryMap.set(category, categoryMap.get(category) + amount);
    });
    
    // Convert map to array for response
    const byCategory = Array.from(categoryMap.entries()).map(([name, amount]) => ({
      name,
      amount
    }));
    
    return {
      total,
      byCategory
    };
  }
});

// Query to get recent receipts
export const getRecentReceipts = query({
  args: { 
    userId: v.string(),
    limit: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("receipts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit);
  }
});

// Query to get all receipts for a user
export const getAllReceipts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("receipts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  }
});

// Query to get a single receipt
export const getReceipt = query({
  args: { id: v.id("receipts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

// Mutation to create a new receipt
export const createReceipt = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check usage limits before creating receipt
    const user = await getUser(ctx, args.userId);
    const stats = await ctx.db
      .query("usageTracking")
      .withIndex("by_userId_month", (q) => 
        q.eq("userId", args.userId)
         .eq("month", getCurrentMonth())
      )
      .first();
    
    const currentUsage = stats?.receiptsUploaded || 0;
    
    if (currentUsage >= user.quota.receipts) {
      throw new ConvexError("Monthly receipt quota exceeded");
    }
    
    // Create the receipt
    const receiptId = await ctx.db.insert("receipts", {
      userId: args.userId,
      fileId: args.fileId,
      fileName: args.fileName,
      status: "processing", // Initial status
      lastModified: Date.now(),
    });
    
    // Update usage tracking
    if (stats) {
      await ctx.db.patch(stats._id, {
        receiptsUploaded: stats.receiptsUploaded + 1,
        lastUpdated: Date.now(),
      });
    } else {
      // Create new usage tracking record for this month
      await ctx.db.insert("usageTracking", {
        userId: args.userId,
        month: getCurrentMonth(),
        receiptsUploaded: 1,
        aiSummariesGenerated: 0,
        lastUpdated: Date.now(),
      });
    }
    
    return receiptId;
  }
});

// Mutation to update receipt data
export const updateReceiptData = mutation({
  args: {
    receiptId: v.id("receipts"),
    merchant: v.optional(v.string()),
    date: v.optional(v.string()),
    total: v.optional(v.number()),
    items: v.optional(
      v.array(
        v.object({
          name: v.string(),
          quantity: v.optional(v.number()),
          unitPrice: v.optional(v.number()),
          totalPrice: v.optional(v.number()),
        })
      )
    ),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    processingError: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the existing receipt
    const receipt = await ctx.db.get(args.receiptId);
    if (!receipt) {
      throw new ConvexError("Receipt not found");
    }
    
    // Prepare update object
    const updateData: any = {
      lastModified: Date.now(),
    };
    
    // Add optional fields if they exist
    if (args.merchant !== undefined) updateData.merchant = args.merchant;
    if (args.date !== undefined) updateData.date = args.date;
    if (args.total !== undefined) updateData.total = args.total;
    if (args.items !== undefined) updateData.items = args.items;
    if (args.category !== undefined) updateData.category = args.category;
    if (args.status !== undefined) updateData.status = args.status;
    if (args.processingError !== undefined) updateData.processingError = args.processingError;
    
    // Check if AI summary is being added and update usage if needed
    if (args.aiSummary !== undefined) {
      // Check if user has pro plan before allowing AI summary
      const user = await getUser(ctx, receipt.userId);
      if (user.planTier !== "pro") {
        throw new ConvexError("AI summaries are only available for Pro users");
      }
      
      updateData.aiSummary = args.aiSummary;
      
      // Update usage tracking for AI summaries
      const stats = await ctx.db
        .query("usageTracking")
        .withIndex("by_userId_month", (q) => 
          q.eq("userId", receipt.userId)
           .eq("month", getCurrentMonth())
        )
        .first();
        
      if (stats) {
        await ctx.db.patch(stats._id, {
          aiSummariesGenerated: (stats.aiSummariesGenerated || 0) + 1,
          lastUpdated: Date.now(),
        });
      }
    }
    
    // Update the receipt
    await ctx.db.patch(args.receiptId, updateData);
    
    return { success: true };
  }
});

// Mutation to delete a receipt
export const deleteReceipt = mutation({
  args: {
    receiptId: v.id("receipts")
  },
  handler: async (ctx, args) => {
    const receipt = await ctx.db.get(args.receiptId);
    if (!receipt) {
      throw new ConvexError("Receipt not found");
    }
    
    // Delete the receipt
    await ctx.db.delete(args.receiptId);
    
    return { success: true };
  }
});

// Helper function to get the current month in YYYY-MM format
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
