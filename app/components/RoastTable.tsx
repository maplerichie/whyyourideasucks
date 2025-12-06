"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Rocket, DollarSign, Shield, User, Zap } from "lucide-react";

type Score = {
  score: number;
  why_sucks: string;
  fix: string[];
};

type Scores = {
  market: Score;
  distribution: Score;
  monetization: Score;
  defensibility: Score;
  founder_fit: Score;
  hackathon: Score;
};

interface RoastTableProps {
  scores: Scores;
  className?: string;
}

const dimensionLabels: Record<keyof Scores, string> = {
  market: "Market",
  distribution: "Distribution",
  monetization: "Monetization",
  defensibility: "Defensibility",
  founder_fit: "Founder Fit",
  hackathon: "Hackathon",
};

const dimensionIcons: Record<keyof Scores, React.ReactNode> = {
  market: <TrendingUp className="w-5 h-5" />,
  distribution: <Rocket className="w-5 h-5" />,
  monetization: <DollarSign className="w-5 h-5" />,
  defensibility: <Shield className="w-5 h-5" />,
  founder_fit: <User className="w-5 h-5" />,
  hackathon: <Zap className="w-5 h-5" />,
};

function getScoreColor(score: number): string {
  if (score >= 7) return "score-good";
  if (score >= 5) return "score-medium";
  return "score-poor";
}

function getScoreBgColor(score: number): string {
  if (score >= 7) return "score-good-bg";
  if (score >= 5) return "score-medium-bg";
  return "score-poor-bg";
}

function getScoreIcon(score: number) {
  if (score >= 7) return <CheckCircle2 className="w-4 h-4 score-good" />;
  if (score >= 5) return <AlertCircle className="w-4 h-4 score-medium" />;
  return <XCircle className="w-4 h-4 score-poor" />;
}

export function RoastTable({ scores, className }: RoastTableProps) {
  return (
    <div className={cn("grid gap-5", className)}>
      {(Object.keys(scores) as Array<keyof Scores>).map((key) => {
        const score = scores[key];
        return (
          <Card
            key={key}
            className={cn(
              "border-2 transition-all duration-300 hover:shadow-xl bg-card/80 backdrop-blur-sm group",
              getScoreBgColor(score.score),
              "hover-lift",
              score.score >= 7 && "score-glow-good",
              score.score >= 5 && score.score < 7 && "score-glow-medium",
              score.score < 5 && "score-glow-poor"
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "p-3 rounded-xl flex items-center justify-center shadow-md border-2",
                    getScoreBgColor(score.score)
                  )}>
                    <div className={cn("transition-transform duration-300 group-hover:scale-110", getScoreColor(score.score))}>
                      {dimensionIcons[key]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-foreground mb-2">
                      {dimensionLabels[key]}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-3xl font-bold", getScoreColor(score.score))}>
                        {score.score}
                      </span>
                      <span className="text-muted-foreground font-mono text-base">/10</span>
                      {getScoreIcon(score.score)}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm px-4 py-1.5 font-semibold border-2 shadow-sm",
                    getScoreBgColor(score.score),
                    getScoreColor(score.score)
                  )}
                >
                  {score.score >= 7 ? "Strong" : score.score >= 5 ? "Moderate" : "Weak"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              {/* Why it sucks */}
              <div className="p-4 rounded-lg warning-bg border-2 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 warning-text" />
                  Why it needs improvement
                </h4>
                <p className="text-sm text-foreground leading-relaxed pl-6">
                  {score.why_sucks}
                </p>
              </div>

              {/* How to fix */}
              <div className="p-4 rounded-lg success-bg border-2 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 success-text" />
                  How to improve
                </h4>
                <ul className="space-y-2.5 pl-6">
                  {score.fix.map((fix, idx) => (
                    <li key={idx} className="text-sm text-foreground leading-relaxed flex items-start gap-3">
                      <span className="mt-1.5 font-bold text-lg success-text">•</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
