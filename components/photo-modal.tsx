"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Trash2 } from "lucide-react"
import type { Photo } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PhotoModalProps {
  photo: Photo
  onClose: () => void
}

export function PhotoModal({ photo, onClose }: PhotoModalProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetch("/api/photos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoId: photo.id,
          url: photo.url,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to delete photo")
        setShowDeleteConfirm(false)
        return
      }

      // Close the modal and refresh the page
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Error deleting photo:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
        <div className="relative max-w-4xl w-full h-[90vh] m-4" onClick={(e) => e.stopPropagation()}>
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Delete</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="h-full flex flex-col md:flex-row bg-background rounded-lg overflow-hidden">
            {error && (
              <Alert variant="destructive" className="absolute top-16 left-4 right-4 z-10">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="relative flex-1 min-h-[300px]">
              <Image
                src={photo.url || "/placeholder.svg"}
                alt={photo.caption || "Gallery photo"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="w-full md:w-80 p-4 border-t md:border-l md:border-t-0">
              <h3 className="text-xl font-semibold mb-2">{photo.caption || "Our moment"}</h3>
              <p className="text-sm text-muted-foreground mb-4">{formatDate(photo.date)}</p>

              <div className="mb-4">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-10"
                  style={{
                    backgroundColor: photo.partner === "partner1" ? "#FFAEBC" : "#A0E7E5",
                    color: photo.partner === "partner1" ? "#FFAEBC" : "#A0E7E5",
                  }}
                >
                  {photo.partner === "partner1" ? "Ujik" : "Maretta"}
                </span>
              </div>

              {photo.description && <p className="text-sm">{photo.description}</p>}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the photo from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
