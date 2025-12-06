import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, SynthesisOutput, RoasterOutput, MentorOutput } from "./types";
import { callLLM, parseJSON } from "./base";
import { getSynthesisPrompt } from "./prompts";

export const generateFixes = action({
  args: {
    ideaData: v.any(),
    roasterOutputs: v.any(),
    mentorOutput: v.any(),
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
    const mentorOutput = args.mentorOutput as MentorOutput;

    const prompt = getSynthesisPrompt(ideaData, roasterOutputs, mentorOutput);

    // Use Anthropic for more thoughtful synthesis, adjust temperature based on brutality
    const response = await callLLM(prompt, "anthropic", {
      temperature: ideaData.brutality === "savage" ? 0.7 : ideaData.brutality === "honest" ? 0.4 : 0.2,
      responseFormat: "json",
    });

    const output = parseJSON<SynthesisOutput>(response);
    return output;
  },
});

