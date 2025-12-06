import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ideas: defineTable({
    // Stage 1: Idea Basics
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

    // Stage 2: Market & Users
    targetUser: v.string(),
    tam: v.number(), // TAM in dollars
    problemUrgency: v.number(), // 1-10
    alternatives: v.string(),
    evidence: v.optional(v.string()),

    // Stage 3: Go-to-Market
    distribution: v.string(),
    distributionChannels: v.array(v.string()), // e.g., ["SEO", "Paid", "Viral"]
    cacGuess: v.optional(v.number()),
    unfairEdge: v.string(),

    // Stage 4: Money & Fit
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

    // Metadata
    brutality: v.union(v.literal("gentle"), v.literal("honest"), v.literal("savage")),
    userId: v.optional(v.id("users")), // Convex Auth user ID
    createdAt: v.number(),
  }),

  roasts: defineTable({
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
    createdAt: v.number(),
  }),

  publicRoasts: defineTable({
    roastId: v.id("roasts"),
    ideaId: v.id("ideas"),
    // Denormalized fields for directory display
    pitch: v.string(),
    category: v.string(),
    verdict: v.string(),
    avgScore: v.number(), // Average of all dimension scores
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_score", ["avgScore"])
    .index("by_date", ["createdAt"]),
});

