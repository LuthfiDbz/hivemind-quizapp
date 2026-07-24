import * as React from "react"
import { cn } from "../../lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pink' | 'yellow' | 'green' | 'blue' | 'orange';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white',
      pink: 'bg-neo-pink',
      yellow: 'bg-neo-yellow',
      green: 'bg-neo-green',
      blue: 'bg-neo-blue',
      orange: 'bg-neo-orange',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border-4 border-black shadow-neo rounded-none overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }
