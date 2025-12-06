"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { RoastTable } from "@/app/components/RoastTable";
import { PivotCard } from "@/app/components/PivotCard";
import { Next7DaysCard } from "@/app/components/Next7DaysCard";
import { RoastPivotDialog } from "@/app/components/RoastPivotDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RoastDisplayPage() {
  const params = useParams();
  const router = useRouter();
  const roastId = params.id as string;

  const roastData = useQuery(
    api.publicRoasts.getRoastWithIdea,
    roastId ? { roastId: roastId as any } : "skip"
  );

  const makePublic = useMutation(api.publicRoasts.makePublic);

  if (roastData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading roast...</p>
        </div>
      </div>
    );
  }

  if (roastData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Roast not found</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const { roast, idea } = roastData;

  const handleMakePublic = async () => {
    try {
      await makePublic({ roastId: roastId as any });
      alert("Roast made public! It will appear in the directory.");
    } catch (error) {
      console.error("Error making public:", error);
      alert("Failed to make public. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            ← Back to Home
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{idea.category}</Badge>
            <Badge variant="outline">{idea.stage}</Badge>
            <Badge variant="outline">{roast.brutality}</Badge>
          </div>
        </div>

        {/* Verdict */}
        <Card className="mb-8 glass-strong glow-blue">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text">Verdict</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-foreground">{roast.verdict}</p>
          </CardContent>
        </Card>

        {/* Idea Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Idea Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{idea.pitch}</p>
          </CardContent>
        </Card>

        {/* Scores Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 gradient-text">Scores</h2>
          <RoastTable scores={roast.scores} />
        </div>

        {/* Pivots */}
        <div className="mb-8">
          <PivotCard 
            pivots={roast.pivots}
            onRoastPivot={(pivotText) => (
              <RoastPivotDialog 
                originalIdea={{
                  pitch: idea.pitch,
                  category: idea.category,
                  stage: idea.stage,
                  targetUser: idea.targetUser,
                  tam: idea.tam,
                  problemUrgency: idea.problemUrgency,
                  alternatives: idea.alternatives,
                  distribution: idea.distribution,
                  distributionChannels: idea.distributionChannels,
                  unfairEdge: idea.unfairEdge,
                  monetization: idea.monetization,
                  monetizationModel: idea.monetizationModel,
                  teamFit: idea.teamFit,
                  brutality: roast.brutality,
                }}
                pivotText={pivotText}
              />
            )}
          />
        </div>

        {/* Next 7 Days */}
        <div className="mb-8">
          <Next7DaysCard actions={roast.next7days} />
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-wrap">
          <Button onClick={handleMakePublic} variant="outline">
            Make Public
          </Button>
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My Idea Roast",
                  text: `Check out my idea roast: ${roast.verdict}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            variant="outline"
          >
            Share
          </Button>
          <Button
            onClick={() => {
              window.print();
            }}
            variant="outline"
          >
            Export PDF
          </Button>
          <Button
            onClick={() => router.push("/roast")}
            variant="outline"
          >
            Roast Another Idea
          </Button>
        </div>
      </div>
    </div>
  );
}

