import { Agent } from "@openai/agents";
import Anthropic from "@anthropic-ai/sdk";
import type { IdeaData } from "./types";
import { searchCompetitors, searchMarketData } from "../tools/competitorLookup";
import { getPricingBenchmark } from "../tools/pricingBenchmark";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Tool implementations for OpenAI Agents SDK
const agentTools = {
  search_competitors: async (args: { productDescription: string; category: string }) => {
    const competitors = await searchCompetitors(args.productDescription);
    return {
      competitors: competitors.length > 0 
        ? competitors.map((c) => c.name).join(", ")
        : "No competitors found. Market may be new or niche.",
      count: competitors.length,
      details: competitors,
    };
  },
  get_pricing_benchmark: async (args: { category: string; monetizationModel: string }) => {
    const benchmark = await getPricingBenchmark(args.category, args.monetizationModel);
    return {
      category: args.category,
      model: args.monetizationModel,
      common: benchmark.common,
      range: `$${benchmark.min}-${benchmark.max}/month`,
      average: `$${benchmark.average}/month`,
    };
  },
  search_market_data: async (args: { category: string }) => {
    const marketData = await searchMarketData(args.category);
    return {
      category: args.category,
      data: marketData || "Market data not available. Consider manual research.",
    };
  },
};

// Create OpenAI agent with tools using official SDK
export async function callLLMWithTools(
  prompt: string,
  model: "openai" | "anthropic" = "openai",
  options?: {
    temperature?: number;
    responseFormat?: "json" | "text";
    ideaData?: IdeaData;
    systemPrompt?: string;
  }
): Promise<string> {
  if (model === "openai") {
    const systemPrompt = options?.systemPrompt || 
      (options?.responseFormat === "json"
        ? "You are an expert startup analyst. Output ONLY valid JSON, no markdown, no explanations."
        : "You are an expert startup analyst. Use available tools when needed.");

    const agent = new Agent({
      model: process.env.OPENAI_MODEL || "gpt-4",
      systemPrompt,
      temperature: options?.temperature ?? 0.3,
      tools: agentTools,
    });

    try {
      const response = await agent.run(prompt);
      
      // Extract final message content
      if (response.messages && response.messages.length > 0) {
        const lastMessage = response.messages[response.messages.length - 1];
        if (lastMessage.role === "assistant" && lastMessage.content) {
          return typeof lastMessage.content === "string" 
            ? lastMessage.content 
            : lastMessage.content.map(c => c.type === "text" ? c.text : "").join("");
        }
      }
      
      // Fallback: return response text if available
      return response.text || "";
    } catch (error) {
      console.error("Agent error:", error);
      throw new Error(`Agent failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  } else {
    // Anthropic: Use native SDK with tool use (Claude Agent SDK requires different setup)
    const anthropicTools = [
      {
        name: "search_competitors",
        description: "Search for competitors and similar products in the market",
        input_schema: {
          type: "object",
          properties: {
            productDescription: { type: "string" },
            category: { type: "string" },
          },
          required: ["productDescription", "category"],
        },
      },
      {
        name: "get_pricing_benchmark",
        description: "Get pricing benchmarks for a product category",
        input_schema: {
          type: "object",
          properties: {
            category: { type: "string" },
            monetizationModel: { type: "string" },
          },
          required: ["category", "monetizationModel"],
        },
      },
      {
        name: "search_market_data",
        description: "Search for market size and TAM data",
        input_schema: {
          type: "object",
          properties: {
            category: { type: "string" },
          },
          required: ["category"],
        },
      },
    ];

    const messages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    let maxIterations = 5;
    while (maxIterations > 0) {
      const response = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        temperature: options?.temperature ?? 0.3,
        messages,
        tools: anthropicTools,
      });

      const content = response.content[0];
      if (content.type === "text") {
        return content.text;
      }

      // Handle tool use
      if (content.type === "tool_use") {
        let toolResult: any;
        switch (content.name) {
          case "search_competitors":
            toolResult = await agentTools.search_competitors(content.input as any);
            break;
          case "get_pricing_benchmark":
            toolResult = await agentTools.get_pricing_benchmark(content.input as any);
            break;
          case "search_market_data":
            toolResult = await agentTools.search_market_data(content.input as any);
            break;
          default:
            throw new Error(`Unknown tool: ${content.name}`);
        }

        messages.push({
          role: "assistant",
          content: response.content,
        });
        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: content.id,
              content: JSON.stringify(toolResult),
            },
          ],
        });
        maxIterations--;
        continue;
      }

      throw new Error("Unexpected response type from Anthropic");
    }

    throw new Error("Max tool call iterations reached");
  }
}

// Fallback: Simple LLM call without tools (for backward compatibility)
export async function callLLM(
  prompt: string,
  model: "openai" | "anthropic" = "openai",
  options?: {
    temperature?: number;
    responseFormat?: "json" | "text";
  }
): Promise<string> {
  if (model === "openai") {
    const agent = new Agent({
      model: process.env.OPENAI_MODEL || "gpt-4",
      systemPrompt: options?.responseFormat === "json"
        ? "You are an expert startup analyst. Output ONLY valid JSON, no markdown, no explanations."
        : "You are an expert startup analyst.",
      temperature: options?.temperature ?? 0.3,
    });

    const response = await agent.run(prompt);
    return response.text || "";
  } else {
    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: options?.temperature ?? 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic");
    }
    return content.text;
  }
}

export function parseJSON<T>(text: string): T {
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }
  return JSON.parse(jsonMatch[0]) as T;
}
