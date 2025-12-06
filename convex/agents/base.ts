import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import type { IdeaData } from "./types";
import { searchCompetitors, searchMarketData } from "../tools/competitorLookup";
import { getPricingBenchmark } from "../tools/pricingBenchmark";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Convert tools to OpenAI format
    const openaiTools = [
      {
        type: "function" as const,
        function: {
          name: "search_competitors",
          description: "Search for competitors and similar products in the market",
          parameters: {
            type: "object",
            properties: {
              productDescription: { type: "string" },
              category: { type: "string" },
            },
            required: ["productDescription", "category"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "get_pricing_benchmark",
          description: "Get pricing benchmarks for a product category",
          parameters: {
            type: "object",
            properties: {
              category: { type: "string" },
              monetizationModel: { type: "string" },
            },
            required: ["category", "monetizationModel"],
          },
        },
      },
      {
        type: "function" as const,
        function: {
          name: "search_market_data",
          description: "Search for market size and TAM data",
          parameters: {
            type: "object",
            properties: {
              category: { type: "string" },
            },
            required: ["category"],
          },
        },
      },
    ];

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ];

    let maxIterations = 5;
    while (maxIterations > 0) {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
      temperature: options?.temperature ?? 0.3,
        tools: openaiTools,
        tool_choice: "auto",
      });

      const message = response.choices[0]?.message;
      if (!message) {
        throw new Error("No message in response");
      }

      // Add assistant message to conversation
      messages.push(message);

      // If no tool calls, return the text content
      if (!message.tool_calls || message.tool_calls.length === 0) {
        return message.content || "";
      }

      // Handle tool calls
      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== "function") {
          continue;
        }
        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        let toolResult: any;
        switch (toolName) {
          case "search_competitors":
            toolResult = await agentTools.search_competitors(args);
            break;
          case "get_pricing_benchmark":
            toolResult = await agentTools.get_pricing_benchmark(args);
            break;
          case "search_market_data":
            toolResult = await agentTools.search_market_data(args);
            break;
          default:
            throw new Error(`Unknown tool: ${toolName}`);
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      maxIterations--;
    }

    throw new Error("Max tool call iterations reached");
  } else {
    // Anthropic: Use native SDK with tool use (Claude Agent SDK requires different setup)
    const anthropicTools = [
      {
        name: "search_competitors",
        description: "Search for competitors and similar products in the market",
        input_schema: {
          type: "object" as const,
          properties: {
            productDescription: { type: "string" as const },
            category: { type: "string" as const },
          },
          required: ["productDescription", "category"],
        },
      },
      {
        name: "get_pricing_benchmark",
        description: "Get pricing benchmarks for a product category",
        input_schema: {
          type: "object" as const,
          properties: {
            category: { type: "string" as const },
            monetizationModel: { type: "string" as const },
          },
          required: ["category", "monetizationModel"],
        },
      },
      {
        name: "search_market_data",
        description: "Search for market size and TAM data",
        input_schema: {
          type: "object" as const,
          properties: {
            category: { type: "string" as const },
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
        model: process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307",
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
    const systemPrompt = options?.responseFormat === "json"
      ? "You are an expert startup analyst. Output ONLY valid JSON, no markdown, no explanations."
      : "You are an expert startup analyst.";

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: options?.temperature ?? 0.3,
    });

    return response.choices[0]?.message?.content || "";
  } else {
    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307",
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
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response received");
  }

  // Try to parse directly first
  try {
    return JSON.parse(text.trim()) as T;
  } catch {
    // If direct parse fails, try to extract JSON
  }

  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  // Try to find JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
  return JSON.parse(jsonMatch[0]) as T;
    } catch (e) {
      // If parsing fails, log the problematic text
      console.error("Failed to parse JSON:", jsonMatch[0].substring(0, 200));
      throw new Error(`Invalid JSON format: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  // Try to find JSON array (in case response is an array)
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]) as T;
    } catch (e) {
      console.error("Failed to parse JSON array:", arrayMatch[0].substring(0, 200));
      throw new Error(`Invalid JSON format: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  // Log the actual response for debugging
  console.error("No JSON found in response. Response preview:", text.substring(0, 500));
  throw new Error(`No JSON found in response. Response preview: ${text.substring(0, 200)}...`);
}
