"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { BrutalityMeter } from "./BrutalityMeter";

export function QuickRoastForm() {
  const [pitch, setPitch] = useState("");
  const [category, setCategory] = useState<string>("B2B/SaaS");
  const [stage, setStage] = useState<string>("Pre-idea");
  const [brutality, setBrutality] = useState<"gentle" | "honest" | "savage">("honest");
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="quick-category">
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
              <Label htmlFor="quick-stage">Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger id="quick-stage">
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
          </div>

          <BrutalityMeter value={brutality} onChange={setBrutality} />

          <Button 
            onClick={handleQuickRoast} 
            size="lg" 
            className="w-full"
            disabled={!pitch.trim()}
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

