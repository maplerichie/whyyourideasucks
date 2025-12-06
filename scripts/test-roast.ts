#!/usr/bin/env tsx
/**
 * Test script to run the full roast generation process
 * Usage: npx tsx scripts/test-roast.ts
 */
require('dotenv').config();
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";

// Sample idea data - testing with "whyyourideasucks.ai" concept
const sampleIdea = {
  pitch: "whyyourideasucks.ai - A platform that uses AI to brutally evaluate startup ideas, providing honest feedback on market viability, distribution, monetization, and defensibility. Perfect for hackathon judges and founders who want quick, unfiltered feedback.",
  category: "B2B/SaaS",
  stage: "MVP built",
  targetUser: "Startup founders, hackathon judges, investors",
  tam: 50000000,
  problemUrgency: 8,
  alternatives: "Manual idea evaluation, YC application process, expensive consultants",
  evidence: "Founders waste time on bad ideas. Hackathon judges need quick evaluations.",
  distribution: "Product Hunt launch, Twitter/X virality, YC community, hackathon partnerships",
  distributionChannels: ["Product Hunt", "Twitter/X", "YC Community", "Hackathons"],
  cacGuess: 15,
  unfairEdge: "First-mover in brutal AI feedback space, terminal hacker aesthetic, YC-style grilling",
  monetization: "Freemium model with premium detailed reports and API access",
  monetizationModel: "Freemium",
  price: 29,
  teamFit: "Technical founder with AI/ML background, experience in startup evaluation",
  tractionMetrics: "Early beta users, positive feedback from hackathon judges",
  brutality: "savage" as const,
};

interface LogEntry {
  timestamp: string;
  phase: string;
  step: string;
  status: "start" | "success" | "error";
  duration?: number;
  data?: any;
  error?: string;
}

class RoastTester {
  private client: ConvexHttpClient;
  private logs: LogEntry[] = [];
  private startTime: number;

  constructor(convexUrl: string) {
    this.client = new ConvexHttpClient(convexUrl);
    this.startTime = Date.now();
  }

  private log(phase: string, step: string, status: "start" | "success" | "error", data?: any, error?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      phase,
      step,
      status,
      data,
      error,
    };
    this.logs.push(entry);

    const emoji = status === "success" ? "✅" : status === "error" ? "❌" : "🔄";
    const duration = entry.data?.duration ? ` (${entry.data.duration}ms)` : "";
    console.log(`${emoji} [${phase}] ${step}${duration}`);

