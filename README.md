# WhyYourIdeaSucks.ai

**Brutal, fast startup idea crash test: Get viability scores, fatal flaws, and concrete pivots in 60 seconds.** YC-style grilling meets hacker sarcasm—perfect for hackathons, founders, investors, and idea-killers.

*Terminal hacker aesthetic meets AI-powered idea evaluation.*

## Inspiration

Most startup ideas die in silence—founders get polite feedback that doesn't reveal fatal flaws until it's too late. We wanted to build something that gives YC-style brutal honesty at scale, combining the grilling intensity of investor due diligence with the speed of AI. The terminal hacker aesthetic emerged naturally: if we're going to "roast" ideas, why not make it feel like a command-line tool that ruthlessly evaluates your startup pitch? Perfect for hackathons where founders need fast, actionable feedback, and for investors who want to quickly screen deals.

## What it does

WhyYourIdeaSucks.ai is an AI-powered startup idea crash test that delivers brutal, structured feedback in 60 seconds. Users submit their idea (via quick form or detailed multi-step questionnaire), and the system orchestrates 8 specialized AI agents to evaluate 6 core dimensions: Market, Distribution, Monetization, Defensibility, Founder Fit, and Hackathon Feasibility. Each agent uses native tool calling to fetch real competitor data, pricing benchmarks, and market insights. The output is a comprehensive roast report with scores, "why it sucks" critiques, actionable fixes, suggested pivots, risk warnings, and concrete validation steps—all tuned to your chosen brutality level (Gentle/Honest/Savage).

## How we built it

**Architecture**: Built on Next.js 16 (App Router) with Convex as the backend for real-time data and serverless functions. The frontend uses TypeScript, Tailwind CSS, and shadcn/ui components styled with a terminal hacker theme (Geist Mono font, green-on-black palette).

**AI System**: The core innovation is a multi-agent orchestration system. We built 6 specialized "roaster" agents (Market Cynic, Distribution Hater, Monetization Skeptic, Defensibility Cop, Founder Fit Analyst, Hackathon Reality Check), plus a Mentor agent and a Fix Generator synthesis agent. Each agent uses native LLM tool calling—OpenAI Agents SDK for GPT models and Anthropic SDK for Claude—to fetch real-world data via web search, competitor lookup, and pricing benchmark tools.

**Key Technical Decisions**:
- **Client-side API key management**: API keys stored in localStorage, allowing users to bring their own keys without server-side storage
- **Per-agent model configuration**: Each agent can independently use OpenAI or Anthropic with different models (default: Haiku for roasters, Sonnet for synthesis)
- **Parallel agent execution**: All roaster agents run concurrently for speed
- **Terminal UI theme**: Custom CSS with monospace typography and terminal-style borders to match the "brutal honesty" brand

## Challenges we ran into

1. **Multi-agent orchestration**: Coordinating 8 agents with different prompts, tool requirements, and output formats while maintaining consistent structure. We solved this with a shared base agent class and type-safe output schemas.

2. **Native tool calling**: Implementing tool calling with both OpenAI and Anthropic SDKs required different approaches—OpenAI uses Agents SDK with built-in tool execution, while Anthropic requires manual tool result handling. We abstracted this into a unified interface.

3. **Balancing brutality with actionability**: Making feedback brutally honest without being demotivating. The brutality meter (Gentle/Honest/Savage) tunes tone while preserving substance, and the Mentor agent provides constructive pivots alongside critiques.

4. **Client-side API key security**: Storing API keys in localStorage is convenient but requires careful UX to prevent accidental exposure. We built a settings page with clear warnings and validation.

5. **Performance optimization**: Running 8 agents sequentially would take too long. We parallelized roaster agents and optimized prompt lengths to keep total evaluation time under 60 seconds.

## Accomplishments that we're proud of

