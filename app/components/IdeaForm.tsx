"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [stage, setStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitIdea = useMutation(api.ideas.submitIdea);
  const generateRoast = useAction(api.roast.generateRoast);
  const saveRoast = useMutation(api.roasts.saveRoast);

  // Check for quick roast data from landing page
  const getInitialData = (): FormData => {
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
        
        return {
          pitch: quickPitch,
          category: (quickCategory as FormData["category"]) || "B2B/SaaS",
          stage: (quickStage as FormData["stage"]) || "Pre-idea",
          brutality: (quickBrutality as FormData["brutality"]) || "honest",
          targetUser: "",
          tam: 1000000,
          problemUrgency: 5,
          alternatives: "",
          evidence: "",
          distribution: "",
          distributionChannels: [],
          cacGuess: undefined,
          unfairEdge: "",
          monetization: "",
          monetizationModel: "Subscription",
          price: undefined,
          teamFit: "",
          tractionMetrics: "",
        };
      }
    }
    
    return {
      pitch: "",
      category: "B2B/SaaS",
      stage: "Pre-idea",
      brutality: "honest",
      targetUser: "",
      tam: 1000000,
      problemUrgency: 5,
      alternatives: "",
      evidence: "",
      distribution: "",
      distributionChannels: [],
      cacGuess: undefined,
      unfairEdge: "",
      monetization: "",
      monetizationModel: "Subscription",
      price: undefined,
      teamFit: "",
      tractionMetrics: "",
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialData());

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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-text">Get Your Idea Roasted</h1>
        <p className="text-lg text-muted-foreground">
          Answer a few questions to get a brutal-but-constructive evaluation
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded ${
              s <= stage ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Card className="terminal-border">
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    updateField("category", value as FormData["category"])
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B/SaaS">B2B/SaaS</SelectItem>
                    <SelectItem value="B2C app">B2C app</SelectItem>
                    <SelectItem value="Marketplace">Marketplace</SelectItem>
                    <SelectItem value="Dev tool">Dev tool</SelectItem>
                    <SelectItem value="Consumer hardware">Consumer hardware</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) =>
                    updateField("stage", value as FormData["stage"])
                  }
                >
                  <SelectTrigger id="stage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-idea">Pre-idea</SelectItem>
                    <SelectItem value="Hackathon demo">Hackathon demo</SelectItem>
                    <SelectItem value="MVP built">MVP built</SelectItem>
                    <SelectItem value="Traction">Traction</SelectItem>
                    <SelectItem value="Raising">Raising</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="monetizationModel">Monetization Model</Label>
                <Select
                  value={formData.monetizationModel}
                  onValueChange={(value) =>
                    updateField("monetizationModel", value as FormData["monetizationModel"])
                  }
                >
                  <SelectTrigger id="monetizationModel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="Ads">Ads</SelectItem>
                    <SelectItem value="One-time">One-time</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
  );
}

