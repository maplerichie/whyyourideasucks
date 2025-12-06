import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, MentorOutput, RoasterOutput } from "./types";
import { callLLMWithTools, parseJSON } from "./base";
import { getMentorPrompt } from "./prompts";

export const generateMentorSuggestions = action({
  args: {
    ideaData: v.any(),
    roasterOutputs: v.any(),
    agentConfig: v.object({
      provider: v.union(v.literal("openai"), v.literal("anthropic")),
      model: v.string(),
      apiKey: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;
    const roasterOutputs = args.roasterOutputs as {
      market: RoasterOutput;
      distribution: RoasterOutput;
      monetization: RoasterOutput;
      defensibility: RoasterOutput;
      founder_fit: RoasterOutput;
      hackathon: RoasterOutput;
    };
    const { provider, model, apiKey } = args.agentConfig;

    // Prompt now includes roaster critiques and tool usage instructions when needed
    const prompt = getMentorPrompt(ideaData, roasterOutputs, {});

    // Use tool access for more thoughtful responses
    const response = await callLLMWithTools(prompt, provider, apiKey, model, {
      temperature: 0.3,
      responseFormat: "json",
      ideaData,
    });

    const output = parseJSON<MentorOutput>(response);
    return output;
  },
});
