import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    
    const variants = {
      primary: 'bg-neo-blue text-white',
      secondary: 'bg-white text-black',
      danger: 'bg-neo-pink text-black',
      warning: 'bg-neo-yellow text-black',
      success: 'bg-neo-green text-black',
    };

    return (
      <button
        ref={ref}
        className={cn(
          "px-6 py-3 font-bold text-lg rounded-none border-4 border-black transition-all hover:cursor-pointer",
          "shadow-neo hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg",
          "active:translate-x-1 active:translate-y-1 active:shadow-none",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
