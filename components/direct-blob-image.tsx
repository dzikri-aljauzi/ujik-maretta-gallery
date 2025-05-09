"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface DirectBlobImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

export function DirectBlobImage({ src, alt, className = "", style = {} }: DirectBlobImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [error, setError] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    // Log the image URL we're trying to load
    console.log("DirectBlobImage trying to load:", src)

    // Add timestamp to URL if it doesn't already have one
    let urlWithTimestamp = src
    if (!urlWithTimestamp.includes("?t=")) {
      urlWithTimestamp = `${src}${src.includes("?") ? "&" : "?"}t=${Date.now()}`
    }

    // Reset state when src changes
    setImgSrc(urlWithTimestamp)
    setError(false)
    setLoaded(false)
  }, [src])

  return (
    <div className="relative" style={{ position: "relative", ...style }}>
      {/* Regular img tag */}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${error ? "opacity-0" : ""}`}
        onError={(e) => {
          console.error("Failed to load image:", imgSrc)
          setError(true)
          // Try with a different URL format
          if (imgSrc.includes("public.blob.vercel-storage")) {
            const newSrc = imgSrc.replace("public.blob.vercel-storage", "blob.vercel-storage")
            console.log("Trying alternative URL format:", newSrc)
            setImgSrc(newSrc)
          }
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", imgSrc)
          setLoaded(true)
          setError(false)
        }}
      />

      {/* Show placeholder if error */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 p-2">
          <p className="text-sm text-red-500 mb-2">Error loading image</p>
          <div className="text-xs overflow-auto max-h-20 w-full">
            <code className="break-all">{imgSrc}</code>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFAEBC]"></div>
        </div>
      )}
    </div>
  )
}