- **Working multi-agent system**: Successfully orchestrated 8 specialized AI agents with native tool calling, producing coherent, structured evaluations
- **Real-world data integration**: Agents fetch actual competitor data, pricing benchmarks, and market insights to ground critiques in reality
- **Unique brand identity**: Terminal hacker aesthetic perfectly matches the "brutal honesty" positioning—users immediately understand what they're getting
- **Fast evaluation**: Complete roast reports in ~60 seconds, making it practical for hackathon demos and quick idea validation
- **Flexible configuration**: Per-agent model/provider selection allows users to optimize for cost, speed, or quality
- **"Roast my Pivot" feature**: Instant re-evaluation of improved ideas creates a feedback loop that helps founders iterate quickly

## What we learned

- **Multi-agent design patterns**: How to structure specialized agents with shared base logic, type-safe outputs, and parallel execution
- **Native tool calling**: Deep dive into OpenAI Agents SDK and Anthropic SDK differences—OpenAI's agentic approach vs Anthropic's explicit tool handling
- **Prompt engineering at scale**: Managing 8 different agent prompts while maintaining consistency and avoiding prompt injection
- **Client-side API key patterns**: Building secure, user-friendly API key management without server-side storage
- **Terminal UI design**: Creating a cohesive terminal aesthetic with CSS (monospace fonts, green-on-black, terminal borders) that feels authentic without being gimmicky
- **Convex serverless architecture**: Leveraging Convex actions for long-running AI operations and real-time data updates

## What's next for WhyYourIdeaSucks

- **Search similar failed ideas**: Database of past roasts to help users find similar ideas that failed or lost in previous hackathons
- **Enhanced tool use**: Expand web search capabilities, add more pricing benchmarks, and integrate market research APIs
- **Synthesis agent refinement**: Self-review and refinement loop to improve output quality without adding more agents
- **Investor dashboard**: Batch evaluation mode for VCs to quickly screen multiple deals with structured risk analysis
- **Community features**: Public idea directory with voting, comments, and "most roasted" leaderboards
- **Export enhancements**: PDF export with customizable branding, shareable roast links with analytics
- **API access**: Public API for developers to integrate roast evaluations into their own tools

## 🚀 Features

- **Instant Roast Report**: 6 core scores (Market, Distribution, Monetization, Defensibility, Founder Fit, Hackathon Feasibility) + "why it sucks" + actionable fixes 
- **Adaptive Brutality**: Gentle/Honest/Savage modes to tune feedback tone
- **Quick Roast Form**: Fast idea submission directly from landing page
- **Idea Directory**: Browse public roasts, filterable by category/score with search
- **Improvements & Pivots**: Sharper versions of your idea with actionable improvements
- **Precautions**: Risk warnings and considerations to watch out for
- **Implementation Steps**: Concrete validation experiments and action items to validate your riskiest assumptions
- **Roast my Pivot**: Re-evaluate improved versions of your idea instantly
- **Investor Due Diligence**: Fast-track deal screening with structured risk analysis—identify red flags and viability gaps in minutes
- **Share & Export**: Share roast reports or export to PDF
- **Terminal Hacker Theme**: Monospace typography, green-on-black aesthetic, terminal-style UI elements 

### Agentic "Roast Engine"

The system uses specialized AI agents with native tool/function calling capabilities, orchestrated to provide comprehensive evaluations:

**Roaster Agents** (6 specialized critics):
- **Market Cynic**: Evaluates market size, TAM, competitor landscape, and market saturation. Uses web search tools for real competitor data.
- **Distribution Hater**: Attacks vague growth strategies, demands specific channels, CAC realism, and concrete first-100-users plans.
- **Monetization Skeptic**: Flags unclear monetization models, suggests tighter models with concrete price points. Uses pricing benchmark tools.
- **Defensibility Cop**: Looks for moats (data, network effects, workflows, switching costs) and suggests where defensibility could be built.
- **Founder Fit Analyst**: Assesses founder-idea alignment, skills match, and unfair advantages.
- **Hackathon Reality Check**: Evaluates build effort vs hackathon timeframe, suggests demo-able slices or alternative angles.

**Mentor Agent**: Provides constructive suggestions, pivots, and action plans with data-backed recommendations.

**Fix Generator (Synthesis Agent)**: Consolidates all agent outputs into a coherent final verdict, prioritized fixes, improvements, precautions, and implementation steps.

Each agent uses native LLM tool calling (OpenAI Agents SDK for GPT, Anthropic SDK for Claude) to fetch real-world data when needed, making evaluations more grounded and actionable.


