"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PrecautionsCardProps {
  precautions: string[];
  className?: string;
}

export function PrecautionsCard({ precautions, className }: PrecautionsCardProps) {
  if (precautions.length === 0) return null;

  return (
    <Card className={cn("hover-lift border-2 warning-bg shadow-elevated bg-card/80 backdrop-blur-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 warning-text" />
          Precautions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {precautions.map((precaution, idx) => (
            <div key={idx} className="flex gap-4 p-5 rounded-lg warning-bg border-2 hover:shadow-md transition-all duration-200">
              <div className="shrink-0 w-10 h-10 rounded-xl warning-bg warning-text flex items-center justify-center font-bold text-lg shadow-md border">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-base text-foreground leading-relaxed font-medium">{precaution}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ImplementationStepsCardProps {
  steps: string[];
  className?: string;
}

export function ImplementationStepsCard({ steps, className }: ImplementationStepsCardProps) {
  if (steps.length === 0) return null;

  return (
    <Card className={cn("hover-lift border-2 border-border shadow-elevated bg-card/80 backdrop-blur-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 success-text" />
          Implementation Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 p-5 rounded-lg success-bg border-2 hover:shadow-md transition-all duration-200">
              <div className="shrink-0 w-12 h-12 rounded-xl success-bg success-text flex items-center justify-center font-bold text-lg shadow-md border-2">
                {idx + 1}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-base text-foreground leading-relaxed font-medium">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
