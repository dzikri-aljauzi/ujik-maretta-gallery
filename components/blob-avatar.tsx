"use client"

import { useState, useEffect } from "react"
import { DirectBlobImage } from "./direct-blob-image"

interface BlobAvatarProps {
  partnerId: string
  className?: string
}

export function BlobAvatar({ partnerId, className = "" }: BlobAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    async function fetchAvatar() {
      try {
        setLoading(true)
        // Add a timestamp to prevent caching
        const response = await fetch(`/api/avatar/get?partnerId=${partnerId}&t=${Date.now()}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch avatar: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Fetched avatar:", data)

        if (data.url) {
          // Add a timestamp to the URL to prevent caching
          const urlWithTimestamp = `${data.url}?t=${Date.now()}`
          setAvatarUrl(urlWithTimestamp)
        } else {
          setAvatarUrl(null)
        }
      } catch (err) {
        console.error("Error fetching avatar:", err)
        setError(err.message || "Failed to load avatar")
      } finally {
        setLoading(false)
      }
    }

    fetchAvatar()

    // Update timestamp every 2 seconds to force refresh
    const interval = setInterval(() => {
      setTimestamp(Date.now())
    }, 2000)

    return () => clearInterval(interval)
  }, [partnerId, timestamp])

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFAEBC]"></div>
      </div>
    )
  }

  if (error || !avatarUrl) {
    // Show default avatar with first letter of partner name
    const partnerName = partnerId === "partner1" ? "Ujik" : "Maretta"
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-[#FFAEBC] to-[#A0E7E5]`}>
        <span className="text-4xl font-bold text-white">{partnerName.charAt(0)}</span>
      </div>
    )
  }

  return <DirectBlobImage src={avatarUrl} alt="Profile avatar" className={className} style={{ objectFit: "cover" }} />
}
