## Input Question Set

The form collects structured data in 8–10 targeted questions, grouped into stages for quick completion (under 5 minutes). Questions adapt slightly based on prior answers (e.g., B2B prompts for buyer details). Use radio buttons, short text, and sliders where possible for hackathon speed.

### Stage 1: Idea Basics (3 questions)
- **Idea pitch**: Describe your idea in 1–2 sentences. Who is it for? What problem does it solve? (Text box, 100–200 words max)
- **Category**: Select: B2B/SaaS, B2C app, Marketplace, Dev tool, Consumer hardware, Other. (Dropdown)
- **Stage**: Pre-idea / Hackathon demo / MVP built / Traction / Raising. (Dropdown)

### Stage 2: Market & Users (3 questions)
- **Target user**: Define your ideal customer (age, job, pain level). How many potential users in your region? Rough TAM guess? (Text + number slider $1K–$1B)
- **Problem urgency**: On a 1–10 scale, how bad is this pain today? Name 2–3 current alternatives they use (even bad ones). (Slider + text)
- **Evidence**: Any user chats, surveys, or personal pain? Link to landing/GitHub if exists. (Optional text/link)

### Stage 3: Go-to-Market (2 questions)
- **Distribution**: How do first 100 users find you? Specific channels (e.g., Reddit, X ads, partnerships)? CAC guess? (Text + checkboxes: SEO, Paid, Viral, etc.)
- **Unfair edge**: What's your moat? (Team expertise, data, network, patents?) Why can't incumbents copy day 1? (Text)

### Stage 4: Money & Fit (2 questions)
- **Monetization**: How do you make money? Price per user/month? Who pays? (Dropdown: Freemium/Subs/Ads + text/numbers)
- **Team fit**: Your key skills/experience matching this idea? Any traction metrics? (Text + optional numbers)

## Prompt Schema

The backend chains 5 specialized prompts (one per "roast engine" agent), fed the full user input as JSON. Output is deterministic JSON for rendering the report/table. Use temperature=0.2 for consistency; total inference <30s.

### System Prompt (Shared)
```
You are a brutal-but-constructive YC partner + VC analyst crossed with a sarcastic hacker friend. Analyze startup ideas to expose fatal flaws early. Be direct, roast weak spots, but always end with 2–3 actionable fixes. Optimize for hackathon pitches: fast viability checks, demo-friendly scopes.

User data: {user_json}

Output ONLY valid JSON matching this schema:
{
  "verdict": "One-sentence overall judgment (e.g., 'Solid niche play if distribution clicks, else dead on arrival.')",
  "brutality": "gentle/honest/savage (match user-selected tone)",
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
```

### Agent-Specific Prompts (Chain: Market → Distribution → etc.)
1. **Market Cynic**: "Score market on size/reachability/urgency. Flag: tiny TAM, no wedge, saturated. Use TAM guess + alternatives."
2. **Distribution Hater**: "Demand specific first-100 plan. Roast vague 'viral'. Check hackathon demo paths."
3. **Monetization Skeptic**: "Validate payer/value/price realism. No 'freemium later'."
4. **Defensibility Cop**: "Hunt moats. Suggest add-ons like data lock-in."
5. **Founder/Hackathon Finalizer**: "Fit to team + hackathon constraints. Suggest tiny MVP slice."

Aggregate scores into final JSON (average or rule-based). Brutality tunes language: savage="Your TAM is a joke", honest="TAM too small".

## Example JSON Output

```json
{
  "verdict": "Cute app, but distribution nightmare kills it unless you pivot to niche.",
  "brutality": "savage",
  "scores": {
    "market": {"score": 5, "why_sucks": "Niche hobbyists won't pay for 'mildly annoying'.", "fix": ["Narrow to pro motorcyclists with safety data.", "Validate pain via 5 interviews."]},
    // ... other dimensions
  },
  "pivots": ["B2B fleet tracking for moto rental shops.", "AI safety coach integrated with wearables."],
  "next7days": ["Tweet poll to 100 riders: 'Would you pay $5/mo for X?'", "Build fake landing, drive 50 clicks via Reddit."]
}
