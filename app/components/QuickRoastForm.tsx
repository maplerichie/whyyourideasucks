"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BrutalityMeter } from "./BrutalityMeter";

export function QuickRoastForm() {
  const [pitch, setPitch] = useState(``);
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

    router.push("/roast?step=2");
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-elevated border-2 border-border bg-primary/15 backdrop-blur-sm">
      <CardContent className="pt-8 pb-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="quick-pitch" className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-sm animate-pulse"></span>
              Pitch your idea (8-10 sentences)
            </Label>
            <Textarea
              id="quick-pitch"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Describe your idea. Who is it for? What problem does it solve?"
              rows={6}
              className="text-base border-2 border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all bg-background/50"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {pitch.length}/500 characters
              </p>
              {pitch.trim().length >= 50 && (
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Ready to roast
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-foreground">Category</Label>
              <div className="flex flex-wrap gap-2">
                {["B2B/SaaS", "B2C app", "Marketplace", "Dev tool", "Consumer hardware", "Other"].map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={category === cat ? "shadow-md bg-primary text-primary-foreground" : "hover:border-primary/50 hover:bg-primary/5"}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-foreground">Stage</Label>
              <div className="flex flex-wrap gap-2">
                {["Pre-idea", "Hackathon demo", "MVP built", "Traction", "Raising"].map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={stage === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStage(s)}
                    className={stage === s ? "shadow-md bg-primary text-primary-foreground" : "hover:border-primary/50 hover:bg-primary/5"}
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
            className="w-full bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
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
