"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SafeImageProps {
  src?: string
  alt?: string
  className?: string
  fallbackClassName?: string
  fallback?: React.ReactNode
  width?: number
  height?: number
  fill?: boolean
  onLoad?: () => void
  onError?: () => void
  loading?: 'eager' | 'lazy'
}

export function SafeImage({
  src,
  alt = "",
  className,
  fallbackClassName,
  fallback,
  width,
  height,
  fill,
  onLoad,
  onError,
  loading = 'lazy'
}: SafeImageProps) {
  const [error, setError] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  // Check if image is already loaded (cached) on mount and when src changes
  React.useEffect(() => {
    setError(false)
    setLoaded(false)
    
    // Check if image is already complete (cached)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight > 0) {
      setLoaded(true)
    }
  }, [src])

  // Also check on mount
  React.useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight > 0) {
      setLoaded(true)
    }
  }, [])

  const handleLoad = React.useCallback(() => {
    setLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = React.useCallback(() => {
    setError(true)
    onError?.()
  }, [onError])

  if (!src || error) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground",
          fill && "absolute inset-0 w-full h-full",
          fallbackClassName
        )}
        style={!fill ? { width, height } : undefined}
      >
        <svg
          className="w-1/3 h-1/3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn(fill ? "absolute inset-0 w-full h-full" : "relative inline-block")} style={!fill ? { width, height } : undefined}>
      {/* Loading skeleton - absolute positioned */}
      {!loaded && (
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse rounded-xl",
            fill && "w-full h-full"
          )}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(
          fill ? "object-cover absolute inset-0 w-full h-full" : "object-contain relative z-10",
          !loaded && "opacity-0",
          loaded && "opacity-100 transition-opacity duration-300",
          className
        )}
        style={!fill ? { width, height } : undefined}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
      />
    </div>
  )
}
