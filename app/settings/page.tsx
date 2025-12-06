"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSettings, saveSettings, validateSettings, type Settings } from "@/lib/settings";
import { Eye, EyeOff, Key, Bot, CheckCircle2, AlertCircle, ExternalLink, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const OPENAI_MODELS = [
  "gpt-5.1",
  "gpt-5",
  "gpt-5-pro",
  "gpt-5-nano",
  "gpt-5-mini",
];

const ANTHROPIC_MODELS = [
  "claude-sonnet-4-5-20250929",
  "claude-haiku-4-5-20251001",
  "claude-opus-4-5-20251101",
];

type ModelInfo = {
  name: string;
  inputPrice: string;
  outputPrice: string;
  description?: string;
};

const MODEL_INFO: Record<string, ModelInfo> = {
  "gpt-5.1": {
    name: "GPT-5.1",
    inputPrice: "$1.25 / MTok",
    outputPrice: "$10.00 / MTok",
    description: "Latest general-purpose model",
  },
  "gpt-5": {
    name: "GPT-5",
    inputPrice: "$1.25 / MTok",
    outputPrice: "$10.00 / MTok",
    description: "High-performance model",
  },
  "gpt-5-pro": {
    name: "GPT-5 Pro",
    inputPrice: "$15.00 / MTok",
    outputPrice: "$120.00 / MTok",
    description: "Premium model with maximum capabilities",
  },
  "gpt-5-nano": {
    name: "GPT-5 Nano",
    inputPrice: "$0.05 / MTok",
    outputPrice: "$0.40 / MTok",
    description: "Ultra-fast, cost-efficient model",
  },
  "gpt-5-mini": {
    name: "GPT-5 Mini",
    inputPrice: "$0.15 / MTok",
    outputPrice: "$0.60 / MTok",
    description: "Fast and affordable model",
  },
  "claude-sonnet-4-5-20250929": {
    name: "Claude Sonnet 4.5",
    inputPrice: "$3.00 / MTok",
    outputPrice: "$15.00 / MTok",
    description: "Best balance of intelligence, speed, and cost",
  },
  "claude-haiku-4-5-20251001": {
    name: "Claude Haiku 4.5",
    inputPrice: "$1.00 / MTok",
    outputPrice: "$5.00 / MTok",
    description: "Fastest model with near-frontier intelligence",
  },
  "claude-opus-4-5-20251101": {
    name: "Claude Opus 4.5",
    inputPrice: "$5.00 / MTok",
    outputPrice: "$25.00 / MTok",
    description: "Premium model with maximum intelligence",
  },
};

const AGENT_NAMES: Record<keyof Settings["agents"], string> = {
  marketCynic: "Market Cynic",
  distributionHater: "Distribution Hater",
  monetizationSkeptic: "Monetization Skeptic",
  defensibilityCop: "Defensibility Cop",
  founderFit: "Founder Fit",
  hackathonRealityCheck: "Hackathon Reality Check",
  mentor: "Mentor",
  fixGenerator: "Fix Generator",
};

const AGENT_DESCRIPTIONS: Record<keyof Settings["agents"], string> = {
  marketCynic: "Evaluates market size, TAM, and competition",
  distributionHater: "Analyzes growth strategies and distribution channels",
  monetizationSkeptic: "Reviews monetization models and pricing",
  defensibilityCop: "Assesses competitive moats and defensibility",
  founderFit: "Evaluates founder-idea alignment and skills",
  hackathonRealityCheck: "Checks hackathon feasibility and timelines",
  mentor: "Provides constructive guidance and synthesis",
  fixGenerator: "Generates actionable fixes and pivots",
};

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setErrors([]);
    setSaved(false);
  }, []);

  const getAvailableModels = (provider: "openai" | "anthropic") => {
    return provider === "openai" ? OPENAI_MODELS : ANTHROPIC_MODELS;
  };

  const handleSave = () => {
    const validation = validateSettings(settings);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    saveSettings(settings);
    setErrors([]);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/");
    }, 1500);
  };

  const updateAgentConfig = (
    agentKey: keyof Settings["agents"],
    field: "provider" | "model",
    value: string
  ) => {
    setSettings((prev) => {
      const currentAgent = prev.agents[agentKey];
      if (field === "provider") {
        const newProvider = value as "openai" | "anthropic";
        const availableModels = getAvailableModels(newProvider);
        return {
          ...prev,
          agents: {
            ...prev.agents,
            [agentKey]: {
              provider: newProvider,
              model: availableModels[0],
            },
          },
        };
      }
      return {
        ...prev,
        agents: {
          ...prev.agents,
          [agentKey]: {
            ...currentAgent,
            [field]: value,
          },
        },
      };
    });
  };

  const getModelInfo = (model: string) => MODEL_INFO[model];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Configure API keys and agent models. All settings are stored locally.
              </p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="api-keys" className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-5">
            {/* OpenAI API Key Card */}
            <Card className="hover-lift shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold mb-1">OpenAI API Key</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        Required for agents using OpenAI models
                      </CardDescription>
                    </div>
                  </div>
                  <a
                    href="https://platform.openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors duration-200 shrink-0"
                  >
                    Get key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type={showOpenAIKey ? "text" : "password"}
                    value={settings.openaiApiKey || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        openaiApiKey: e.target.value,
                      }))
                    }
                    placeholder="sk-..."
                    className="flex-1 font-mono text-sm bg-background"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                    title={showOpenAIKey ? "Hide key" : "Show key"}
                    className="shrink-0"
                  >
                    {showOpenAIKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Anthropic API Key Card */}
            <Card className="hover-lift shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold mb-1">Anthropic API Key</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        Required for agents using Anthropic models
                      </CardDescription>
                    </div>
                  </div>
                  <a
                    href="https://console.anthropic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors duration-200 shrink-0"
                  >
                    Get key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    id="anthropic-key"
                    type={showAnthropicKey ? "text" : "password"}
                    value={settings.anthropicApiKey || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        anthropicApiKey: e.target.value,
                      }))
                    }
                    placeholder="sk-ant-..."
                    className="flex-1 font-mono text-sm bg-background"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                    title={showAnthropicKey ? "Hide key" : "Show key"}
                    className="shrink-0"
                  >
                    {showAnthropicKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {(Object.keys(settings.agents) as Array<keyof Settings["agents"]>).map(
                (agentKey) => {
                  const agentConfig = settings.agents[agentKey];
                  const availableModels = getAvailableModels(agentConfig.provider);
                  const modelInfo = getModelInfo(agentConfig.model);

                  return (
                    <Card key={agentKey} className="hover-lift">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base mb-1.5 font-semibold">
                              {AGENT_NAMES[agentKey]}
                            </CardTitle>
                            <CardDescription className="text-xs leading-relaxed">
                              {AGENT_DESCRIPTIONS[agentKey]}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor={`${agentKey}-provider`} className="text-xs font-medium text-foreground">
                              Provider
                            </Label>
                            <Select
                              value={agentConfig.provider}
                              onValueChange={(value: "openai" | "anthropic") =>
                                updateAgentConfig(agentKey, "provider", value)
                              }
                            >
                              <SelectTrigger
                                id={`${agentKey}-provider`}
                                className="h-9 w-full bg-background"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border shadow-lg">
                                <SelectItem value="openai" className="cursor-pointer">
                                  <span className="font-medium">OpenAI</span>
                                </SelectItem>
                                <SelectItem value="anthropic" className="cursor-pointer">
                                  <span className="font-medium">Anthropic</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label htmlFor={`${agentKey}-model`} className="text-xs font-medium text-foreground">
                              Model
                            </Label>
                            <Select
                              value={agentConfig.model}
                              onValueChange={(value) =>
                                updateAgentConfig(agentKey, "model", value)
                              }
                            >
                              <SelectTrigger
                                id={`${agentKey}-model`}
                                className="h-9 w-full bg-background"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border shadow-lg min-w-[200px]">
                                {availableModels.map((model) => {
                                  const info = MODEL_INFO[model];
                                  return (
                                    <SelectItem
                                      key={model}
                                      value={model}
                                      className="cursor-pointer py-2.5"
                                    >
                                      <div className="flex flex-col gap-0.5 w-full">
                                        <span className="font-medium text-sm">{info?.name || model}</span>
                                        {info?.description && (
                                          <span className="text-xs text-muted-foreground leading-tight">
                                            {info.description}
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {modelInfo && (
                          <div className="pt-3 border-t border-border">
                            <div className="flex justify-between items-center text-xs py-1">
                              <span className="text-muted-foreground font-medium">Input:</span>
                              <span className="font-semibold text-foreground">{modelInfo.inputPrice}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1">
                              <span className="text-muted-foreground font-medium">Output:</span>
                              <span className="font-semibold text-foreground">{modelInfo.outputPrice}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Messages */}
        {errors.length > 0 && (
          <Card className="mt-6 border-error-border bg-error-bg animate-fade-in-up shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-error mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-error mb-2">Please fix the following:</p>
                  <ul className="text-sm text-error space-y-1">
                    {errors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {saved && (
          <Card className="mt-6 border-success-border bg-success-bg animate-fade-in-up shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 success-text" />
                <span className="success-text font-medium">Settings saved successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t animate-fade-in-up">
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saved} className="min-w-[120px]">
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
