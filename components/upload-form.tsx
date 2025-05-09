"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export function UploadForm() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    caption: "",
    description: "",
    partner: "partner1",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed")
      return
    }

    setError(null)
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePartnerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, partner: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setError(null)
      setSuccess(false)

      // Create form data for API request
      const apiFormData = new FormData()
      apiFormData.append("file", selectedFile)
      apiFormData.append("caption", formData.caption)
      apiFormData.append("description", formData.description)
      apiFormData.append("partner", formData.partner)

      // Send to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: apiFormData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to upload photo")
        return
      }

      // Show success message
      setSuccess(true)

      // Reset form
      setFormData({
        caption: "",
        description: "",
        partner: "partner1",
      })

      if (preview) {
        URL.revokeObjectURL(preview)
      }
      setSelectedFile(null)
      setPreview(null)

      // Refresh the page to show the new photo
      router.refresh()

      // No redirect to gallery - removed the setTimeout and redirect
    } catch (error) {
      console.error("Error uploading photo:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setSelectedFile(null)
    setPreview(null)
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">Photo uploaded successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="photo">Photo</Label>
        {preview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
            <div className="mb-4 rounded-full bg-[#B4F8C8]/20 p-3">
              <Upload className="h-6 w-6 text-[#B4F8C8]" />
            </div>
            <p className="mb-2 text-sm font-medium">Drag and drop or click to upload</p>
            <p className="text-xs text-muted-foreground mb-4">JPG, PNG or GIF (max. 10MB)</p>
            <Button type="button" variant="outline" className="relative">
              <input
                id="photo"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              Select File
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Input
          id="caption"
          name="caption"
          value={formData.caption}
          onChange={handleChange}
          placeholder="A beautiful sunset..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell us more about this moment..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Who took this photo?</Label>
        <RadioGroup
          value={formData.partner}
          onValueChange={handlePartnerChange}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div
            className={cn(
              "flex items-center space-x-2 rounded-md border p-4 cursor-pointer",
              formData.partner === "partner1" ? "border-[#FFAEBC] bg-[#FFAEBC]/10" : "border-muted",
            )}
          >
            <RadioGroupItem value="partner1" id="partner1" />
            <Label htmlFor="partner1" className="cursor-pointer">
              Ujik
            </Label>
          </div>
          <div
            className={cn(
              "flex items-center space-x-2 rounded-md border p-4 cursor-pointer",
              formData.partner === "partner2" ? "border-[#A0E7E5] bg-[#A0E7E5]/10" : "border-muted",
            )}
          >
            <RadioGroupItem value="partner2" id="partner2" />
            <Label htmlFor="partner2" className="cursor-pointer">
              Maretta
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#B4F8C8] hover:bg-[#B4F8C8]/90 text-black"
        disabled={!selectedFile || isUploading || success}
      >
        {isUploading ? "Uploading..." : success ? "Uploaded!" : "Upload Photo"}
      </Button>
    </form>
  )
}
