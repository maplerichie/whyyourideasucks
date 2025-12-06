import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import type { IdeaData } from "./types";
import { searchCompetitors, searchMarketData } from "../tools/competitorLookup";
import { getPricingBenchmark } from "../tools/pricingBenchmark";

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
  provider: "openai" | "anthropic",
  apiKey: string,
  modelName: string,
  options?: {
    temperature?: number;
    responseFormat?: "json" | "text";
    ideaData?: IdeaData;
    systemPrompt?: string;
  }
): Promise<string> {
  if (provider === "openai") {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    const openai = new OpenAI({ apiKey });
    const systemPrompt = options?.systemPrompt || 
      (options?.responseFormat === "json"
        ? "You are an expert startup analyst. CRITICAL: You MUST output ONLY valid JSON. Never output any explanatory text, reasoning, or markdown. Start your response with { and end with }. No text before or after the JSON object."
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
        model: modelName,
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
    if (!apiKey) {
      throw new Error("Anthropic API key is required");
    }
    const anthropic = new Anthropic({ apiKey });
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
      // Build request options - messages array changes each iteration
      const requestOptions: any = {
        model: modelName,
        max_tokens: 4000,
        temperature: options?.temperature ?? 0.3,
        messages,
        tools: anthropicTools,
      };
      
      // Add system message if provided (Anthropic supports this)
      if (options?.systemPrompt) {
        requestOptions.system = options.systemPrompt;
      }
      
      const response = await anthropic.messages.create(requestOptions);

      // Check if response contains text (final answer)
      const textContent = response.content.find((c) => c.type === "text");
      if (textContent && textContent.type === "text") {
        return textContent.text;
      }

      // Handle tool use - Anthropic can return multiple tool_use blocks
      const toolUseBlocks = response.content.filter((c) => c.type === "tool_use");
      if (toolUseBlocks.length > 0) {
        // Add assistant message with all tool_use blocks
        messages.push({
          role: "assistant",
          content: response.content,
        });

        // Execute all tool calls in parallel and collect results
        const toolResults = await Promise.all(
          toolUseBlocks.map(async (toolUse) => {
            if (toolUse.type !== "tool_use") return null;
            
            let toolResult: any;
            switch (toolUse.name) {
              case "search_competitors":
                toolResult = await agentTools.search_competitors(toolUse.input as any);
                break;
              case "get_pricing_benchmark":
                toolResult = await agentTools.get_pricing_benchmark(toolUse.input as any);
                break;
              case "search_market_data":
                toolResult = await agentTools.search_market_data(toolUse.input as any);
                break;
              default:
                throw new Error(`Unknown tool: ${toolUse.name}`);
            }

            return {
              type: "tool_result" as const,
              tool_use_id: toolUse.id,
              content: JSON.stringify(toolResult),
            };
          })
        );

        // Filter out nulls and add all tool_results in a single user message
        const validToolResults = toolResults.filter((r) => r !== null) as Array<{
          type: "tool_result";
          tool_use_id: string;
          content: string;
        }>;

        messages.push({
          role: "user",
          content: validToolResults,
        });

        maxIterations--;
        continue;
      }

      throw new Error("Unexpected response type from Anthropic: no text or tool_use found");
    }

    throw new Error("Max tool call iterations reached");
  }
}

// Fallback: Simple LLM call without tools (for backward compatibility)
export async function callLLM(
  prompt: string,
  provider: "openai" | "anthropic",
  apiKey: string,
  modelName: string,
  options?: {
    temperature?: number;
    responseFormat?: "json" | "text";
  }
): Promise<string> {
  if (provider === "openai") {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    const openai = new OpenAI({ apiKey });
    const systemPrompt = options?.responseFormat === "json"
      ? "You are an expert startup analyst. Output ONLY valid JSON, no markdown, no explanations."
      : "You are an expert startup analyst.";

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: options?.temperature ?? 0.3,
    });

    return response.choices[0]?.message?.content || "";
  } else {
    if (!apiKey) {
      throw new Error("Anthropic API key is required");
    }
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: modelName,
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

// Helper function to fix common JSON syntax errors
function fixJSONSyntax(jsonStr: string): string {
  let fixed = jsonStr;
  
  // Remove trailing commas before } or ]
  // Match: comma followed by whitespace and closing brace/bracket
  // This handles: { "key": "value", } and ["item1", "item2", ]
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  
  return fixed;
}

export function parseJSON<T>(text: string): T {
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response received");
  }

  // Try to parse directly first
  try {
    return JSON.parse(text.trim()) as T;
  } catch (e) {
    // If direct parse fails, try to extract and fix JSON
  }

  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  let cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  // Remove any explanatory text before the first {
  // Look for the first { that starts a JSON object
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace > 0) {
    // If there's text before the first brace, remove it
    cleaned = cleaned.substring(firstBrace);
  }

  // Try to find JSON object (match from first { to matching })
  let braceCount = 0;
  let jsonEnd = -1;
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] === '{') braceCount++;
    if (cleaned[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
  }

  if (jsonEnd > 0) {
    const jsonStr = cleaned.substring(0, jsonEnd);
    
    // Try parsing the extracted JSON
    try {
      return JSON.parse(jsonStr) as T;
    } catch (e) {
      // If parsing fails, try fixing common JSON errors
      try {
        const fixed = fixJSONSyntax(jsonStr);
        return JSON.parse(fixed) as T;
      } catch (fixError) {
        // Log more context for debugging
        const errorPos = jsonStr.length > 7725 ? 7725 : Math.min(jsonStr.length - 100, 0);
        const contextStart = Math.max(0, errorPos - 200);
        const contextEnd = Math.min(jsonStr.length, errorPos + 200);
        const context = jsonStr.substring(contextStart, contextEnd);
        const lineNumber = jsonStr.substring(0, errorPos).split('\n').length;
        
        console.error("Failed to parse JSON after fixing:");
        console.error(`Error at position ${errorPos}, line ${lineNumber}`);
        console.error("Context around error:", context);
        console.error("Full JSON length:", jsonStr.length);
        console.error("First 500 chars:", jsonStr.substring(0, 500));
        console.error("Last 500 chars:", jsonStr.substring(Math.max(0, jsonStr.length - 500)));
        
        throw new Error(`Invalid JSON format: ${e instanceof Error ? e.message : "Unknown error"}. Context: ${context.substring(0, 100)}...`);
      }
    }
  }

  // Fallback: Try simple regex match
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as T;
    } catch (e) {
      try {
        const fixed = fixJSONSyntax(jsonMatch[0]);
        return JSON.parse(fixed) as T;
      } catch (fixError) {
        console.error("Failed to parse JSON:", jsonMatch[0].substring(0, 500));
        throw new Error(`Invalid JSON format: ${e instanceof Error ? e.message : "Unknown error"}`);
      }
    }
  }

  // Try to find JSON array (in case response is an array)
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]) as T;
    } catch (e) {
      try {
        const fixed = fixJSONSyntax(arrayMatch[0]);
        return JSON.parse(fixed) as T;
      } catch (fixError) {
        console.error("Failed to parse JSON array:", arrayMatch[0].substring(0, 500));
        throw new Error(`Invalid JSON format: ${e instanceof Error ? e.message : "Unknown error"}`);
      }
    }
  }

  // Log the actual response for debugging
  console.error("No JSON found in response. Response preview:", text.substring(0, 500));
  throw new Error(`No JSON found in response. Response preview: ${text.substring(0, 200)}...`);
}
