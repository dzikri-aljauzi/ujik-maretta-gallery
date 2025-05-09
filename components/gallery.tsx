"use client"

import { useState } from "react"
import type { Photo } from "@/lib/types"
import { PhotoModal } from "./photo-modal"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DirectBlobImage } from "./direct-blob-image"

interface GalleryProps {
  photos: Photo[]
}

export function Gallery({ photos }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Validate photos to ensure they have all required properties
  const validPhotos = photos.filter((photo) => {
    try {
      // Check if photo has all required properties
      if (!photo.id || !photo.url || !photo.caption || !photo.date || !photo.partner) {
        console.warn("Invalid photo data:", photo)
        return false
      }
      return true
    } catch (err) {
      console.error("Error validating photo:", err)
      return false
    }
  })

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {validPhotos.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-60 bg-muted rounded-lg">
            <p className="text-muted-foreground">Foto nya bakal muncul disini</p>
          </div>
        ) : (
          validPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setSelectedPhoto(photo)}
            >
              <DirectBlobImage
                src={photo.url}
                alt={photo.caption || "Gallery photo"}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                className={cn(
                  "absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity",
                  photo.partner === "partner1" ? "from-[#FFAEBC]/80" : "from-[#A0E7E5]/80",
                )}
              >
                <div className="text-white">
                  <p className="font-medium">{photo.caption || "Our moment"}</p>
                  <p className="text-sm opacity-90">
                    {typeof photo.date === "string" ? new Date(photo.date).toLocaleDateString() : "No date"}
                  </p>
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
