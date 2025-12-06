import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, RoasterOutput } from "./types";
import { callLLMWithTools, parseJSON } from "./base";
import { getMonetizationSkepticPrompt } from "./prompts";

export const evaluateMonetization = action({
  args: {
    ideaData: v.any(),
    agentConfig: v.object({
      provider: v.union(v.literal("openai"), v.literal("anthropic")),
      model: v.string(),
      apiKey: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;
    const { provider, model, apiKey } = args.agentConfig;

    // Prompt now includes tool usage instructions when needed
    const prompt = getMonetizationSkepticPrompt(ideaData, {});

    const response = await callLLMWithTools(prompt, provider, apiKey, model, {
      temperature: ideaData.brutality === "savage" ? 0.7 : ideaData.brutality === "honest" ? 0.4 : 0.2,
      responseFormat: "json",
      ideaData,
    });

    const output = parseJSON<RoasterOutput>(response);
    return output;
  },
});
