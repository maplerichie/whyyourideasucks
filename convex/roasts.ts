import { mutation, query } from "./_generated/server";
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
    improvements: v.array(v.string()),
    precautions: v.array(v.string()),
    implementationSteps: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const roastId = await ctx.db.insert("roasts", {
      ...args,
      createdAt: Date.now(),
    });
    return roastId;
  },
});

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

// Helper function to calculate average score
function calculateAvgScore(scores: any): number {
  return (
    (scores.market.score +
      scores.distribution.score +
      scores.monetization.score +
      scores.defensibility.score +
      scores.founder_fit.score +
      scores.hackathon.score) /
    6
  );
}

export const getAllRoasts = query({
  args: {
    category: v.optional(v.string()),
    minScore: v.optional(v.number()),
    maxScore: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get all roasts ordered by date
    let roasts = await ctx.db
      .query("roasts")
      .withIndex("by_date")
      .order("desc")
      .take(args.limit || 100);

    // Join with ideas and filter
    const roastsWithIdeas = await Promise.all(
      roasts.map(async (roast) => {
        const idea = await ctx.db.get(roast.ideaId);
        if (!idea) return null;

        const avgScore = calculateAvgScore(roast.scores);

        // Filter by category
        if (args.category && idea.category !== args.category) {
          return null;
        }

        // Filter by score range
        if (args.minScore !== undefined && avgScore < args.minScore) {
          return null;
        }
        if (args.maxScore !== undefined && avgScore > args.maxScore) {
          return null;
        }

        return {
          _id: roast._id,
          roastId: roast._id,
          ideaId: idea._id,
          pitch: idea.pitch,
          category: idea.category,
          verdict: roast.verdict,
          avgScore: Math.round(avgScore * 10) / 10,
          createdAt: roast.createdAt,
        };
      })
    );

    return roastsWithIdeas.filter((r) => r !== null);
  },
});

export const searchRoasts = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const allRoasts = await ctx.db
      .query("roasts")
      .withIndex("by_date")
      .order("desc")
      .take(args.limit || 100);

    const searchLower = args.searchTerm.toLowerCase();

    const results = await Promise.all(
      allRoasts.map(async (roast) => {
        const idea = await ctx.db.get(roast.ideaId);
        if (!idea) return null;

        const matches =
          idea.pitch.toLowerCase().includes(searchLower) ||
          roast.verdict.toLowerCase().includes(searchLower) ||
          idea.category.toLowerCase().includes(searchLower);

        if (!matches) return null;

        const avgScore = calculateAvgScore(roast.scores);

        return {
          _id: roast._id,
          roastId: roast._id,
          ideaId: idea._id,
          pitch: idea.pitch,
          category: idea.category,
          verdict: roast.verdict,
          avgScore: Math.round(avgScore * 10) / 10,
          createdAt: roast.createdAt,
        };
      })
    );

    return results.filter((r) => r !== null);
  },
});

