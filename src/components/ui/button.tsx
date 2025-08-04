import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Adjusted for Windows 10 style
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0078d7] disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", // Removed rounded-md, adjusted gap, focus ring
  {
    variants: {
      variant: {
        // 'default' might not be used often if 'outline' becomes the standard Win10 look
        default: "bg-[#0078d7] text-white hover:bg-[#005a9e] border border-[#0078d7]", // Primary action style
        destructive:
          "bg-red-600 text-white hover:bg-red-700 border border-red-700", // Destructive action
        outline: // This will be the standard Windows button look
          "border border-[#adadad] bg-[#f0f0f0] text-black hover:bg-[#e5f1fb] hover:border-[#0078d7] disabled:bg-[#f0f0f0] disabled:border-[#cccccc] disabled:text-gray-500",
        secondary: // A less prominent style
          "border border-[#adadad] bg-[#e0e0e0] text-black hover:bg-[#e5e5e5] disabled:bg-[#e0e0e0] disabled:border-[#cccccc] disabled:text-gray-500",
        ghost: "hover:bg-[#e5f1fb] text-black disabled:text-gray-500", // No border/bg initially
        link: "text-blue-600 underline-offset-4 hover:underline disabled:text-gray-500",
      },
      size: {
        default: "h-7 px-3 text-xs", // Default Win10 button size
        sm: "h-6 px-2 text-xs",    // Smaller size
        lg: "h-9 px-5 text-sm",    // Larger size
        icon: "h-7 w-7",          // Icon button size
      },
    },
    defaultVariants: {
      variant: "outline", // Make the Win10 outline style the default
      size: "default",   // Make the Win10 default size the default
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
