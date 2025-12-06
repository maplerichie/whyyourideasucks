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
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary shadow-sm"></span>
        Brutality Level
      </label>
      <div className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? "default" : "outline"}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 flex flex-col items-start h-auto py-3 px-4 transition-all duration-200",
              value === option.value && "shadow-md border-2 bg-primary text-primary-foreground",
              value !== option.value && "hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <span className="font-semibold text-sm">{option.label}</span>
            <span className="text-xs opacity-70 mt-0.5">{option.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
