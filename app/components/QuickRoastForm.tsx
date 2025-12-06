"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BrutalityMeter } from "./BrutalityMeter";

export function QuickRoastForm() {
  const [pitch, setPitch] = useState(`Whyyourideasuck.ai takes a short description of your idea and returns a structured teardown: viability scores, why it likely fails, what would need to be true for it to work, and a sharper, improved version of the idea. Instead of “nice” advice, it optimizes for revealing fatal flaws early (distribution, market, monetization, timing, unfair advantage), then suggests concrete pivots.
`);
  const [category, setCategory] = useState<string>("B2B/SaaS");
  const [stage, setStage] = useState<string>("MVP built");
  const [brutality, setBrutality] = useState<"gentle" | "honest" | "savage">("savage");
  const router = useRouter();

  const handleQuickRoast = () => {
    if (!pitch.trim()) {
      alert("Please enter your idea pitch");
      return;
    }

    // Store in sessionStorage and redirect to full form
    sessionStorage.setItem("quickPitch", pitch);
    sessionStorage.setItem("quickCategory", category);
    sessionStorage.setItem("quickStage", stage);
    sessionStorage.setItem("quickBrutality", brutality);

    router.push("/roast");
  };

  return (
    <Card className="max-w-2xl mx-auto glass-strong">
      <CardContent className="pt-8 pb-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="quick-pitch" className="text-base font-semibold">Pitch your idea (8-10 sentences)</Label>
            <Textarea
              id="quick-pitch"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Describe your idea. Who is it for? What problem does it solve?"
              rows={6}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              {pitch.length}/500 characters
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {["B2B/SaaS", "B2C app", "Marketplace", "Dev tool", "Consumer hardware", "Other"].map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={category === cat ? "" : "hover:bg-muted"}
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
                    variant={stage === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStage(s)}
                    className={stage === s ? "" : "hover:bg-muted"}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <BrutalityMeter value={brutality} onChange={setBrutality} />

          <Button
            onClick={handleQuickRoast}
            size="lg"
            className="w-full"
            disabled={pitch.trim().length < 50}
          >
            Get Roasted
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You'll complete the full form next, but we'll pre-fill this info
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

