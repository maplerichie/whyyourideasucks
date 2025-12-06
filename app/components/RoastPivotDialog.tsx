"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RoastPivotDialogProps {
  originalIdea: {
    pitch: string;
    category: string;
    stage: string;
    targetUser: string;
    tam: number;
    problemUrgency: number;
    alternatives: string;
    distribution: string;
    distributionChannels: string[];
    unfairEdge: string;
    monetization: string;
    monetizationModel: string;
    teamFit: string;
    brutality: "gentle" | "honest" | "savage";
  };
  pivotText: string;
}

export function RoastPivotDialog({ originalIdea, pivotText }: RoastPivotDialogProps) {
  const [open, setOpen] = useState(false);
  const [pitch, setPitch] = useState(pivotText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const generateRoast = useAction(api.roast.generateRoast);
  const submitIdea = useMutation(api.ideas.submitIdea);
  const saveRoast = useMutation(api.roasts.saveRoast);

  const handleRoastPivot = async () => {
    if (!pitch.trim()) {
      alert("Please enter your pivot idea");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create new idea with updated pitch
      const ideaId = await submitIdea({
        ...originalIdea,
        pitch,
        category: originalIdea.category as "B2B/SaaS" | "B2C app" | "Marketplace" | "Dev tool" | "Consumer hardware" | "Other",
        stage: originalIdea.stage as "Pre-idea" | "Hackathon demo" | "MVP built" | "Traction" | "Raising",
        monetizationModel: originalIdea.monetizationModel as "Freemium" | "Subscription" | "Ads" | "One-time" | "Other",
      });

      // Generate roast for the pivot
      const roastResult = await generateRoast({
        ideaData: {
          ...originalIdea,
          pitch,
        },
      });

      // Save roast
      const roastId = await saveRoast({
        ideaId,
        verdict: roastResult.verdict,
        brutality: originalIdea.brutality,
        scores: roastResult.scores,
        pivots: roastResult.pivots,
        next7days: roastResult.next7days,
      });

      router.push(`/roast/${roastId}`);
    } catch (error) {
      console.error("Error roasting pivot:", error);
      alert("Failed to roast pivot. Please try again.");
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Roast This Pivot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Roast Your Pivot</DialogTitle>
          <DialogDescription>
            Edit your pivot idea and get it roasted. We'll re-evaluate it with the same criteria.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pivot-pitch">Your Pivot Idea</Label>
            <Textarea
              id="pivot-pitch"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              rows={6}
              placeholder="Describe your improved pivot idea..."
            />
            <p className="text-xs text-muted-foreground">
              Original idea: {originalIdea.pitch.substring(0, 100)}...
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoastPivot} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Roasting...
                </>
              ) : (
                "Get Roasted"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

