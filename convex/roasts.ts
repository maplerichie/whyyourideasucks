import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveRoast = mutation({
  args: {
    ideaId: v.id("ideas"),
    verdict: v.string(),
    brutality: v.union(v.literal("gentle"), v.literal("honest"), v.literal("savage")),
    scores: v.object({
      market: v.object({
        score: v.number(),
        why_sucks: v.string(),
        fix: v.array(v.string()),
      }),
      distribution: v.object({
        score: v.number(),
        why_sucks: v.string(),
        fix: v.array(v.string()),
      }),
      monetization: v.object({
        score: v.number(),
        why_sucks: v.string(),
        fix: v.array(v.string()),
      }),
      defensibility: v.object({
        score: v.number(),
        why_sucks: v.string(),
        fix: v.array(v.string()),
      }),
      founder_fit: v.object({
        score: v.number(),
        why_sucks: v.string(),
        fix: v.array(v.string()),
      }),
      hackathon: v.object({
        score: v.number(),
        why_sucks: v.string(),
        fix: v.array(v.string()),
      }),
    }),
    pivots: v.array(v.string()),
    next7days: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const roastId = await ctx.db.insert("roasts", {
      ...args,
      createdAt: Date.now(),
    });
    return roastId;
  },
});

