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

export type RoasterOutput = {
  score: number; // 1-10
  why_sucks: string; // One brutal sentence
};

export type MentorOutput = {
  improvements: string[]; // Constructive suggestions/improvements based on roast critiques
  precautions: string[]; // Things to watch out for when implementing improvements
  implementationSteps: string[]; // Step-by-step implementation guidance from product manager perspective
};

export type SynthesisOutput = {
  verdict: string; // Overall judgment
  fixes: {
    market: string[];
    distribution: string[];
    monetization: string[];
    defensibility: string[];
    founder_fit: string[];
    hackathon: string[];
  };
};

export type FinalRoastOutput = {
  verdict: string;
  brutality: "gentle" | "honest" | "savage";
  scores: {
    market: { score: number; why_sucks: string; fix: string[] };
    distribution: { score: number; why_sucks: string; fix: string[] };
    monetization: { score: number; why_sucks: string; fix: string[] };
    defensibility: { score: number; why_sucks: string; fix: string[] };
    founder_fit: { score: number; why_sucks: string; fix: string[] };
    hackathon: { score: number; why_sucks: string; fix: string[] };
  };
  improvements: string[];
  precautions: string[];
  implementationSteps: string[];
};

