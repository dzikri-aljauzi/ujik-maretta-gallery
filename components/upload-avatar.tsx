"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadAvatarProps {
  currentUrl: string | null
  onUpload: (url: string) => void
  partnerId: string
}

export function UploadAvatar({ currentUrl, onUpload, partnerId }: UploadAvatarProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed")
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // Create form data for API request
      const formData = new FormData()
      formData.append("file", file)
      formData.append("partnerId", partnerId)

      // Send to API
      const response = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to upload avatar")
        return
      }

      onUpload(result.url)
    } catch (error) {
      console.error("Error uploading avatar:", error)
      setError("Failed to upload avatar. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          {currentUrl ? (
            <Image src={currentUrl || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFAEBC] to-[#A0E7E5]" />
          )}
        </div>

        <div>
          <Button type="button" variant="outline" size="sm" className="relative" disabled={isUploading}>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  )
}
