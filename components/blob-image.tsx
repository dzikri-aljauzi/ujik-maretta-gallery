"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BlobImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export function BlobImage({
  src,
  alt,
  className = "",
  width,
  height,
  fill = false,
  sizes,
  priority = false,
}: BlobImageProps) {
  const [error, setError] = useState<boolean>(false)
  const [showDebug, setShowDebug] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>(src || "/placeholder.svg")

  useEffect(() => {
    setImgSrc(src || "/placeholder.svg")
    setError(false)
  }, [src])

  const handleError = () => {
    console.error("Failed to load image:", src)
    setError(true)
  }

  // If there's an error, fall back to a direct img tag
  if (error) {
    return (
      <div className="relative w-full h-full">
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          className={`${className} ${fill ? "absolute inset-0 w-full h-full object-cover" : ""}`}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          onError={() => {
            console.error("Direct img tag also failed to load image:", imgSrc)
            setImgSrc("/placeholder.svg")
          }}
        />

        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
        >
          {showDebug ? "Hide URL" : "Show URL"}
        </button>

        {showDebug && (
          <Alert className="absolute bottom-10 left-2 right-2 bg-black/70 text-white border-none">
            <AlertDescription className="text-xs break-all">{imgSrc}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  // Try with Next.js Image first
  if (fill) {
    return (
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        fill={true}
        sizes={sizes}
        priority={priority}
        onError={handleError}
        unoptimized={true}
      />
    )
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={className}
      width={width || 100}
      height={height || 100}
      onError={handleError}
      priority={priority}
      unoptimized={true}
    />
  )
}
