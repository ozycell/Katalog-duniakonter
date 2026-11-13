import { ChangeEvent, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { itemVariants } from "@/lib/animation";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  label?: string;
  showMinError?: boolean;
  minErrorMessage?: string;
  disabled?: boolean;
  className?: string;
  /** Modern underline style */
  modern?: boolean;
}

export function AmountInput({
  value,
  onChange,
  error,
  min = 10000,
  placeholder = "0",
  label,
  showMinError = true,
  minErrorMessage = "Minimal deposit Rp 10.000",
  disabled = false,
  className,
  modern = false,
}: AmountInputProps) {
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
  const isValid = numericValue >= min;
  const showError = showMinError && numericValue > 0 && numericValue < min;
  const [isFocused, setIsFocused] = useState(false);

  const formatValue = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(numeric));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(rawValue);
  };

  // Modern underline style
  if (modern) {
    return (
      <motion.div variants={itemVariants} className={className}>
        <div className="relative">
          {/* Rp prefix + Input container */}
          <div 
            className={cn(
              "flex items-baseline gap-2 pb-3 border-b transition-all duration-300",
              isFocused 
                ? "border-primary" 
                : (showError || error) 
                  ? "border-destructive" 
                  : "border-border hover:border-muted-foreground/50"
            )}
          >
            {/* Rp prefix */}
            <span className={cn(
              "text-2xl font-bold select-none transition-colors duration-300",
              isFocused ? "text-primary" : "text-muted-foreground",
              (showError || error) && "text-destructive"
            )}>
              Rp
            </span>
            
            {/* Input */}
            <input
              type="tel"
              inputMode="numeric"
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "flex-1 bg-transparent text-3xl sm:text-4xl font-bold placeholder:text-muted-foreground/30",
                "focus:outline-none min-w-0",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                (showError || error) && "text-destructive placeholder:text-destructive/30"
              )}
              value={value ? formatValue(value) : ''}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {/* Focus indicator line - 1px sesuai standar border */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-px bg-primary origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Error message */}
        {(showError || error) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-body-sm text-destructive flex items-center gap-1.5 mt-2"
          >
            <AlertCircle className="h-4 w-4" />
            {error || minErrorMessage}
          </motion.p>
        )}
      </motion.div>
    );
  }

  // Default styling (original)
  return (
    <motion.div variants={itemVariants} className={className}>
      <div className="space-y-1.5">
        {label && (
          <label className="text-[13px] text-muted-foreground flex items-center gap-1.5 focus-within:text-foreground transition-colors">
            {label}
          </label>
        )}

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-lg font-semibold text-muted-foreground">
            Rp
          </span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full h-12 pl-10 pr-4 rounded-xl border bg-background",
              "text-display-sm font-semibold placeholder:text-muted-foreground/40",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              (showError || error) 
                ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                : "border-input"
            )}
            value={value ? formatValue(value) : ''}
            onChange={handleChange}
          />
        </div>

        {(showError || error) && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-caption text-destructive flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {error || minErrorMessage}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// Quick amount presets - 6 items starting from minimum
export const QUICK_AMOUNTS = [50000, 100000, 200000, 300000, 500000, 1000000];
