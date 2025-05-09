"use client"

import { useState } from "react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface DebugImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export function DebugImage({
  src,
  alt,
  className,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
}: DebugImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  const handleError = () => {
    setError(`Failed to load image: ${src}`)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  return (
    <div className="relative">
      {fill ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          className={className}
          fill={fill}
          sizes={sizes}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
      ) : (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          className={className}
          width={width || 100}
          height={height || 100}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="p-2 text-center">
            <p className="text-sm text-red-500">Error loading image</p>
            <Button size="sm" variant="outline" onClick={() => setShowDebug(!showDebug)} className="mt-2">
              {showDebug ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </div>
      )}

      {showDebug && error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription className="break-all text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
