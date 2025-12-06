"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { RoastTable } from "@/app/components/RoastTable";
import { ImprovementsCard } from "@/app/components/PivotCard";
import { PrecautionsCard, ImplementationStepsCard } from "@/app/components/Next7DaysCard";
import { RoastPivotDialog } from "@/app/components/RoastPivotDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Share2, ArrowLeft, FileText, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function calculateAverageScore(scores: any): number {
  const scoreValues = Object.values(scores).map((s: any) => s.score);
  return scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length;
}

function getScoreColor(score: number): string {
  if (score >= 7) return "score-good";
  if (score >= 5) return "score-medium";
  return "score-poor";
}

function getScoreBadgeColor(score: number): string {
  if (score >= 7) return "score-good-bg score-good";
  if (score >= 5) return "score-medium-bg score-medium";
  return "score-poor-bg score-poor";
}

function getScoreBarColor(score: number): string {
  if (score >= 7) return "score-bar-good";
  if (score >= 5) return "score-bar-medium";
  return "score-bar-poor";
}

export default function RoastDisplayPage() {
  const params = useParams();
  const router = useRouter();
  const roastId = params.id as string;
  const [activeTab, setActiveTab] = useState<"result" | "raw">("result");

  const roastData = useQuery(
    api.roasts.getRoastWithIdea,
    roastId ? { roastId: roastId as any } : "skip"
  );

  if (roastData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base text-muted-foreground">Loading roast...</p>
        </div>
      </div>
    );
  }

  if (roastData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Roast not found</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const { roast, idea } = roastData;

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Idea not found</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const avgScore = calculateAverageScore(roast.scores);

  const handleCopyRaw = () => {
    const rawData = JSON.stringify({ idea, roast }, null, 2);
    navigator.clipboard.writeText(rawData);
    alert("Raw data copied to clipboard!");
  };

  const handleShare = () => {
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
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/")} 
              className="gap-2 hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 font-medium">
                {idea.category}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 font-medium">
                {idea.stage}
              </Badge>
              <Badge variant="outline" className="capitalize px-3 py-1 font-medium">
                {roast.brutality}
              </Badge>
            </div>
          </div>
          
          {/* Idea Pitch Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground leading-tight max-w-4xl">
              {idea.pitch}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Average Score: <span className={`font-semibold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}/10</span>
              </span>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "result" | "raw")} className="mb-10">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <TabsList className="bg-primary/10 border border-primary/30">
              <TabsTrigger value="result" className="gap-2">
                <FileText className="w-4 h-4" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="raw" className="gap-2">
                <FileText className="w-4 h-4" />
                Raw Data
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare} 
                className="gap-2 hover:bg-secondary"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.print()} 
                className="gap-2 hover:bg-secondary"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Result Tab */}
          <TabsContent value="result" className="space-y-10">
            {/* Verdict Section */}
            <Card className={cn(
              "border-2 shadow-elevated backdrop-blur-sm transition-shadow hover-lift",
              avgScore >= 7 ? "score-good-bg score-glow-good" : 
              avgScore >= 5 ? "score-medium-bg score-glow-medium" : 
              "score-poor-bg score-glow-poor"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-xl shadow-lg border-2",
                      avgScore >= 7 ? "score-good-bg" : 
                      avgScore >= 5 ? "score-medium-bg" : 
                      "score-poor-bg"
                    )}>
                      <Sparkles className={cn(
                        "w-6 h-6",
                        avgScore >= 7 ? "score-good" : 
                        avgScore >= 5 ? "score-medium" : 
                        "score-poor"
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold mb-1">Overall Verdict</CardTitle>
                      <p className="text-sm text-muted-foreground">Comprehensive evaluation summary</p>
                    </div>
                  </div>
                  <Badge className={`text-lg px-5 py-2 font-bold border-2 shadow-lg ${getScoreBadgeColor(avgScore)}`}>
                    {avgScore.toFixed(1)}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-foreground font-medium">{roast.verdict}</p>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="hover-lift border-2 border-border bg-primary/15 backdrop-blur-sm hover:border-primary/20 transition-all">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">Target User</p>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">{idea.targetUser}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift border-2 border-border bg-primary/15 backdrop-blur-sm hover:border-primary/20 transition-all">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">TAM</p>
                    <p className="text-sm font-semibold text-foreground">${idea.tam.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift border-2 border-border bg-primary/15 backdrop-blur-sm hover:border-primary/20 transition-all">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">Problem Urgency</p>
                    <p className="text-sm font-semibold text-foreground">{idea.problemUrgency}/10</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift border-2 border-border bg-primary/15 backdrop-blur-sm hover:border-primary/20 transition-all">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">Monetization</p>
                    <p className="text-sm font-semibold text-foreground">{idea.monetizationModel}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Scores */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-foreground">Detailed Analysis</h2>
                <p className="text-muted-foreground">Breakdown by dimension with specific critiques and fixes</p>
              </div>
              <RoastTable scores={roast.scores} className="space-y-4" />
            </div>

            {/* Improvements Section */}
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-foreground">Constructive Improvements</h2>
                <p className="text-muted-foreground">Actionable suggestions to strengthen your idea</p>
              </div>
              <ImprovementsCard improvements={roast.improvements} />
            </div>

            {/* Precautions */}
            {roast.precautions.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Precautions</h2>
                  <p className="text-muted-foreground">Things to watch out for when implementing improvements</p>
                </div>
                <PrecautionsCard precautions={roast.precautions} />
              </div>
            )}

            {/* Implementation Steps */}
            {roast.implementationSteps.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Implementation Steps</h2>
                  <p className="text-muted-foreground">Step-by-step guidance from a product manager perspective</p>
                </div>
                <ImplementationStepsCard steps={roast.implementationSteps} />
              </div>
            )}

            {/* Actions */}
            <Card className="border-border/50">
              <CardContent className="pt-8 pb-8">
                <div className="flex gap-4 flex-wrap justify-center">
                  <Button
                    onClick={() => router.push("/roast")}
                    variant="outline"
                    size="lg"
                    className="gap-2 hover:bg-secondary"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Roast Another Idea
                  </Button>
                  <Button
                    onClick={() => router.push("/directory")}
                    variant="outline"
                    size="lg"
                    className="gap-2 hover:bg-secondary"
                  >
                    Browse Directory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw Data Tab */}
          <TabsContent value="raw" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Raw JSON Data</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyRaw} 
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary rounded-lg p-4 overflow-auto text-xs font-mono border border-border text-foreground">
                  {JSON.stringify({ idea, roast }, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
