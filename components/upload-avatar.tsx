"use client"

import type React from "react"

import { useState } from "react"
<<<<<<< HEAD
import { Upload, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SimpleAvatar } from "./simple-avatar"
=======
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

interface UploadAvatarProps {
  currentUrl: string | null
  onUpload: (url: string) => void
  partnerId: string
}

export function UploadAvatar({ currentUrl, onUpload, partnerId }: UploadAvatarProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
<<<<<<< HEAD
  const [success, setSuccess] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

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
<<<<<<< HEAD
      setSuccess(false)
=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

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

<<<<<<< HEAD
      console.log("Avatar uploaded successfully:", result.url)
      setSuccess(true)
      onUpload(result.url)

      // Force refresh
      setRefreshKey((prev) => prev + 1)

      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
=======
      onUpload(result.url)
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
    } catch (error) {
      console.error("Error uploading avatar:", error)
      setError("Failed to upload avatar. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

<<<<<<< HEAD
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

<<<<<<< HEAD
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">Profile picture updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          <SimpleAvatar partnerId={partnerId} className="absolute inset-0 w-full h-full" key={`avatar-${refreshKey}`} />
        </div>

        <div className="flex flex-col gap-2">
=======
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
          {currentUrl ? (
            <Image src={currentUrl || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFAEBC] to-[#A0E7E5]" />
          )}
        </div>

        <div>
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
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
<<<<<<< HEAD

          <Button type="button" variant="ghost" size="sm" onClick={handleRefresh} className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
        </div>
      </div>
    </div>
  )
}
