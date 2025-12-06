import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, RoasterOutput } from "./types";
import { callLLMWithTools, parseJSON } from "./base";
import { getMonetizationSkepticPrompt } from "./prompts";

export const evaluateMonetization = action({
  args: {
    ideaData: v.any(),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;

    // Enhanced prompt that encourages tool use
    const prompt = `${getMonetizationSkepticPrompt(ideaData, {})}

IMPORTANT: Use the get_pricing_benchmark tool to validate pricing claims. Check if their price (${ideaData.price || "not specified"}) is realistic compared to market benchmarks.`;

    const response = await callLLMWithTools(prompt, "openai", {
      temperature: ideaData.brutality === "savage" ? 0.7 : ideaData.brutality === "honest" ? 0.4 : 0.2,
      responseFormat: "json",
      ideaData,
    });

    const output = parseJSON<RoasterOutput>(response);
    return output;
  },
});
