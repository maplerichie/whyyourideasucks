"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrutalityMeter } from "./BrutalityMeter";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

type FormData = {
  // Stage 1
  pitch: string;
  category: "B2B/SaaS" | "B2C app" | "Marketplace" | "Dev tool" | "Consumer hardware" | "Other";
  stage: "Pre-idea" | "Hackathon demo" | "MVP built" | "Traction" | "Raising";
  brutality: "gentle" | "honest" | "savage";

  // Stage 2
  targetUser: string;
  tam: number;
  problemUrgency: number;
  alternatives: string;
  evidence?: string;

  // Stage 3
  distribution: string;
  distributionChannels: string[];
  cacGuess?: number;
  unfairEdge: string;

  // Stage 4
  monetization: string;
  monetizationModel: "Freemium" | "Subscription" | "Ads" | "One-time" | "Other";
  price?: number;
  teamFit: string;
  tractionMetrics?: string;
};

const DISTRIBUTION_CHANNELS = ["SEO", "Paid Ads", "Viral/Social", "Partnerships", "Content", "Direct Sales", "Other"];

export function IdeaForm() {
  const router = useRouter();

  const submitIdea = useMutation(api.ideas.submitIdea);
  const generateRoast = useAction(api.roast.generateRoast);
  const saveRoast = useMutation(api.roasts.saveRoast);

  // Default values from test script
  const defaultFormData: FormData = {
    pitch: "whyyourideasucks.ai - A platform that uses AI to brutally evaluate startup ideas, providing honest feedback on market viability, distribution, monetization, and defensibility. Perfect for hackathon judges and founders who want quick, unfiltered feedback.",
    category: "B2B/SaaS",
    stage: "MVP built",
    brutality: "savage",
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
  };

  // Initialize form data - use lazy initializer to ensure defaults are always applied
  const [formData, setFormData] = useState<FormData>(() => {
    // Always start with defaults
    let initialData = { ...defaultFormData };

    // Check for quick roast data from landing page (only on client)
    if (typeof window !== "undefined") {
      const quickPitch = sessionStorage.getItem("quickPitch");
      const quickCategory = sessionStorage.getItem("quickCategory");
      const quickStage = sessionStorage.getItem("quickStage");
      const quickBrutality = sessionStorage.getItem("quickBrutality");

      if (quickPitch) {
        // Clear session storage after reading
        sessionStorage.removeItem("quickPitch");
        sessionStorage.removeItem("quickCategory");
        sessionStorage.removeItem("quickStage");
        sessionStorage.removeItem("quickBrutality");

        // Override with quick roast data, but keep defaults for missing fields
        initialData = {
          ...defaultFormData,
          pitch: quickPitch,
          category: (quickCategory as FormData["category"]) || defaultFormData.category,
          stage: (quickStage as FormData["stage"]) || defaultFormData.stage,
          brutality: (quickBrutality as FormData["brutality"]) || defaultFormData.brutality,
        };
      }
    }

    return initialData;
  });

  // Check for quick roast data to determine initial stage
  const getInitialStage = (): number => {
    if (typeof window !== "undefined") {
      const quickPitch = sessionStorage.getItem("quickPitch");
      if (quickPitch) {
        return 2; // Start at stage 2 if coming from quick roast
      }
    }
    return 1; // Start at stage 1 for new form
  };

  const [stage, setStage] = useState(getInitialStage());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleChannel = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      distributionChannels: prev.distributionChannels.includes(channel)
        ? prev.distributionChannels.filter((c) => c !== channel)
        : [...prev.distributionChannels, channel],
    }));
  };

  const handleSubmit = async () => {
    if (stage < 4) {
      setStage(stage + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit idea
      const ideaId = await submitIdea({
        pitch: formData.pitch,
        category: formData.category,
        stage: formData.stage,
        targetUser: formData.targetUser,
        tam: formData.tam,
        problemUrgency: formData.problemUrgency,
        alternatives: formData.alternatives,
        evidence: formData.evidence || undefined,
        distribution: formData.distribution,
        distributionChannels: formData.distributionChannels,
        cacGuess: formData.cacGuess,
        unfairEdge: formData.unfairEdge,
        monetization: formData.monetization,
        monetizationModel: formData.monetizationModel,
        price: formData.price,
        teamFit: formData.teamFit,
        tractionMetrics: formData.tractionMetrics || undefined,
        brutality: formData.brutality,
      });

      // Generate roast
      const roastResult = await generateRoast({
        ideaData: {
          pitch: formData.pitch,
          category: formData.category,
          stage: formData.stage,
          targetUser: formData.targetUser,
          tam: formData.tam,
          problemUrgency: formData.problemUrgency,
          alternatives: formData.alternatives,
          evidence: formData.evidence,
          distribution: formData.distribution,
          distributionChannels: formData.distributionChannels,
          cacGuess: formData.cacGuess,
          unfairEdge: formData.unfairEdge,
          monetization: formData.monetization,
          monetizationModel: formData.monetizationModel,
          price: formData.price,
          teamFit: formData.teamFit,
          tractionMetrics: formData.tractionMetrics,
          brutality: formData.brutality,
        },
      });

      // Save roast
      const roastId = await saveRoast({
        ideaId,
        verdict: roastResult.verdict,
        brutality: formData.brutality,
        scores: roastResult.scores,
        pivots: roastResult.pivots,
        next7days: roastResult.next7days,
      });

      router.push(`/roast/${roastId}`);
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Failed to generate roast. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">Get Your Idea Roasted</h1>
          <p className="text-lg text-muted-foreground">
            Answer a few questions to get a brutal-but-constructive evaluation
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  s <= stage 
                    ? "bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20" 
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Step {stage} of 4
          </p>
        </div>

      <Card className="glass-strong">
        <CardHeader>
          <CardTitle>
            Stage {stage}:{" "}
            {stage === 1
              ? "Idea Basics"
              : stage === 2
                ? "Market & Users"
                : stage === 3
                  ? "Go-to-Market"
                  : "Money & Fit"}
          </CardTitle>
          <CardDescription>
            {stage === 1
              ? "Tell us about your idea"
              : stage === 2
                ? "Who needs this and why?"
                : stage === 3
                  ? "How will you reach users?"
                  : "How will you make money?"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stage 1: Idea Basics */}
          {stage === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pitch">Idea Pitch</Label>
                <Textarea
                  id="pitch"
                  placeholder="Describe your idea in 1-2 sentences. Who is it for? What problem does it solve?"
                  value={formData.pitch}
                  onChange={(e) => updateField("pitch", e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.pitch.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <div className="flex flex-wrap gap-2">
                  {["B2B/SaaS", "B2C app", "Marketplace", "Dev tool", "Consumer hardware", "Other"].map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant={formData.category === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateField("category", cat as FormData["category"])}
                      className={formData.category === cat ? "" : "hover:bg-muted"}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stage</Label>
                <div className="flex flex-wrap gap-2">
                  {["Pre-idea", "Hackathon demo", "MVP built", "Traction", "Raising"].map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={formData.stage === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateField("stage", s as FormData["stage"])}
                      className={formData.stage === s ? "" : "hover:bg-muted"}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <BrutalityMeter
                value={formData.brutality}
                onChange={(value) => updateField("brutality", value)}
              />
            </>
          )}

          {/* Stage 2: Market & Users */}
          {stage === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="targetUser">Target User</Label>
                <Textarea
                  id="targetUser"
                  placeholder="Define your ideal customer (age, job, pain level). How many potential users?"
                  value={formData.targetUser}
                  onChange={(e) => updateField("targetUser", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>
                  TAM (Total Addressable Market): ${formData.tam.toLocaleString()}
                </Label>
                <Slider
                  value={[formData.tam]}
                  onValueChange={([value]) => updateField("tam", value)}
                  min={1000}
                  max={1000000000}
                  step={10000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$1K</span>
                  <span>$1B</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Problem Urgency: {formData.problemUrgency}/10</Label>
                <Slider
                  value={[formData.problemUrgency]}
                  onValueChange={([value]) => updateField("problemUrgency", value)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatives">Current Alternatives</Label>
                <Textarea
                  id="alternatives"
                  placeholder="Name 2-3 current alternatives they use (even bad ones)"
                  value={formData.alternatives}
                  onChange={(e) => updateField("alternatives", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence (Optional)</Label>
                <Input
                  id="evidence"
                  placeholder="Link to landing page, GitHub, user chats, surveys, etc."
                  value={formData.evidence || ""}
                  onChange={(e) => updateField("evidence", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Stage 3: Go-to-Market */}
          {stage === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="distribution">Distribution Plan</Label>
                <Textarea
                  id="distribution"
                  placeholder="How do first 100 users find you? Specific channels?"
                  value={formData.distribution}
                  onChange={(e) => updateField("distribution", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Distribution Channels</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DISTRIBUTION_CHANNELS.map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={channel}
                        checked={formData.distributionChannels.includes(channel)}
                        onCheckedChange={() => toggleChannel(channel)}
                      />
                      <Label htmlFor={channel} className="text-sm font-normal cursor-pointer">
                        {channel}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cacGuess">CAC Guess (Optional)</Label>
                <Input
                  id="cacGuess"
                  type="number"
                  placeholder="Customer Acquisition Cost"
                  value={formData.cacGuess || ""}
                  onChange={(e) =>
                    updateField("cacGuess", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unfairEdge">Unfair Edge / Moat</Label>
                <Textarea
                  id="unfairEdge"
                  placeholder="What's your moat? (Team expertise, data, network, patents?) Why can't incumbents copy day 1?"
                  value={formData.unfairEdge}
                  onChange={(e) => updateField("unfairEdge", e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Stage 4: Money & Fit */}
          {stage === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="monetization">Monetization Strategy</Label>
                <Textarea
                  id="monetization"
                  placeholder="How do you make money? Who pays?"
                  value={formData.monetization}
                  onChange={(e) => updateField("monetization", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Monetization Model</Label>
                <div className="flex flex-wrap gap-2">
                  {["Freemium", "Subscription", "Ads", "One-time", "Other"].map((model) => (
                    <Button
                      key={model}
                      type="button"
                      variant={formData.monetizationModel === model ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateField("monetizationModel", model as FormData["monetizationModel"])}
                      className={formData.monetizationModel === model ? "" : "hover:bg-muted"}
                    >
                      {model}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per User/Month (Optional)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 29"
                  value={formData.price || ""}
                  onChange={(e) =>
                    updateField("price", e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamFit">Team Fit</Label>
                <Textarea
                  id="teamFit"
                  placeholder="Your key skills/experience matching this idea?"
                  value={formData.teamFit}
                  onChange={(e) => updateField("teamFit", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tractionMetrics">Traction Metrics (Optional)</Label>
                <Input
                  id="tractionMetrics"
                  placeholder="Users, revenue, growth rate, etc."
                  value={formData.tractionMetrics || ""}
                  onChange={(e) => updateField("tractionMetrics", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStage(Math.max(1, stage - 1))}
              disabled={stage === 1}
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {stage === 4 ? "Generating Roast..." : "Processing..."}
                </>
              ) : (
                stage === 4 ? "Get Roasted" : "Next"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

