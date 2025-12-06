"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    evidence?: string;
    cacGuess?: number;
    price?: number;
    tractionMetrics?: string;
  };
  pivotText: string;
}

export function RoastPivotDialog({ originalIdea, pivotText }: RoastPivotDialogProps) {
  const router = useRouter();

  const handleRoastPivot = () => {
    // Store all pivot data in sessionStorage for the form to pre-fill
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pivotPitch", pivotText);
      sessionStorage.setItem("pivotCategory", originalIdea.category);
      sessionStorage.setItem("pivotStage", originalIdea.stage);
      sessionStorage.setItem("pivotBrutality", originalIdea.brutality);
      sessionStorage.setItem("pivotTargetUser", originalIdea.targetUser);
      sessionStorage.setItem("pivotTam", String(originalIdea.tam));
      sessionStorage.setItem("pivotProblemUrgency", String(originalIdea.problemUrgency));
      sessionStorage.setItem("pivotAlternatives", originalIdea.alternatives);
      sessionStorage.setItem("pivotDistribution", originalIdea.distribution);
      sessionStorage.setItem("pivotDistributionChannels", JSON.stringify(originalIdea.distributionChannels));
      sessionStorage.setItem("pivotUnfairEdge", originalIdea.unfairEdge);
      sessionStorage.setItem("pivotMonetization", originalIdea.monetization);
      sessionStorage.setItem("pivotMonetizationModel", originalIdea.monetizationModel);
      sessionStorage.setItem("pivotTeamFit", originalIdea.teamFit);
      
      if (originalIdea.evidence) {
        sessionStorage.setItem("pivotEvidence", originalIdea.evidence);
      }
      if (originalIdea.cacGuess) {
        sessionStorage.setItem("pivotCacGuess", String(originalIdea.cacGuess));
      }
      if (originalIdea.price) {
        sessionStorage.setItem("pivotPrice", String(originalIdea.price));
      }
      if (originalIdea.tractionMetrics) {
        sessionStorage.setItem("pivotTractionMetrics", originalIdea.tractionMetrics);
      }
      
      // Mark as pivot data
      sessionStorage.setItem("isPivot", "true");
    }

    // Redirect to the form
    router.push("/roast");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRoastPivot}>
      Roast This Pivot
    </Button>
  );
}

