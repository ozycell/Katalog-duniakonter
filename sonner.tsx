import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-center"
      offset={64}
      gap={8}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-0 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:px-5 group-[.toaster]:py-4 group-[.toaster]:w-[calc(100vw-2rem)] group-[.toaster]:max-w-none group-[.toaster]:flex group-[.toaster]:items-start group-[.toaster]:gap-4",
          description: "group-[.toaster]:text-muted-foreground group-[.toaster]:text-sm group-[.toaster]:mt-0.5",
          icon: "group-[.toaster]:flex group-[.toaster]:shrink-0 group-[.toaster]:items-center group-[.toaster]:mt-0.5",
          content: "group-[.toaster]:flex-1 group-[.toaster]:min-w-0",
          title: "group-[.toaster]:text-sm group-[.toaster]:font-semibold",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="h-5 w-5 text-emerald-600" />,
        info: <InfoIcon className="h-5 w-5 text-primary" />,
        warning: <TriangleAlertIcon className="h-5 w-5 text-amber-600" />,
        error: <OctagonXIcon className="h-5 w-5 text-red-600" />,
        loading: <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }