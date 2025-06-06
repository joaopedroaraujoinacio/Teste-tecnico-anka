import * as React from "react"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => {
    return <button ref={ref} className={`bg-orange-500 text-white px-4 py-2 rounded ${className}`} {...props} />
  }
)
Button.displayName = "Button"
