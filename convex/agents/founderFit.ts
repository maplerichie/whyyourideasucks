import { action } from "../_generated/server";
import { v } from "convex/values";
import type { IdeaData, RoasterOutput } from "./types";
import { callLLM, parseJSON } from "./base";

export const evaluateFounderFit = action({
  args: {
    ideaData: v.any(),
  },
  handler: async (ctx, args) => {
    const ideaData = args.ideaData as IdeaData;

    const brutalityTone = {
      gentle: "Be direct but respectful about team fit issues.",
      honest: "Be brutally honest about founder-idea fit.",
      savage: "Go full savage on founder fit problems.",
    }[ideaData.brutality];

    const prompt = `You are Founder Fit Analyst, a brutal team analyst. Your job is to evaluate if the team has unfair advantage for this idea.

${brutalityTone}

Evaluate this startup's founder-idea fit:
- Team fit: "${ideaData.teamFit}"
- Traction: ${ideaData.tractionMetrics || "None"}
- Idea: "${ideaData.pitch}"

Assess:
- Does the team have relevant experience?
- Is there an unfair advantage (domain expertise, network, data)?
- Or just "we're passionate"?
- Can they execute on this idea?

Output ONLY valid JSON matching this schema:
{
  "score": 1-10,
  "why_sucks": "One brutal sentence about founder fit issues"
}

Be critical. Demand unfair advantage. Flag passion-only teams.`;

    const response = await callLLM(prompt, "openai", {
      temperature: ideaData.brutality === "savage" ? 0.7 : ideaData.brutality === "honest" ? 0.4 : 0.2,
      responseFormat: "json",
    });

    const output = parseJSON<RoasterOutput>(response);
    return output;
  },
});

