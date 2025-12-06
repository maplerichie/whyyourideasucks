export type AgentConfig = {
  provider: "openai" | "anthropic";
  model: string;
};

export type Settings = {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  agents: {
    marketCynic: AgentConfig;
    distributionHater: AgentConfig;
    monetizationSkeptic: AgentConfig;
    defensibilityCop: AgentConfig;
    founderFit: AgentConfig;
    hackathonRealityCheck: AgentConfig;
    mentor: AgentConfig;
    fixGenerator: AgentConfig;
  };
};

const SETTINGS_KEY = "wyis_settings";

const DEFAULT_SETTINGS: Settings = {
  agents: {
    marketCynic: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
    distributionHater: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
    monetizationSkeptic: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
    defensibilityCop: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
    founderFit: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
    hackathonRealityCheck: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
    mentor: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
    fixGenerator: { provider: "anthropic", model: "claude-sonnet-4-5-20250929" },
  },
};

export function getSettings(): Settings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(stored) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      agents: {
        ...DEFAULT_SETTINGS.agents,
        ...(parsed.agents || {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

export function validateSettings(settings: Settings): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if required API keys are set for each agent
  const agentKeys = Object.keys(settings.agents) as Array<keyof Settings["agents"]>;
  const requiredProviders = new Set<string>();

  agentKeys.forEach((agentKey) => {
    const config = settings.agents[agentKey];
    requiredProviders.add(config.provider);
  });

  if (requiredProviders.has("openai") && !settings.openaiApiKey) {
    errors.push("OpenAI API key is required for selected agents");
  }

  if (requiredProviders.has("anthropic") && !settings.anthropicApiKey) {
    errors.push("Anthropic API key is required for selected agents");
  }

  // Basic API key format validation
  if (settings.openaiApiKey && !settings.openaiApiKey.startsWith("sk-")) {
    errors.push("OpenAI API key format appears invalid (should start with 'sk-')");
  }

  if (
    settings.anthropicApiKey &&
    !settings.anthropicApiKey.startsWith("sk-ant-")
  ) {
    errors.push(
      "Anthropic API key format appears invalid (should start with 'sk-ant-')"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

