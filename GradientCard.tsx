import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { itemVariants } from "@/lib/animation";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  animate?: boolean;
}

/**
 * GradientCard - Base card component dengan styling gradient primary
 * 
 * Background features:
 * - Gradient: from-primary via-primary to-primary-700
 * - Pattern dots: radial gradient 24px
 * - Decorative circles: various sizes with border
 * - Gradient orbs: blur effect
 * - Border glow: white/10
 * 
 * Usage:
 * <GradientCard padding="md" animate>
 *   <YourContent />
 * </GradientCard>
 */
export function GradientCard({
  children,
  className,
  padding = "md",
  animate = true,
}: GradientCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  const CardWrapper = animate ? motion.div : "div";

  return (
    <CardWrapper
      variants={animate ? itemVariants : undefined}
      className={className}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-700 shadow-primary-xl">
        {/* Pattern dots */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Modern circles pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large circles */}
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full border border-white/[0.08]" />
          <div className="absolute top-16 right-16 w-20 h-20 rounded-full border border-white/[0.05]" />
          <div className="absolute bottom-8 left-20 w-28 h-28 rounded-full border border-white/[0.06]" />
          <div className="absolute bottom-16 left-8 w-16 h-16 rounded-full border border-white/[0.04]" />

          {/* Filled circles with low opacity */}
          <div className="absolute top-4 right-32 w-3 h-3 rounded-full bg-white/10" />
          <div className="absolute top-20 right-4 w-2 h-2 rounded-full bg-white/15" />
          <div className="absolute bottom-12 left-12 w-4 h-4 rounded-full bg-white/8" />
          <div className="absolute top-1/2 right-24 w-2 h-2 rounded-full bg-white/12" />
          <div className="absolute bottom-24 right-16 w-3 h-3 rounded-full bg-white/10" />

          {/* Ring circles */}
          <div className="absolute top-24 left-16 w-12 h-12 rounded-full border-2 border-white/[0.03]" />
          <div className="absolute bottom-4 right-20 w-8 h-8 rounded-full border border-white/[0.05]" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-primary-400/20 blur-3xl pointer-events-none" />

        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

        <div className={cn("relative", paddingClasses[padding])}>
          {children}
        </div>
      </div>
    </CardWrapper>
  );
}
