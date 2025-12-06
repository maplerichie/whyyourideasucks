import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitIdea = mutation({
  args: {
    pitch: v.string(),
    category: v.union(
      v.literal("B2B/SaaS"),
      v.literal("B2C app"),
      v.literal("Marketplace"),
      v.literal("Dev tool"),
      v.literal("Consumer hardware"),
      v.literal("Other")
    ),
    stage: v.union(
      v.literal("Pre-idea"),
      v.literal("Hackathon demo"),
      v.literal("MVP built"),
      v.literal("Traction"),
      v.literal("Raising")
    ),
    targetUser: v.string(),
    tam: v.number(),
    problemUrgency: v.number(),
    alternatives: v.string(),
    evidence: v.optional(v.string()),
    distribution: v.string(),
    distributionChannels: v.array(v.string()),
    cacGuess: v.optional(v.number()),
    unfairEdge: v.string(),
    monetization: v.string(),
    monetizationModel: v.union(
      v.literal("Freemium"),
      v.literal("Subscription"),
      v.literal("Ads"),
      v.literal("One-time"),
      v.literal("Other")
    ),
    price: v.optional(v.number()),
    teamFit: v.string(),
    tractionMetrics: v.optional(v.string()),
    brutality: v.union(v.literal("gentle"), v.literal("honest"), v.literal("savage")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const ideaId = await ctx.db.insert("ideas", {
      ...args,
      createdAt: Date.now(),
    });
    return ideaId;
  },
});

export const getIdea = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.ideaId);
  },
});

