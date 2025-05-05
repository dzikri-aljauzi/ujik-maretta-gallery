"use client"

import { useState } from "react"
import Image from "next/image"
import type { Photo } from "@/lib/types"
import { PhotoModal } from "./photo-modal"
import { cn } from "@/lib/utils"

interface GalleryProps {
  photos: Photo[]
}

export function Gallery({ photos }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

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
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.url || "/placeholder.svg"}
                alt={photo.caption || "Gallery photo"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
              <div
                className={cn(
                  "absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity",
                  photo.partner === "partner1" ? "from-[#FFAEBC]/80" : "from-[#A0E7E5]/80",
                )}
              >
                <div className="text-white">
                  <p className="font-medium">{photo.caption || "Our moment"}</p>
                  <p className="text-sm opacity-90">{photo.date}</p>
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