    if (error) {
      console.error(`   Error: ${error}`);
    }
    if (data && status === "success") {
      console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
    }
  }

  async runTest() {
    console.log("🚀 Starting Roast Generation Test");
    console.log("=".repeat(60));
    console.log(`📝 Testing Idea: ${sampleIdea.pitch.substring(0, 80)}...`);
    console.log("=".repeat(60));
    console.log("");

    const agentResults: any = {};

    try {
      // Phase 1: Run all roaster agents in parallel
      console.log("📊 PHASE 1: Running Roaster Agents (Parallel)");
      console.log("-".repeat(60));

      this.log("PHASE_1", "roaster_agents", "start");
      const phase1Start = Date.now();

      const [
        marketResult,
        distributionResult,
        monetizationResult,
        defensibilityResult,
        hackathonResult,
        founderFitResult,
      ] = await Promise.all([
        this.runAgent("Market Cynic", api.agents.marketCynic.evaluateMarket, { ideaData: sampleIdea }),
        this.runAgent("Distribution Hater", api.agents.distributionHater.evaluateDistribution, { ideaData: sampleIdea }),
        this.runAgent("Monetization Skeptic", api.agents.monetizationSkeptic.evaluateMonetization, { ideaData: sampleIdea }),
        this.runAgent("Defensibility Cop", api.agents.defensibilityCop.evaluateDefensibility, { ideaData: sampleIdea }),
        this.runAgent("Hackathon Reality Check", api.agents.hackathonRealityCheck.evaluateHackathon, { ideaData: sampleIdea }),
        this.runAgent("Founder Fit Analyst", api.agents.founderFit.evaluateFounderFit, { ideaData: sampleIdea }),
      ]);

      agentResults.market = marketResult;
      agentResults.distribution = distributionResult;
      agentResults.monetization = monetizationResult;
      agentResults.defensibility = defensibilityResult;
      agentResults.hackathon = hackathonResult;
      agentResults.founderFit = founderFitResult;

      const phase1Duration = Date.now() - phase1Start;
      this.log("PHASE_1", "roaster_agents", "success", {
        duration: phase1Duration,
        agentsCompleted: 6,
      });

      console.log("");

      // Phase 2: Run mentor agent
      console.log("💡 PHASE 2: Running Mentor Agent");
      console.log("-".repeat(60));

      this.log("PHASE_2", "mentor_agent", "start");
      const phase2Start = Date.now();

      const mentorResult = await this.runAgent(
        "Mentor",
        api.agents.mentor.generateMentorSuggestions,
        { ideaData: sampleIdea }
      );

      agentResults.mentor = mentorResult;

      const phase2Duration = Date.now() - phase2Start;
      this.log("PHASE_2", "mentor_agent", "success", {
        duration: phase2Duration,
        pivotsCount: mentorResult.pivots?.length || 0,
        next7daysCount: mentorResult.next7days?.length || 0,
      });

      console.log("");

      // Phase 3: Run synthesis agent
      console.log("🔬 PHASE 3: Running Synthesis Agent");
      console.log("-".repeat(60));

      this.log("PHASE_3", "synthesis_agent", "start");
      const phase3Start = Date.now();

      const synthesisResult = await this.runAgent(
        "Synthesis Agent",
        api.agents.fixGenerator.generateFixes,
        {
          ideaData: sampleIdea,
          roasterOutputs: {
            market: marketResult,
            distribution: distributionResult,
            monetization: monetizationResult,
            defensibility: defensibilityResult,
            founder_fit: founderFitResult,
            hackathon: hackathonResult,
          },
          mentorOutput: mentorResult,
        }
      );

      agentResults.synthesis = synthesisResult;

      const phase3Duration = Date.now() - phase3Start;
      this.log("PHASE_3", "synthesis_agent", "success", {
        duration: phase3Duration,
        verdict: synthesisResult.verdict,
        fixesCount: Object.keys(synthesisResult.fixes || {}).length,
      });

      console.log("");

      // Phase 4: Combine results
      console.log("📋 PHASE 4: Combining Final Results");
      console.log("-".repeat(60));

      const roastResult = {
        verdict: synthesisResult.verdict,
        brutality: sampleIdea.brutality,
        scores: {
          market: {
            score: marketResult.score,
            why_sucks: marketResult.why_sucks,
            fix: synthesisResult.fixes.market,
          },
          distribution: {
            score: distributionResult.score,
            why_sucks: distributionResult.why_sucks,
            fix: synthesisResult.fixes.distribution,
          },
          monetization: {
            score: monetizationResult.score,
            why_sucks: monetizationResult.why_sucks,
            fix: synthesisResult.fixes.monetization,
          },
          defensibility: {
            score: defensibilityResult.score,
            why_sucks: defensibilityResult.why_sucks,
            fix: synthesisResult.fixes.defensibility,
          },
          founder_fit: {
            score: founderFitResult.score,
            why_sucks: founderFitResult.why_sucks,
            fix: synthesisResult.fixes.founder_fit,
          },
          hackathon: {
            score: hackathonResult.score,
            why_sucks: hackathonResult.why_sucks,
            fix: synthesisResult.fixes.hackathon,
          },
        },
        pivots: mentorResult.pivots.slice(0, 3),
        next7days: mentorResult.next7days.slice(0, 7),
      };

      this.log("PHASE_4", "combine_results", "success", {
        verdict: roastResult.verdict,
        scoresCount: Object.keys(roastResult.scores).length,
        pivotsCount: roastResult.pivots.length,
        next7daysCount: roastResult.next7days.length,
      });

      // Save results
      await this.saveResults(roastResult, undefined, agentResults);

      // Summary
      const totalDuration = Date.now() - this.startTime;
      console.log("");
      console.log("=".repeat(60));
      console.log("✅ TEST COMPLETED SUCCESSFULLY");
      console.log("=".repeat(60));
      console.log(`⏱️  Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
      console.log(`📊 Verdict: ${roastResult.verdict}`);
      console.log(`📈 Average Score: ${this.calculateAverageScore(roastResult.scores).toFixed(1)}/10`);
      console.log(`💡 Pivots Generated: ${roastResult.pivots.length}`);
      console.log(`📅 Action Items: ${roastResult.next7days.length}`);
      console.log(`📁 Results saved to: log/roast-${Date.now()}.json`);
      console.log(`📋 Full log saved to: log/test-${Date.now()}.log.json`);
      console.log("=".repeat(60));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log("ERROR", "test_execution", "error", undefined, errorMessage);
      console.error("");
      console.error("❌ TEST FAILED");
      console.error("Error:", errorMessage);
      if (error instanceof Error && error.stack) {
        console.error("Stack:", error.stack);
      }
      await this.saveResults(null, error, agentResults);
      process.exit(1);
    }
  }

  private getAgentConfig(agentName: string) {
    // Get provider and model from environment or use defaults
    const provider = (process.env.TEST_PROVIDER || "anthropic") as "openai" | "anthropic";
    const model = process.env.TEST_MODEL || (provider === "openai" ? "gpt-4o" : "claude-haiku-4-5-20251001");
    
    // Get API key from environment
    const apiKey = provider === "openai" 
      ? (process.env.OPENAI_API_KEY || process.env.TEST_OPENAI_API_KEY || "")
      : (process.env.ANTHROPIC_API_KEY || process.env.TEST_ANTHROPIC_API_KEY || "");
    
    if (!apiKey) {
      throw new Error(`${provider} API key is required. Set ${provider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY"} environment variable.`);
    }
    
    return {
      provider,
      model,
      apiKey,
    };
  }

  private async runAgent(agentName: string, action: any, args: any) {
    const startTime = Date.now();
    this.log("AGENT", agentName.toLowerCase().replace(/\s+/g, "_"), "start");

    try {
      // Add agentConfig to args if not already present
      const agentConfig = this.getAgentConfig(agentName);
      const argsWithConfig = {
        ...args,
        agentConfig,
      };
      
      const result = await this.client.action(action, argsWithConfig);
      const duration = Date.now() - startTime;

      // Log agent output
      console.log(`   📊 Score: ${result.score || "N/A"}/10`);
      if (result.why_sucks) {
        console.log(`   💬 Why: ${result.why_sucks}`);
      }
      if (result.pivots) {
        console.log(`   💡 Pivots: ${result.pivots.length}`);
        result.pivots.slice(0, 2).forEach((p: string, i: number) => {
          console.log(`      ${i + 1}. ${p.substring(0, 80)}...`);
        });
      }
      if (result.next7days) {
        console.log(`   📅 Next 7 Days: ${result.next7days.length} actions`);
      }
      if (result.verdict) {
        console.log(`   🎯 Verdict: ${result.verdict.substring(0, 100)}...`);
      }
      if (result.fixes) {
        console.log(`   🔧 Fixes: ${Object.keys(result.fixes).length} dimensions`);
      }

      this.log("AGENT", agentName.toLowerCase().replace(/\s+/g, "_"), "success", {
        duration,
        output: result,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log("AGENT", agentName.toLowerCase().replace(/\s+/g, "_"), "error", { duration }, errorMessage);
      throw error;
    }
  }

  private calculateAverageScore(scores: any): number {
    const scoreValues = Object.values(scores).map((s: any) => s.score);
    return scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length;
  }

  private async saveResults(result: any, error?: any, agentResults?: any) {
    // Ensure log directory exists
    const logDir = path.join(process.cwd(), "log");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = Date.now();

    // Save full roast result
    if (result) {
      const resultFile = path.join(logDir, `roast-${timestamp}.json`);
      fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
      console.log(`💾 Saved roast result to: ${resultFile}`);
    }

    // Save full test log
    const logFile = path.join(logDir, `test-${timestamp}.log.json`);
    const logData = {
      testInfo: {
        timestamp: new Date().toISOString(),
        idea: sampleIdea,
        totalDuration: Date.now() - this.startTime,
      },
      logs: this.logs,
      agentResults: agentResults || null,
      result: result || null,
      error: error ? {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      } : null,
    };
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
    console.log(`💾 Saved full log to: ${logFile}`);

    // Save human-readable log
    const readableLogFile = path.join(logDir, `test-${timestamp}.log.txt`);
    let readableLog = "=".repeat(60) + "\n";
    readableLog += "ROAST GENERATION TEST LOG\n";
    readableLog += "=".repeat(60) + "\n\n";
    readableLog += `Test Time: ${new Date().toISOString()}\n`;
    readableLog += `Total Duration: ${Date.now() - this.startTime}ms\n\n`;
    readableLog += `Idea: ${sampleIdea.pitch}\n\n`;
    readableLog += "=".repeat(60) + "\n";
    readableLog += "PROCESS LOG\n";
    readableLog += "=".repeat(60) + "\n\n";

    for (const entry of this.logs) {
      const emoji = entry.status === "success" ? "✅" : entry.status === "error" ? "❌" : "🔄";
      readableLog += `${emoji} [${entry.timestamp}] ${entry.phase} - ${entry.step}\n`;
      if (entry.duration) {
        readableLog += `   Duration: ${entry.duration}ms\n`;
      }
      if (entry.error) {
        readableLog += `   Error: ${entry.error}\n`;
      }
      if (entry.data) {
        readableLog += `   Data: ${JSON.stringify(entry.data, null, 2)}\n`;
      }
      readableLog += "\n";
    }

    if (agentResults) {
      readableLog += "=".repeat(60) + "\n";
      readableLog += "AGENT OUTPUTS\n";
      readableLog += "=".repeat(60) + "\n\n";

      // Roaster Agents
      readableLog += "ROASTER AGENTS:\n\n";
      if (agentResults.market) {
        readableLog += "Market Cynic:\n";
        readableLog += `  Score: ${agentResults.market.score}/10\n`;
        readableLog += `  Why: ${agentResults.market.why_sucks}\n\n`;
      }
      if (agentResults.distribution) {
        readableLog += "Distribution Hater:\n";
        readableLog += `  Score: ${agentResults.distribution.score}/10\n`;
        readableLog += `  Why: ${agentResults.distribution.why_sucks}\n\n`;
      }
      if (agentResults.monetization) {
        readableLog += "Monetization Skeptic:\n";
        readableLog += `  Score: ${agentResults.monetization.score}/10\n`;
        readableLog += `  Why: ${agentResults.monetization.why_sucks}\n\n`;
      }
      if (agentResults.defensibility) {
        readableLog += "Defensibility Cop:\n";
        readableLog += `  Score: ${agentResults.defensibility.score}/10\n`;
        readableLog += `  Why: ${agentResults.defensibility.why_sucks}\n\n`;
      }
      if (agentResults.hackathon) {
        readableLog += "Hackathon Reality Check:\n";
        readableLog += `  Score: ${agentResults.hackathon.score}/10\n`;
        readableLog += `  Why: ${agentResults.hackathon.why_sucks}\n\n`;
      }
      if (agentResults.founderFit) {
        readableLog += "Founder Fit Analyst:\n";
        readableLog += `  Score: ${agentResults.founderFit.score}/10\n`;
        readableLog += `  Why: ${agentResults.founderFit.why_sucks}\n\n`;
      }

      // Mentor Agent
      if (agentResults.mentor) {
        readableLog += "MENTOR AGENT:\n\n";
        readableLog += `Pivots (${agentResults.mentor.pivots?.length || 0}):\n`;
        agentResults.mentor.pivots?.forEach((pivot: string, i: number) => {
          readableLog += `  ${i + 1}. ${pivot}\n`;
        });
        readableLog += `\nNext 7 Days (${agentResults.mentor.next7days?.length || 0}):\n`;
        agentResults.mentor.next7days?.forEach((action: string, i: number) => {
          readableLog += `  ${i + 1}. ${action}\n`;
        });
        readableLog += `\nSuggestions (${agentResults.mentor.suggestions?.length || 0}):\n`;
        agentResults.mentor.suggestions?.forEach((suggestion: string, i: number) => {
          readableLog += `  ${i + 1}. ${suggestion}\n`;
        });
        readableLog += "\n";
      }

      // Synthesis Agent
      if (agentResults.synthesis) {
        readableLog += "SYNTHESIS AGENT:\n\n";
        readableLog += `Verdict: ${agentResults.synthesis.verdict}\n\n`;
        readableLog += "Fixes:\n";
        for (const [dimension, fixes] of Object.entries(agentResults.synthesis.fixes || {})) {
          readableLog += `  ${dimension}:\n`;
          (fixes as string[]).forEach((fix: string, i: number) => {
            readableLog += `    ${i + 1}. ${fix}\n`;
          });
        }
        readableLog += "\n";
      }
    }

    if (result) {
      readableLog += "=".repeat(60) + "\n";
      readableLog += "FINAL RESULT\n";
      readableLog += "=".repeat(60) + "\n\n";
      readableLog += `Verdict: ${result.verdict}\n\n`;
      readableLog += "Scores:\n";
      for (const [dimension, scoreData] of Object.entries(result.scores)) {
        readableLog += `  ${dimension}: ${(scoreData as any).score}/10\n`;
        readableLog += `    Why: ${(scoreData as any).why_sucks}\n`;
        readableLog += `    Fix: ${(scoreData as any).fix.join(", ")}\n\n`;
      }
      readableLog += `Pivots (${result.pivots.length}):\n`;
      result.pivots.forEach((pivot: string, i: number) => {
        readableLog += `  ${i + 1}. ${pivot}\n`;
      });
      readableLog += `\nNext 7 Days (${result.next7days.length}):\n`;
      result.next7days.forEach((action: string, i: number) => {
        readableLog += `  ${i + 1}. ${action}\n`;
      });
    }

    if (error) {
      readableLog += "\n" + "=".repeat(60) + "\n";
      readableLog += "ERROR\n";
      readableLog += "=".repeat(60) + "\n\n";
      readableLog += `${error instanceof Error ? error.message : String(error)}\n`;
      if (error instanceof Error && error.stack) {
        readableLog += `\nStack:\n${error.stack}\n`;
      }
    }

    fs.writeFileSync(readableLogFile, readableLog);
    console.log(`💾 Saved readable log to: ${readableLogFile}`);
  }
}

// Main execution
async function main() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

  if (!convexUrl) {
    console.error("❌ Error: NEXT_PUBLIC_CONVEX_URL or CONVEX_URL environment variable is required");
    console.error("   Set it in your .env.local file or export it:");
    console.error("   export NEXT_PUBLIC_CONVEX_URL='https://your-deployment.convex.cloud'");
    process.exit(1);
  }

  console.log(`🔗 Connecting to Convex: ${convexUrl}`);
  console.log("");

  const tester = new RoastTester(convexUrl);
  await tester.runTest();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

