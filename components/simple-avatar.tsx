"use client"

import { useState, useEffect } from "react"

interface SimpleAvatarProps {
  partnerId: string
  className?: string
}

export function SimpleAvatar({ partnerId, className = "" }: SimpleAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Create a direct URL to the avatar based on partnerId
    const partnerName = partnerId === "partner1" ? "ujik" : "maretta"

    // Use the provided Vercel URL or fallback to relative path
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : ""

    const directUrl = `${baseUrl}/api/avatar/direct?name=${partnerName}&t=${Date.now()}`

    setAvatarUrl(directUrl)
    setLoading(false)
  }, [partnerId])

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

  return (
    <div className={`${className} relative overflow-hidden`}>
      <img
        src={avatarUrl || "/placeholder.svg"}
        alt={partnerId === "partner1" ? "Ujik's avatar" : "Maretta's avatar"}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
}
