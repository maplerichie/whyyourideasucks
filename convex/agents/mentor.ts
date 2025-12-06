import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, MentorOutput } from "./types";
import { callLLMWithTools, parseJSON } from "./base";
import { getMentorPrompt } from "./prompts";

export const generateMentorSuggestions = action({
  args: {
    ideaData: v.any(),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;

    // Enhanced prompt that encourages tool use
    const prompt = `${getMentorPrompt(ideaData, {})}

IMPORTANT: Use the search_competitors and get_pricing_benchmark tools to provide realistic, data-backed pivots and suggestions. Don't just suggest generic improvements - use real market data.`;

    // Use Anthropic with tool access for more thoughtful responses
    const response = await callLLMWithTools(prompt, "anthropic", {
      temperature: 0.3,
      responseFormat: "json",
      ideaData,
    });

    const output = parseJSON<MentorOutput>(response);
    return output;
  },
});
