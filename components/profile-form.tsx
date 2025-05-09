"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import type { Profile } from "@/lib/types"
import { UploadAvatar } from "./upload-avatar"

interface ProfileFormProps {
  profile: Profile
  partnerId: string
}

export function ProfileForm({ profile, partnerId }: ProfileFormProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name,
    tagline: profile.tagline,
    bio: profile.bio,
    avatar: profile.avatar,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerId,
          profile: formData,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to update profile")
        return
      }

      setSuccess(true)

      // Wait a moment to show success message before closing edit mode
      setTimeout(() => {
        setIsEditing(false)
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Failed to update profile:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
        Edit Profile
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Picture</Label>
        <UploadAvatar currentUrl={formData.avatar} onUpload={handleAvatarUpload} partnerId={partnerId} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || success}>
          {isLoading ? "Saving..." : success ? "Saved!" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
