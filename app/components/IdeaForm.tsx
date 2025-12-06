"use client";

import { useState, useEffect } from "react";
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
import { getSettings, validateSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Zap, TrendingUp, Shield, DollarSign, Rocket } from "lucide-react";

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

  // Initialize form data with defaults - will be populated from sessionStorage in useEffect
  const [formData, setFormData] = useState<FormData>({
    pitch: "",
    category: "B2B/SaaS",
    stage: "MVP built",
    brutality: "honest",
    targetUser: "",
    tam: 1000000,
    problemUrgency: 5,
    alternatives: "",
    distribution: "",
    distributionChannels: [],
    unfairEdge: "",
    monetization: "",
    monetizationModel: "Subscription",
    teamFit: "",
  });

  // Start at stage 2 if URL parameter indicates quick roast, otherwise stage 1
  const getInitialStage = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("step") === "2") return 2;
    }
    return 1;
  };
  const [stage, setStage] = useState(getInitialStage());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from sessionStorage after component mounts (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check URL parameter for step=2 (quick roast indicator)
    const params = new URLSearchParams(window.location.search);
    const shouldStartAtStage2 = params.get("step") === "2";

    // Check for pivot data first (full form pre-fill)
    const isPivot = sessionStorage.getItem("isPivot");
    if (isPivot === "true") {
      const pivotPitch = sessionStorage.getItem("pivotPitch");
      if (pivotPitch) {
        const pivotCategory = sessionStorage.getItem("pivotCategory");
        const pivotStage = sessionStorage.getItem("pivotStage");
        const pivotBrutality = sessionStorage.getItem("pivotBrutality");
        const pivotTargetUser = sessionStorage.getItem("pivotTargetUser");
        const pivotTam = sessionStorage.getItem("pivotTam");
        const pivotProblemUrgency = sessionStorage.getItem("pivotProblemUrgency");
        const pivotAlternatives = sessionStorage.getItem("pivotAlternatives");
        const pivotEvidence = sessionStorage.getItem("pivotEvidence");
        const pivotDistribution = sessionStorage.getItem("pivotDistribution");
        const pivotDistributionChannels = sessionStorage.getItem("pivotDistributionChannels");
        const pivotCacGuess = sessionStorage.getItem("pivotCacGuess");
        const pivotUnfairEdge = sessionStorage.getItem("pivotUnfairEdge");
        const pivotMonetization = sessionStorage.getItem("pivotMonetization");
        const pivotMonetizationModel = sessionStorage.getItem("pivotMonetizationModel");
        const pivotPrice = sessionStorage.getItem("pivotPrice");
        const pivotTeamFit = sessionStorage.getItem("pivotTeamFit");
        const pivotTractionMetrics = sessionStorage.getItem("pivotTractionMetrics");

        // Update form data
        setFormData({
          pitch: pivotPitch,
          category: (pivotCategory as FormData["category"]) || "B2B/SaaS",
          stage: (pivotStage as FormData["stage"]) || "MVP built",
          brutality: (pivotBrutality as FormData["brutality"]) || "honest",
          targetUser: pivotTargetUser || "",
          tam: pivotTam ? Number(pivotTam) : 0,
          problemUrgency: pivotProblemUrgency ? Number(pivotProblemUrgency) : 5,
          alternatives: pivotAlternatives || "",
          evidence: pivotEvidence || undefined,
          distribution: pivotDistribution || "",
          distributionChannels: pivotDistributionChannels ? JSON.parse(pivotDistributionChannels) : [],
          cacGuess: pivotCacGuess ? Number(pivotCacGuess) : undefined,
          unfairEdge: pivotUnfairEdge || "",
          monetization: pivotMonetization || "",
          monetizationModel: (pivotMonetizationModel as FormData["monetizationModel"]) || "Subscription",
          price: pivotPrice ? Number(pivotPrice) : undefined,
          teamFit: pivotTeamFit || "",
          tractionMetrics: pivotTractionMetrics || undefined,
        });

        // Clear all pivot data from sessionStorage after reading
        sessionStorage.removeItem("isPivot");
        sessionStorage.removeItem("pivotPitch");
        sessionStorage.removeItem("pivotCategory");
        sessionStorage.removeItem("pivotStage");
        sessionStorage.removeItem("pivotBrutality");
        sessionStorage.removeItem("pivotTargetUser");
        sessionStorage.removeItem("pivotTam");
        sessionStorage.removeItem("pivotProblemUrgency");
        sessionStorage.removeItem("pivotAlternatives");
        sessionStorage.removeItem("pivotEvidence");
        sessionStorage.removeItem("pivotDistribution");
        sessionStorage.removeItem("pivotDistributionChannels");
        sessionStorage.removeItem("pivotCacGuess");
        sessionStorage.removeItem("pivotUnfairEdge");
        sessionStorage.removeItem("pivotMonetization");
        sessionStorage.removeItem("pivotMonetizationModel");
        sessionStorage.removeItem("pivotPrice");
        sessionStorage.removeItem("pivotTeamFit");
        sessionStorage.removeItem("pivotTractionMetrics");

        setIsInitialized(true);
        return;
      }
    }

    // Check for quick roast data (partial pre-fill)
    const quickPitch = sessionStorage.getItem("quickPitch");
    if (quickPitch) {
      const quickCategory = sessionStorage.getItem("quickCategory");
      const quickStage = sessionStorage.getItem("quickStage");
      const quickBrutality = sessionStorage.getItem("quickBrutality");

      // Update form data with quick roast data (partial pre-fill)
      setFormData((prev) => ({
        ...prev,
        pitch: quickPitch,
        category: (quickCategory as FormData["category"]) || "B2B/SaaS",
        stage: (quickStage as FormData["stage"]) || "MVP built",
        brutality: (quickBrutality as FormData["brutality"]) || "honest",
        targetUser: prev.targetUser || "",
        tam: prev.tam || 0,
        problemUrgency: prev.problemUrgency || 5,
        alternatives: prev.alternatives || "",
        distribution: prev.distribution || "",
        distributionChannels: prev.distributionChannels || [],
        unfairEdge: prev.unfairEdge || "",
        monetization: prev.monetization || "",
        monetizationModel: prev.monetizationModel || "Subscription",
        teamFit: prev.teamFit || "",
      }));

      // Set stage to 2 for quick roast
      setStage(2);

      // Clear session storage after reading
      sessionStorage.removeItem("quickPitch");
      sessionStorage.removeItem("quickCategory");
      sessionStorage.removeItem("quickStage");
      sessionStorage.removeItem("quickBrutality");

      setIsInitialized(true);
      return;
    }

    // If URL parameter indicates step=2 but no sessionStorage data, still start at stage 2
    // This handles cases where sessionStorage might have been cleared or not set yet
    if (shouldStartAtStage2) {
      setStage(2);
    }

    setIsInitialized(true);
  }, []);
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
      // Get and validate settings
      const settings = getSettings();
      const validation = validateSettings(settings);
      if (!validation.valid) {
        alert(
          `Settings error: ${validation.errors.join(", ")}\n\nPlease configure your API keys in Settings.`
        );
        setIsSubmitting(false);
        return;
      }

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
        modelSettings: settings.agents,
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
        settings,
      });

      // Save roast
      const roastId = await saveRoast({
        ideaId,
        verdict: roastResult.verdict,
        brutality: formData.brutality,
        scores: roastResult.scores,
        improvements: roastResult.improvements,
        precautions: roastResult.precautions,
        implementationSteps: roastResult.implementationSteps,
      });

      router.push(`/roast/${roastId}`);
    } catch (error) {
      console.error("Error submitting idea:", error);
      alert("Failed to generate roast. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states for roast generation
  const [loadingStage, setLoadingStage] = useState<string>("");
  const loadingStages = [
    { icon: TrendingUp, text: "Analyzing market viability...", delay: 0 },
    { icon: Rocket, text: "Evaluating distribution channels...", delay: 2000 },
    { icon: DollarSign, text: "Assessing monetization strategy...", delay: 4000 },
    { icon: Shield, text: "Checking defensibility moats...", delay: 6000 },
    { icon: Zap, text: "Generating actionable fixes...", delay: 8000 },
  ];

  // Update loading stage during roast generation
  useEffect(() => {
    if (isSubmitting && stage === 4) {
      let currentIndex = 0;
      const timeouts: NodeJS.Timeout[] = [];

      const updateStage = () => {
        if (currentIndex < loadingStages.length) {
          setLoadingStage(loadingStages[currentIndex].text);
          currentIndex++;
          if (currentIndex < loadingStages.length) {
            const delay = loadingStages[currentIndex].delay - (loadingStages[currentIndex - 1]?.delay || 0);
            const timeout = setTimeout(updateStage, delay);
            timeouts.push(timeout);
          }
        }
      };
      updateStage();

      return () => {
        timeouts.forEach(clearTimeout);
      };
    } else {
      setLoadingStage("");
    }
  }, [isSubmitting, stage]);

  return (
    <>
      {/* Full-screen loading overlay for roast generation */}
      {isSubmitting && stage === 4 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fadeIn">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto relative">
                <Loader2 className="w-24 h-24 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-foreground animate-fadeInUp">Generating Your Roast</h2>
            <p className="text-lg text-muted-foreground mb-8 font-medium">
              {loadingStage || "Preparing analysis..."}
            </p>
            <div className="space-y-3">
              {loadingStages.map((stageItem, idx) => {
                const Icon = stageItem.icon;
                const currentIndex = loadingStages.findIndex(s => s.text === loadingStage);
                const isActive = currentIndex >= idx || (loadingStage === "" && idx === 0);
                const isCurrent = loadingStage === stageItem.text;
                return (
                  <div
                    key={stageItem.text}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${isActive
                      ? "bg-primary/10 border border-primary/20 shadow-sm"
                      : "bg-secondary/50 opacity-50"
                      }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"} ${isCurrent ? "animate-pulse" : ""}`} />
                    <span className={`text-sm font-medium flex-1 text-left ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {stageItem.text}
                    </span>
                    {isCurrent && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {isActive && !isCurrent && (
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-8 animate-pulse">
              This usually takes 30-60 seconds...
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Get Your Idea Roasted</h1>
            <p className="text-base text-muted-foreground">
              Answer a few questions to get a brutal-but-constructive evaluation
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2.5 rounded-full transition-all duration-500 ${s <= stage
                    ? "bg-primary shadow-md"
                    : "bg-secondary"
                    }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center font-medium">
              Step {stage} of 4
            </p>
          </div>

          <Card className="shadow-elevated border-2 border-border bg-primary/15 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Stage {stage}:{" "}
                {stage === 1
                  ? "Idea Basics"
                  : stage === 2
                    ? "Market & Users"
                    : stage === 3
                      ? "Go-to-Market"
                      : "Money & Fit"}
              </CardTitle>
              <CardDescription className="text-sm">
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
                      {formData.pitch?.length}/500 characters
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
                          className={formData.category === cat ? "shadow-md" : "hover:bg-primary/5 hover:border-primary/50"}
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
                          className={formData.stage === s ? "shadow-md" : "hover:bg-primary/5 hover:border-primary/50"}
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
                          className={formData.monetizationModel === model ? "shadow-md" : "hover:bg-primary/5 hover:border-primary/50"}
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
                  className={cn(
                    "relative overflow-hidden font-semibold",
                    stage === 4 && "bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {stage === 4 ? "Generating Roast..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      {stage === 4 && <Sparkles className="mr-2 h-4 w-4" />}
                      {stage === 4 ? "Get Roasted" : "Next"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
