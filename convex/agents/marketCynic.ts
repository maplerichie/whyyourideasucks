import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, RoasterOutput } from "./types";
import { callLLMWithTools, parseJSON } from "./base";
import { getMarketCynicPrompt } from "./prompts";

export const evaluateMarket = action({
  args: {
    ideaData: v.any(),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;

    // Enhanced prompt that encourages tool use
    const prompt = `${getMarketCynicPrompt(ideaData)}

IMPORTANT: Use the search_competitors and search_market_data tools to validate your critique with real-world data. Don't just guess - use tools to find actual competitors and market information.`;

    // Call LLM with tool access - it will automatically use tools if needed
    const response = await callLLMWithTools(prompt, "openai", {
      temperature: ideaData.brutality === "savage" ? 0.7 : ideaData.brutality === "honest" ? 0.4 : 0.2,
      responseFormat: "json",
      ideaData,
    });

    // Parse and return
    const output = parseJSON<RoasterOutput>(response);
    return output;
  },
});
