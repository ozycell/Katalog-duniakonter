import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  label: string
  stepRange?: number[]
}

interface StepIndicatorProps {
  currentStep: number
  steps: Step[]
  className?: string
}

export function StepIndicator({ currentStep, steps, className }: StepIndicatorProps) {
  return (
    <div className={cn("px-4 py-4", className)}>
      <div className="relative flex items-start">
        {steps.map((s, index) => {
          const isInRange = s.stepRange ? s.stepRange.includes(currentStep) : s.number === currentStep
          const isActive = isInRange
          const isCompleted = s.stepRange
            ? currentStep > Math.max(...s.stepRange)
            : currentStep > s.number
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={s.number}>
              {/* Step Item */}
              <div className="flex flex-col items-center flex-1 relative">
                {/* Circle with border ring to cover line */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold transition-all relative z-10",
                    "ring-4 ring-primary",
                    isActive && "bg-white text-primary-600",
                    isCompleted && "bg-emerald-400 text-white",
                    !isActive && !isCompleted && "bg-primary/50 text-white"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : s.number}
                </div>
                {/* Label */}
                <span 
                  className={cn(
                    "mt-2 text-center leading-tight text-[12px] max-w-[60px]",
                    isActive ? "text-white font-medium" : "text-white/70"
                  )}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex items-center pt-4 w-full">
                  <div className={cn("h-0.5 w-full mx-2", isCompleted ? "bg-emerald-400" : "bg-white/30")} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
