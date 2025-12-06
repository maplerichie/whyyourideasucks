import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input/50 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive glass flex field-sizing-content min-h-20 w-full rounded-lg bg-background/30 px-4 py-3 text-base transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:shadow-lg focus-visible:shadow-primary/20 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
