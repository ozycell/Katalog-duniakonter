import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { itemVariants } from "@/lib/animation";

interface QuickAmountGridProps {
  amounts: number[];
  selected: number | null;
  onSelect: (amount: number) => void;
  disabled?: boolean;
  className?: string;
}

const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `${amount / 1000000} Jt`;
  }
  return `${amount / 1000}rb`;
};

export function QuickAmountGrid({
  amounts,
  selected,
  onSelect,
  disabled = false,
  className
}: QuickAmountGridProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      <div className="grid grid-cols-3 gap-2">
        {amounts.map((amount) => (
          <motion.button
            key={amount}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(amount)}
            className={cn(
              "py-2.5 px-2 rounded-xl text-label-md font-medium transition-all border",
              selected === amount
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5 active:scale-95",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {formatAmount(amount)}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export const DEFAULT_QUICK_AMOUNTS = [10000, 50000, 100000, 250000, 500000, 1000000];
