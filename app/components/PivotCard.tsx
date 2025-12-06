"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ImprovementsCardProps {
  improvements: string[];
  className?: string;
}

export function ImprovementsCard({ improvements, className }: ImprovementsCardProps) {
  if (improvements.length === 0) return null;

  return (
    <Card className={cn("hover-lift border-2 border-border shadow-elevated bg-card/80 backdrop-blur-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 success-text" />
          Improvements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {improvements.map((improvement, idx) => (
            <div key={idx} className="flex gap-4 items-start p-4 rounded-lg success-bg border-2 hover:shadow-md transition-all duration-200">
              <div className="shrink-0 w-10 h-10 rounded-xl success-bg success-text flex items-center justify-center font-bold text-base shadow-md border-2">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-base leading-relaxed text-foreground font-medium">{improvement}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
