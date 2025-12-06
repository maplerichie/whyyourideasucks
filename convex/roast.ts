import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { IdeaData, FinalRoastOutput } from "./agents/types";

export const generateRoast = action({
  args: {
    ideaData: v.object({
      pitch: v.string(),
      category: v.string(),
      stage: v.string(),
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
      monetizationModel: v.string(),
      price: v.optional(v.number()),
      teamFit: v.string(),
      tractionMetrics: v.optional(v.string()),
      brutality: v.union(v.literal("gentle"), v.literal("honest"), v.literal("savage")),
    }),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;

    // Phase 1: Run 5 roaster agents in parallel
    const [
      marketResult,
      distributionResult,
      monetizationResult,
      defensibilityResult,
      hackathonResult,
      founderFitResult,
    ] = await Promise.all([
      ctx.runAction(api.agents.marketCynic.evaluateMarket, { ideaData }),
      ctx.runAction(api.agents.distributionHater.evaluateDistribution, { ideaData }),
      ctx.runAction(api.agents.monetizationSkeptic.evaluateMonetization, { ideaData }),
      ctx.runAction(api.agents.defensibilityCop.evaluateDefensibility, { ideaData }),
      ctx.runAction(api.agents.hackathonRealityCheck.evaluateHackathon, { ideaData }),
      ctx.runAction(api.agents.founderFit.evaluateFounderFit, { ideaData }),
    ]);

    // Phase 2: Run mentor agent
    const mentorResult = await ctx.runAction(api.agents.mentor.generateMentorSuggestions, { ideaData });

    // Phase 3: Run synthesis agent
    const synthesisResult = await ctx.runAction(api.agents.fixGenerator.generateFixes, {
      ideaData,
      roasterOutputs: {
        market: marketResult,
        distribution: distributionResult,
        monetization: monetizationResult,
        defensibility: defensibilityResult,
        founder_fit: founderFitResult,
        hackathon: hackathonResult,
      },
      mentorOutput: mentorResult,
    });

    // Combine all results into final output schema
    const finalOutput: FinalRoastOutput = {
      verdict: synthesisResult.verdict,
      brutality: ideaData.brutality,
      scores: {
        market: {
          score: marketResult.score,
          why_sucks: marketResult.why_sucks,
          fix: synthesisResult.fixes.market,
        },
        distribution: {
          score: distributionResult.score,
          why_sucks: distributionResult.why_sucks,
          fix: synthesisResult.fixes.distribution,
        },
        monetization: {
          score: monetizationResult.score,
          why_sucks: monetizationResult.why_sucks,
          fix: synthesisResult.fixes.monetization,
        },
        defensibility: {
          score: defensibilityResult.score,
          why_sucks: defensibilityResult.why_sucks,
          fix: synthesisResult.fixes.defensibility,
        },
        founder_fit: {
          score: founderFitResult.score,
          why_sucks: founderFitResult.why_sucks,
          fix: synthesisResult.fixes.founder_fit,
        },
        hackathon: {
          score: hackathonResult.score,
          why_sucks: hackathonResult.why_sucks,
          fix: synthesisResult.fixes.hackathon,
        },
      },
      pivots: mentorResult.pivots.slice(0, 3),
      next7days: mentorResult.next7days.slice(0, 7),
    };

    return finalOutput;
  },
});
