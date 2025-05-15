import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

// Define the plan quotas
const PLAN_QUOTAS = {
  free: { receipts: 10 },
  starter: { receipts: 50 },
  pro: { receipts: 200, aiSummaries: 50 },
};

// Query to get a user's plan information
export const getUserPlan = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      // If user doesn't exist yet, return free plan by default
      return {
        planTier: "free",
        quota: PLAN_QUOTAS.free,
        billingPeriodStart: null,
        billingPeriodEnd: null,
      };
    }

    return {
      planTier: user.planTier,
      quota: user.quota,
      billingPeriodStart: user.billingPeriodStart,
      billingPeriodEnd: user.billingPeriodEnd,
    };
  },
});

// Query to check if user exists
export const checkUserExists = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return !!user;
  },
});

// Mutation to create a new user
export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    // Create new user with free plan by default
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      planTier: "free",
      quota: PLAN_QUOTAS.free,
    });
  },
});

// Mutation to update user's plan tier
export const updatePlanTier = mutation({
  args: {
    userId: v.string(),
    planTier: v.string(),
    subscriptionId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    billingPeriodStart: v.optional(v.string()),
    billingPeriodEnd: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Get quota based on plan tier
    const planTier = args.planTier.toLowerCase();
    if (!["free", "starter", "pro"].includes(planTier)) {
      throw new ConvexError("Invalid plan tier");
    }

    const quota = PLAN_QUOTAS[planTier as keyof typeof PLAN_QUOTAS];

    // Update user with new plan info
    await ctx.db.patch(user._id, {
      planTier,
      quota,
      subscriptionId: args.subscriptionId,
      customerId: args.customerId,
      billingPeriodStart: args.billingPeriodStart,
      billingPeriodEnd: args.billingPeriodEnd,
    });

    return { success: true };
  },
});
