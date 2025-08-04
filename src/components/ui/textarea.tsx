import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Adjusted for Windows 10 style: text-xs, no rounded-md, blue border on focus
          "flex min-h-[60px] w-full border border-[#adadad] bg-white px-2 py-1 text-xs ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[#0078d7] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
