"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PivotCardProps {
  pivots: string[];
  className?: string;
  onRoastPivot?: (pivotText: string) => ReactNode;
}

export function PivotCard({ pivots, className, onRoastPivot }: PivotCardProps) {
  if (pivots.length === 0) return null;

  return (
    <Card className={cn("glass", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold gradient-text">Suggested Pivots</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sharper versions of your idea to consider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pivots.map((pivot, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed mb-2">{pivot}</p>
                {onRoastPivot && (
                  <div className="mt-2">
                    {onRoastPivot(pivot)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

