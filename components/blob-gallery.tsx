"use client"

import { useState, useEffect } from "react"
import { PhotoModal } from "./photo-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { Photo } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BlobGalleryProps {
  partnerId?: string // Optional - if provided, only show photos from this partner
}

export function BlobGallery({ partnerId }: BlobGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true)
        // If partnerId is provided, add it as a query parameter
        const url = partnerId ? `/api/photos/list?partnerId=${partnerId}` : "/api/photos/list"

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Fetched photos from Blob storage:", data)

        if (data.photos && Array.isArray(data.photos)) {
          setPhotos(data.photos)
        } else {
          setPhotos([])
        }
      } catch (err) {
        console.error("Error fetching photos:", err)
        setError(err.message || "Failed to load photos")
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [partnerId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFAEBC]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Clean up caption by removing UUID or numbers at the end
  const cleanCaption = (caption: string) => {
    return caption.replace(/-?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "")
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-60 bg-muted rounded-lg">
            <p className="text-muted-foreground">Foto nya bakal muncul disini</p>
          </div>
        ) : (
          photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Image with center focus for preview */}
              <img
                src={photo.url || "/placeholder.svg"}
                alt={cleanCaption(photo.caption) || "Gallery photo"}
                className="absolute w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />

              <div
                className={cn(
                  "absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity",
                  photo.partner === "partner1" ? "hover:from-[#B4F8C8]/80" : "hover:from-[#FFAEBC]/80",
                )}
              >
                <div className="text-white">
                  <p className="font-medium">{cleanCaption(photo.caption) || "Our moment"}</p>
                  <p className="text-sm opacity-90">{photo.partner === "partner1" ? "Ujik" : "Maretta"}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </>
  )
}
