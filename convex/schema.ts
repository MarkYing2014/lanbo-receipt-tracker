import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table to store user information and subscription details
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    planTier: v.string(), // "free", "starter", "pro"
    quota: v.object({
      receipts: v.number(), // Number of receipts allowed per month
      aiSummaries: v.optional(v.number()), // Number of AI summaries allowed (Pro only)
    }),
    subscriptionId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    billingPeriodStart: v.optional(v.string()),
    billingPeriodEnd: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  // Receipts table to store receipt data
  receipts: defineTable({
    userId: v.string(),
    fileId: v.id("_storage"), // ID of the uploaded PDF file in storage
    fileName: v.string(),
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
    status: v.string(), // "processing", "completed", "failed", "manual_edit"
    processingError: v.optional(v.string()),
    aiSummary: v.optional(v.string()), // Only for Pro users
    lastModified: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_date", ["userId", "date"])
    .index("by_status", ["status"]),

  // Storage usage tracking
  usageTracking: defineTable({
    userId: v.string(),
    month: v.string(), // Format: YYYY-MM
    receiptsUploaded: v.number(),
    aiSummariesGenerated: v.number(),
    lastUpdated: v.number(),
  }).index("by_userId_month", ["userId", "month"]),
});
