import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-32 w-full rounded-sm border border-white/10 bg-white/15 px-4 py-3 text-base font-light text-foreground outline-none transition-all resize-none",
        "placeholder:text-muted-foreground/50",
        "focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/20",
        "aria-invalid:border-red-400/90 aria-invalid:ring-red-400/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
