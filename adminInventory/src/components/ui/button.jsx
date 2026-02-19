import React from "react"
import { cn } from "@/lib/utils"

export function Button({
  className,
  variant = "primary",
  ...props
}) {

  const variants = {
    primary:
      "bg-[#A31F35] text-white hover:opacity-90",

    secondary:
      "bg-[#0000000D] text-black hover:bg-[#0000001A]",
  }

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
