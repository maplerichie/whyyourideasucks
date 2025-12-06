import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, RoasterOutput } from "./types";
import { callLLM, parseJSON } from "./base";
import { getHackathonRealityCheckPrompt } from "./prompts";

export const evaluateHackathon = action({
  args: {
    ideaData: v.any(),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;

    const prompt = getHackathonRealityCheckPrompt(ideaData);

    const response = await callLLM(prompt, "openai", {
      temperature: ideaData.brutality === "savage" ? 0.7 : ideaData.brutality === "honest" ? 0.4 : 0.2,
      responseFormat: "json",
    });

    const output = parseJSON<RoasterOutput>(response);
    return output;
  },
});