## User Flow

1. **Landing Page**:
   - Terminal-styled hero: "Most ideas die in silence. Let yours die quickly."
   - Quick Roast Form: Submit idea pitch, category, stage, and brutality level directly from homepage
   - Feature cards highlighting key capabilities including Investor Due Diligence
   - Navigation bar with links to Directory and Settings

2. **Detailed Form** (if not using Quick Roast):
   - Multi-step form (4 stages) collecting:
     - Idea pitch, category, stage, target user
     - Market size (TAM), problem urgency, alternatives
     - Distribution channels and strategy
     - Monetization model and pricing
     - Founder/team fit and unfair advantages
   - Brutality meter selection (Gentle/Honest/Savage)
   - Progress indicator showing current stage

3. **Roast Report**:
   - Verdict: One-sentence summary with terminal styling
   - Scores Table: 6 dimensions with scores, critiques, and fixes
   - Improvements: Suggested pivots and improvements
   - Precautions: Risk warnings and considerations
   - Implementation Steps: Concrete validation experiments and action items
   - "Roast my Pivot" functionality: Re-evaluate improved versions of your idea
   - Share/Export options: Copy link or export functionality


## 🎯 Live Demo

[whyyourideasuck.ai](https://whyyourideasuck.ai) – Try "AI poker coach for casual players"

## 📋 Example Output (What Users See)

A typical output would have:

- A “brutality meter” (gentle / honest / savage) the user can choose beforehand, which mainly tunes tone, not substance.
- A structured page with:
  - One-sentence "Verdict" (e.g., "Nice side project, weak as a venture-scale startup until X and Y are solved.").  
  - A table of scores and key issues across 6 dimensions.  
  - Improvements: Suggested pivots and sharper versions of the same idea.  
  - Precautions: Risk warnings and considerations to watch out for.
  - Implementation Steps: Concrete validation experiments and action items to validate your riskiest assumptions (2–3 user interviews, a landing page test, or a fake-door experiment).
### Example of the scoring table

| Dimension        | Score /10 | Why it "sucks" now                                     | How to make it suck less                           |
|-----------------|-----------|--------------------------------------------------------|----------------------------------------------------|
| Market          | 4         | Niche audience, unclear urgency of problem.    | Narrow to a sharper ICP with a must-fix pain. |
| Distribution    | 3         | No concrete channels, hand-wavy virality.       | Pick 1–2 channels and outline a first-100-users path. |
| Monetization    | 2         | No clear payer or price.                        | Define buyer persona, value, and a starting price. |
| Defensibility   | 3         | Easy to copy by incumbents.                    | Add data, workflow lock-in, or network effects. |
| Founder Fit     | 6         | Reasonable skills, no clear edge in target domain. | Lean into your proven skills & networks.       |
| Hackathon       | 5         | Scope too large for demo timeframe.            | Focus on one core feature that showcases value. |

**Verdict**: Side project potential. Solve distribution for VC scale.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A Convex account (free tier works)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whyyourideasucks.git
cd whyyourideasucks
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```
This will create a `.env.local` file with your Convex deployment URL.

4. Start the development server:
```bash
npm run dev
```

5. Configure API Keys:
   - Open the app in your browser
   - Click the Settings icon (⚙️) in the navigation bar
   - Navigate to the Settings page
   - Enter your OpenAI and/or Anthropic API keys
   - Configure provider/model for each agent
   - Settings are stored locally in your browser (localStorage)

### Configuration

The app uses **localStorage** to store your API keys and agent configurations. No server-side environment variables needed for LLM providers.

**Required API Keys:**
- **OpenAI API Key**: Required if any agent uses OpenAI (get from [platform.openai.com](https://platform.openai.com))
- **Anthropic API Key**: Required if any agent uses Anthropic (get from [console.anthropic.com](https://console.anthropic.com))

**Agent Configuration:**
Each of the 8 agents can be configured independently:
- **Provider**: Choose OpenAI or Anthropic
- **Model**: Select from available models

**Available Models:**
- **OpenAI**: `gpt-5.1`, `gpt-5`, `gpt-5-pro`, `gpt-5-nano`, `gpt-5-mini`
- **Anthropic**: `claude-sonnet-4-5-20250929`, `claude-haiku-4-5-20251001`, `claude-opus-4-5-20251101`

Default configuration uses Anthropic for all agents (Haiku for roaster agents, Sonnet for fix generator).

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Convex (queries, mutations, actions)
- **AI/LLM**: 
  - OpenAI GPT-5 models (configurable per agent) with native Agents SDK
  - Anthropic Claude 4.5 models (configurable per agent) with native SDK
  - Native tool/function calling for web search, competitor lookup, pricing benchmarks
  - Default: Anthropic Haiku for roaster agents, Sonnet for synthesis
- **Configuration**: localStorage-based settings (no server-side API key storage)
- **Styling**: Terminal hacker theme with monospace typography (Geist Mono), green-on-black palette

## 📁 Directory Structure

```
├── app/
│   ├── page.tsx                    # Landing page with Quick Roast Form
│   ├── layout.tsx                   # Root layout with terminal theme
│   ├── providers.tsx                # Convex provider setup
│   ├── globals.css                  # Terminal theme styles
│   ├── roast/
│   │   ├── page.tsx                 # Detailed idea submission form
│   │   └── [id]/page.tsx            # Roast report display
│   ├── directory/
│   │   └── page.tsx                 # Public idea gallery
│   ├── settings/
│   │   └── page.tsx                 # Settings page for API keys and agent config
│   └── components/
│       ├── Navigation.tsx           # Main navigation component
│       ├── IdeaForm.tsx             # Multi-step form component
│       ├── QuickRoastForm.tsx       # Quick submission form
│       ├── RoastTable.tsx           # Scores display table
│       ├── BrutalityMeter.tsx       # Brutality level selector
│       ├── PivotCard.tsx            # Suggested pivots display
│       ├── Next7DaysCard.tsx        # Action plan display
│       └── RoastPivotDialog.tsx     # Pivot re-roasting dialog
├── components/ui/                  # shadcn/ui components
├── lib/
│   ├── utils.ts                    # Utility functions
│   └── settings.ts                 # Settings management (localStorage)
├── convex/
│   ├── schema.ts                    # Database schema
│   ├── roast.ts                     # Main roast orchestration
│   ├── ideas.ts                     # Idea mutations/queries
│   ├── roasts.ts                    # Roast mutations/queries
│   ├── agents/
│   │   ├── base.ts                  # Shared LLM calling logic
│   │   ├── types.ts                 # TypeScript types
│   │   ├── prompts.ts               # Agent prompt templates
│   │   ├── marketCynic.ts           # Market analysis agent
│   │   ├── distributionHater.ts     # Distribution analysis agent
│   │   ├── monetizationSkeptic.ts   # Monetization analysis agent
│   │   ├── defensibilityCop.ts      # Defensibility analysis agent
│   │   ├── founderFit.ts            # Founder fit analysis agent
│   │   ├── hackathonRealityCheck.ts  # Hackathon feasibility agent
│   │   ├── mentor.ts                # Constructive mentor agent
│   │   └── fixGenerator.ts          # Synthesis agent
│   └── tools/
│       ├── webSearch.ts             # Web search tool (placeholder)
│       ├── competitorLookup.ts      # Competitor search tool
│       └── pricingBenchmark.ts      # Pricing data tool
```

## 🎨 Design Philosophy

The app uses a **terminal hacker aesthetic** to match the "brutal honesty" brand:
- Monospace typography (Geist Mono) for technical elements
- Green-on-black color scheme (`#00ff00` primary, `#00cc00` secondary, `#ffb000` accents)
- Terminal-style borders and glows
- Uppercase headers with underscores (e.g., `GET_YOUR_IDEA_ROASTED`)
- Command-line inspired UI elements (`> ` prompts, terminal borders)

## ⚠️ Disclaimer

Brutal honesty ≠ investment advice. Validate with real users. Built for hackathons—ships fast, iterates faster.

## ⭐ Star to Kill More Ideas

Made with ❤️ for founders who ship. Questions? [@maplerichie](https://x.com/maplerichie)
