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
    settings: v.object({
      openaiApiKey: v.optional(v.string()),
      anthropicApiKey: v.optional(v.string()),
      agents: v.object({
        marketCynic: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
        distributionHater: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
        monetizationSkeptic: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
        defensibilityCop: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
        founderFit: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
        hackathonRealityCheck: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
        mentor: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
        fixGenerator: v.object({
          provider: v.union(v.literal("openai"), v.literal("anthropic")),
          model: v.string(),
        }),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;
    const settings = args.settings;

    // Helper to get API key for a provider
    const getApiKey = (provider: "openai" | "anthropic"): string => {
      if (provider === "openai") {
        if (!settings.openaiApiKey) {
          throw new Error("OpenAI API key is required but not provided");
        }
        return settings.openaiApiKey;
      } else {
        if (!settings.anthropicApiKey) {
          throw new Error("Anthropic API key is required but not provided");
        }
        return settings.anthropicApiKey;
      }
    };

    // Helper to create agent config
    const getAgentConfig = (agentKey: keyof typeof settings.agents) => {
      const agent = settings.agents[agentKey];
      return {
        provider: agent.provider,
        model: agent.model,
        apiKey: getApiKey(agent.provider),
      };
    };

    // Phase 1: Run 6 roaster agents in parallel
    const [
      marketResult,
      distributionResult,
      monetizationResult,
      defensibilityResult,
      hackathonResult,
      founderFitResult,
    ] = await Promise.all([
      ctx.runAction(api.agents.marketCynic.evaluateMarket, {
        ideaData,
        agentConfig: getAgentConfig("marketCynic"),
      }),
      ctx.runAction(api.agents.distributionHater.evaluateDistribution, {
        ideaData,
        agentConfig: getAgentConfig("distributionHater"),
      }),
      ctx.runAction(api.agents.monetizationSkeptic.evaluateMonetization, {
        ideaData,
        agentConfig: getAgentConfig("monetizationSkeptic"),
      }),
      ctx.runAction(api.agents.defensibilityCop.evaluateDefensibility, {
        ideaData,
        agentConfig: getAgentConfig("defensibilityCop"),
      }),
      ctx.runAction(api.agents.hackathonRealityCheck.evaluateHackathon, {
        ideaData,
        agentConfig: getAgentConfig("hackathonRealityCheck"),
      }),
      ctx.runAction(api.agents.founderFit.evaluateFounderFit, {
        ideaData,
        agentConfig: getAgentConfig("founderFit"),
      }),
    ]);

    // Phase 2: Run mentor agent with roaster critiques
    const mentorResult = await ctx.runAction(api.agents.mentor.generateMentorSuggestions, {
      ideaData,
      roasterOutputs: {
        market: marketResult,
        distribution: distributionResult,
        monetization: monetizationResult,
        defensibility: defensibilityResult,
        founder_fit: founderFitResult,
        hackathon: hackathonResult,
      },
      agentConfig: getAgentConfig("mentor"),
    });

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
      agentConfig: getAgentConfig("fixGenerator"),
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
      improvements: mentorResult.improvements,
      precautions: mentorResult.precautions,
      implementationSteps: mentorResult.implementationSteps,
    };

    return finalOutput;
  },
});
