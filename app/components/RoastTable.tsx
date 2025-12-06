"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

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

function getScoreColor(score: number): string {
  if (score >= 7) return "text-primary"; // Blue
  if (score >= 5) return "text-accent"; // Orange
  return "text-destructive"; // Red
}

export function RoastTable({ scores, className }: RoastTableProps) {
  return (
    <div className={cn("rounded-xl glass overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dimension</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead>Why it "sucks" now</TableHead>
            <TableHead>How to make it suck less</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(Object.keys(scores) as Array<keyof Scores>).map((key) => {
            const score = scores[key];
            return (
              <TableRow key={key}>
                <TableCell className="font-medium">
                  {dimensionLabels[key]}
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("text-2xl font-bold score-display", getScoreColor(score.score))}>
                    {score.score}
                  </span>
                  <span className="text-muted-foreground font-mono">/10</span>
                </TableCell>
                <TableCell className="max-w-md">{score.why_sucks}</TableCell>
                <TableCell className="max-w-md">
                  <ul className="list-disc list-inside space-y-1">
                    {score.fix.map((fix, idx) => (
                      <li key={idx} className="text-sm">{fix}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

