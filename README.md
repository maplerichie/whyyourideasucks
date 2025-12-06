# WhyYourIdeaSucks.ai

**Brutal, fast startup idea crash test: Get viability scores, fatal flaws, and concrete pivots in 60 seconds.** YC-style grilling meets hacker sarcasm—perfect for hackathons, founders, investors, and idea-killers.

*Terminal hacker aesthetic meets AI-powered idea evaluation.*

## 🚀 Features

- **Instant Roast Report**: 6 core scores (Market, Distribution, Monetization, Defensibility, Founder Fit, Hackathon Feasibility) + "why it sucks" + actionable fixes 
- **Adaptive Brutality**: Gentle/Honest/Savage modes to tune feedback tone
- **Quick Roast Form**: Fast idea submission directly from landing page
- **Idea Directory**: Browse public roasts, filterable by category/score with search
- **Pivot Generator**: 2-3 sharper versions of your idea with "Roast my Pivot" functionality
- **7-Day Action Plan**: Tiny experiments to validate your riskiest assumptions
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

**Synthesis Agent**: Consolidates all agent outputs into a coherent final verdict and prioritized fixes.

Each agent uses native LLM tool calling (OpenAI Agents SDK for GPT, Anthropic SDK for Claude) to fetch real-world data when needed, making evaluations more grounded and actionable.


## User Flow

1. **Landing Page**:
   - Terminal-styled hero: "Most ideas die in silence. Let yours die quickly."
   - Quick Roast Form: Submit idea pitch, category, stage, and brutality level directly from homepage
   - Feature cards highlighting key capabilities including Investor Due Diligence
   - Navigation to Directory

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
   - Suggested Pivots: 2-3 improved versions with "Roast my Pivot" button
   - Next 7 Days Action Plan: Concrete validation experiments
   - Share/Export options: Make public or export to PDF


## 🎯 Live Demo

[whyyourideasuck.ai](https://whyyourideasuck.ai) – Try "AI poker coach for casual players"

## 📋 Example Output (What Users See)

A typical output would have:

- A “brutality meter” (gentle / honest / savage) the user can choose beforehand, which mainly tunes tone, not substance.
- A structured page with:
  - One-sentence “Verdict” (e.g., “Nice side project, weak as a venture-scale startup until X and Y are solved.”).  
  - A table of scores and key issues.  
  - 2–3 suggested pivots or sharper versions of the same idea.  
  - A “first 7 days” action list: tiny experiments to validate the riskiest assumptions (2–3 user interviews, a landing page test, or a fake-door experiment).
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

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Convex (queries, mutations, actions)
- **AI/LLM**: 
  - OpenAI GPT-4 (roaster agents) with `@openai/agents` SDK
  - Anthropic Claude (mentor & synthesis agents) with native SDK
  - Native tool/function calling for web search, competitor lookup, pricing benchmarks
- **Auth**: Convex Auth
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
│   └── components/
│       ├── IdeaForm.tsx             # Multi-step form component
│       ├── QuickRoastForm.tsx       # Quick submission form
│       ├── RoastTable.tsx           # Scores display table
│       ├── BrutalityMeter.tsx       # Brutality level selector
│       ├── PivotCard.tsx            # Suggested pivots display
│       ├── Next7DaysCard.tsx        # Action plan display
│       └── RoastPivotDialog.tsx     # Pivot re-roasting dialog
├── components/ui/                  # shadcn/ui components
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
└── lib/
    └── utils.ts                     # Utility functions
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
