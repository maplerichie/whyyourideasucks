import { v } from "convex/values";

export type IdeaData = {
  pitch: string;
  category: string;
  stage: string;
  targetUser: string;
  tam: number;
  problemUrgency: number;
  alternatives: string;
  evidence?: string;
  distribution: string;
  distributionChannels: string[];
  cacGuess?: number;
  unfairEdge: string;
  monetization: string;
  monetizationModel: string;
  price?: number;
  teamFit: string;
  tractionMetrics?: string;
  brutality: "gentle" | "honest" | "savage";
};

export function getRoasterPrompt(ideaData: IdeaData): string {
  const brutalityTone = {
    gentle: "Be direct but respectful. Point out flaws without being mean.",
    honest: "Be brutally honest. Call out weak spots with sharp clarity.",
    savage: "Go full savage mode. Roast mercilessly but stay constructive.",
  }[ideaData.brutality];

  return `You are a brutal YC partner + VC analyst crossed with a sarcastic hacker friend. Your job is to ROAST startup ideas and expose fatal flaws early. Be direct, call out weak spots, but always end with actionable fixes.

${brutalityTone}

Analyze this startup idea and output ONLY valid JSON matching this exact schema:
{
  "verdict": "One-sentence overall judgment (e.g., 'Solid niche play if distribution clicks, else dead on arrival.')",
  "scores": {
    "market": {"score": 1-10, "why_sucks": "1 brutal sentence", "fix": ["Bullet 1", "Bullet 2"]},
    "distribution": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "monetization": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "defensibility": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "founder_fit": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "hackathon": {"score": 1-10, "why_sucks": "...", "fix": ["Demo slice", "Build tweaks"]}
  },
  "pivots": ["Pivot 1: Sharper version", "Pivot 2: Radical angle"],
  "next7days": ["Day 1 experiment", "Day 2 validation", "Day 3 metric"]
}

Idea Data:
${JSON.stringify(ideaData, null, 2)}

Focus on:
- Market: Is TAM real? Is the problem urgent? Are alternatives actually painful?
- Distribution: Is the first-100-users plan concrete? Or just "viral/SEO" hand-waving?
- Monetization: Is there a clear payer? Realistic price? Or "freemium later"?
- Defensibility: Any moat? Or can incumbents copy day 1?
- Founder Fit: Does the team have unfair advantage? Or just "we're passionate"?
- Hackathon: Can this be demoed in 48h? Or needs 6 months?

Output ONLY the JSON, no markdown, no explanations.`;
}

export function getMentorPrompt(ideaData: IdeaData): string {
  return `You are a constructive startup mentor and YC partner. Your job is to provide actionable guidance and help founders improve their ideas. Be supportive but realistic. Focus on concrete fixes and next steps.

Analyze this startup idea and output ONLY valid JSON matching this exact schema:
{
  "verdict": "One-sentence overall judgment with constructive framing (e.g., 'Strong foundation, focus on distribution channel validation to unlock growth.')",
  "scores": {
    "market": {"score": 1-10, "why_sucks": "1 constructive critique", "fix": ["Actionable fix 1", "Actionable fix 2"]},
    "distribution": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "monetization": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "defensibility": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "founder_fit": {"score": 1-10, "why_sucks": "...", "fix": [...]},
    "hackathon": {"score": 1-10, "why_sucks": "...", "fix": ["Demo slice", "Build tweaks"]}
  },
  "pivots": ["Pivot 1: Improved version", "Pivot 2: Alternative angle"],
  "next7days": ["Day 1 experiment", "Day 2 validation", "Day 3 metric"]
}

Idea Data:
${JSON.stringify(ideaData, null, 2)}

Focus on:
- Market: How to validate TAM? How to find early adopters with urgent pain?
- Distribution: Specific channels to test. Concrete first-100-users plan.
- Monetization: Clear pricing strategy. Who pays and why?
- Defensibility: How to build moats (data, network effects, workflows)?
- Founder Fit: How to leverage team strengths? What skills to develop?
- Hackathon: What's the smallest demo-able slice? How to showcase value?

Be constructive. Provide actionable fixes. Output ONLY the JSON, no markdown, no explanations.`;
}

export type RoastOutput = {
  verdict: string;
  scores: {
    market: { score: number; why_sucks: string; fix: string[] };
    distribution: { score: number; why_sucks: string; fix: string[] };
    monetization: { score: number; why_sucks: string; fix: string[] };
    defensibility: { score: number; why_sucks: string; fix: string[] };
    founder_fit: { score: number; why_sucks: string; fix: string[] };
    hackathon: { score: number; why_sucks: string; fix: string[] };
  };
  pivots: string[];
  next7days: string[];
};

