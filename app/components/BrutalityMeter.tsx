"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Brutality = "gentle" | "honest" | "savage";

interface BrutalityMeterProps {
  value: Brutality;
  onChange: (value: Brutality) => void;
  className?: string;
}

export function BrutalityMeter({ value, onChange, className }: BrutalityMeterProps) {
  const options: { value: Brutality; label: string; description: string }[] = [
    { value: "gentle", label: "Gentle", description: "Direct but respectful" },
    { value: "honest", label: "Honest", description: "Brutally honest" },
    { value: "savage", label: "Savage", description: "Full roast mode" },
  ];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label className="text-sm font-semibold text-foreground">Brutality Level</label>
      <div className="flex gap-3">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? "default" : "outline"}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 flex flex-col items-start h-auto py-4 transition-all duration-200",
              value === option.value && "shadow-lg"
            )}
          >
            <span className="font-semibold text-base">{option.label}</span>
            <span className="text-xs opacity-80 mt-1">{option.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

