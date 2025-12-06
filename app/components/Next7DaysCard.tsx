"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Next7DaysCardProps {
  actions: string[];
  className?: string;
}

export function Next7DaysCard({ actions, className }: Next7DaysCardProps) {
  if (actions.length === 0) return null;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold gradient-text">Next 7 Days Action Plan</CardTitle>
        <CardDescription className="text-muted-foreground">
          Tiny experiments to validate your riskiest assumptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {actions.map((action, idx) => (
            <li key={idx} className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs mt-0.5">
                {idx + 1}
              </div>
              <p className="flex-1 text-sm">{action}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

