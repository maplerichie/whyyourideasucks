import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRoast = query({
  args: { roastId: v.id("roasts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roastId);
  },
});

export const getRoastWithIdea = query({
  args: { roastId: v.id("roasts") },
  handler: async (ctx, args) => {
    const roast = await ctx.db.get(args.roastId);
    if (!roast) return null;
    
    const idea = await ctx.db.get(roast.ideaId);
    return { roast, idea };
  },
});

export const makePublic = mutation({
  args: {
    roastId: v.id("roasts"),
  },
  handler: async (ctx, args) => {
    const roast = await ctx.db.get(args.roastId);
    if (!roast) {
      throw new Error("Roast not found");
    }

    const idea = await ctx.db.get(roast.ideaId);
    if (!idea) {
      throw new Error("Idea not found");
    }

    // Calculate average score
    const scores = roast.scores;
    const avgScore =
      (scores.market.score +
        scores.distribution.score +
        scores.monetization.score +
        scores.defensibility.score +
        scores.founder_fit.score +
        scores.hackathon.score) /
      6;

    // Check if already public
    const existing = await ctx.db
      .query("publicRoasts")
      .withIndex("by_date")
      .filter((q) => q.eq(q.field("roastId"), args.roastId))
      .first();

    if (existing) {
      return existing._id;
    }

    const publicRoastId = await ctx.db.insert("publicRoasts", {
      roastId: args.roastId,
      ideaId: roast.ideaId,
      pitch: idea.pitch,
      category: idea.category,
      verdict: roast.verdict,
      avgScore: Math.round(avgScore * 10) / 10, // Round to 1 decimal
      createdAt: Date.now(),
    });

    return publicRoastId;
  },
});

export const getPublicRoasts = query({
  args: {
    category: v.optional(v.string()),
    minScore: v.optional(v.number()),
    maxScore: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("publicRoasts");

    if (args.category) {
      query = query.withIndex("by_category", (q) => q.eq("category", args.category!));
    } else {
      query = query.withIndex("by_date");
    }

    const roasts = await query
      .order("desc")
      .take(args.limit || 100);

    // Filter by score range if provided
    let filtered = roasts;
    if (args.minScore !== undefined || args.maxScore !== undefined) {
      filtered = roasts.filter((roast) => {
        if (args.minScore !== undefined && roast.avgScore < args.minScore) {
          return false;
        }
        if (args.maxScore !== undefined && roast.avgScore > args.maxScore) {
          return false;
        }
        return true;
      });
    }

    return filtered;
  },
});

export const searchPublicRoasts = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allRoasts = await ctx.db
      .query("publicRoasts")
      .withIndex("by_date")
      .order("desc")
      .take(args.limit || 100);

    const searchLower = args.searchTerm.toLowerCase();
    return allRoasts.filter(
      (roast) =>
        roast.pitch.toLowerCase().includes(searchLower) ||
        roast.verdict.toLowerCase().includes(searchLower) ||
        roast.category.toLowerCase().includes(searchLower)
    );
  },
});

