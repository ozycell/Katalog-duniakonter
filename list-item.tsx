import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const listItemVariants = cva(
    "w-full flex items-center bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:bg-accent/50 cursor-pointer",
    {
        variants: {
            variant: {
                default: "min-h-[3.5rem] px-4 py-2", // Large (Default) 56px
                medium: "min-h-[3rem] px-4 py-2",     // Medium 48px
                small: "min-h-[2.5rem] px-3 py-1.5",   // Small 40px
            },
            hasBorder: {
                true: "border-b border-border last:border-0",
                false: "",
            }
        },
        defaultVariants: {
            variant: "default",
            hasBorder: false,
        },
    }
)

export interface ListItemProps
    extends Omit<React.ButtonHTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof listItemVariants> {
    title: React.ReactNode
    subtitle?: React.ReactNode
    description?: React.ReactNode
    leading?: React.ReactNode
    trailing?: React.ReactNode
    asChild?: boolean
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
    ({ className, variant, hasBorder, title, subtitle, description, leading, trailing, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(listItemVariants({ variant, hasBorder, className }))}
                {...props}
            >
                {leading && (
                    <div className={cn(
                        "flex-shrink-0 flex items-center justify-center mr-4",
                        variant === "small" ? "mr-3" : "mr-4"
                    )}>
                        {leading}
                    </div>
                )}

                <div className="flex-1 flex flex-col text-left min-w-0 gap-0.5">
                    <div className={cn(
                        "font-medium text-foreground truncate",
                        variant === "small" ? "text-label-sm" : "text-body-md"
                    )}>
                        {title}
                    </div>

                    {subtitle && (
                        <div className={cn(
                            "text-muted-foreground truncate",
                            variant === "small" ? "text-caption" : "text-body-sm"
                        )}>
                            {subtitle}
                        </div>
                    )}

                    {description && (
                        <div className={cn(
                            "text-muted-foreground line-clamp-2 mt-0.5",
                            variant === "small" ? "text-[10px]" : "text-caption"
                        )}>
                            {description}
                        </div>
                    )}
                </div>

                {trailing && (
                    <div className="flex-shrink-0 ml-4 text-muted-foreground">
                        {trailing}
                    </div>
                )}
            </div>
        )
    }
)
ListItem.displayName = "ListItem"

export { ListItem, listItemVariants }
