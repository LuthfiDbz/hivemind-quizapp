import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 text-lg font-bold bg-white border-4 border-black rounded-none outline-none",
          "focus:shadow-neo transition-all",
          "placeholder:text-gray-400 placeholder:font-normal",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
