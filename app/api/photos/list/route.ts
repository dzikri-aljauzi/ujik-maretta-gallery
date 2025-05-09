import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import type { Photo } from "@/lib/types"

export async function GET(request: Request) {
  try {
    console.log("Fetching photos from Blob storage")

    // Get partnerId from query parameters if provided
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get("partnerId")

    // List all blobs from Vercel Blob storage
    const { blobs } = await list()

    // Filter for only photo files (in the photos/ directory)
    const photoBlobs = blobs.filter(
      (blob) =>
        blob.pathname.startsWith("photos/") &&
        (blob.pathname.endsWith(".jpg") ||
          blob.pathname.endsWith(".jpeg") ||
          blob.pathname.endsWith(".png") ||
          blob.pathname.endsWith(".gif")),
    )

    console.log(`Found ${photoBlobs.length} photos in Blob storage`)

    // Try to get descriptions from memory or API
    let descriptions = {}
    try {
      // First check if we have descriptions in memory
      const response = await fetch("/api/photos/descriptions")
      if (response.ok) {
        const data = await response.json()
        descriptions = data.descriptions || {}
      }
    } catch (error) {
      console.error("Error fetching descriptions:", error)
      // Continue with empty descriptions
    }

    // Convert blobs to Photo objects
    const photos: Photo[] = photoBlobs.map((blob) => {
      // Extract a caption from the filename
      const filename = blob.pathname.split("/").pop() || "Untitled"

      // Try to determine partner from filename
      let partner = "partner1" // Default to Ujik
      if (filename.toLowerCase().includes("maretta") || filename.includes("partner2")) {
        partner = "partner2"
      }

      // Extract caption from filename
      // Format is typically: partnername-caption-uuid.ext
      let caption = "Untitled"

      if (filename.startsWith("ujik-") || filename.startsWith("maretta-")) {
        // Extract the caption part between the partner prefix and the UUID
        const parts = filename.split("-")
        if (parts.length >= 2) {
          // Remove partner prefix
          parts.shift()

          // Join the remaining parts except the last one (which might be the UUID)
          // but only remove the last part if it looks like a UUID
          if (parts.length > 1 && parts[parts.length - 1].match(/^[0-9a-f]{8}[0-9a-f-]{27}$/)) {
            parts.pop()
          }

          caption = parts.join(" ").replace(/_/g, " ")
        }
      } else {
        // For older files or files without the partner prefix
        caption = filename
          .replace(/^[0-9a-f-]+-/, "") // Remove UUID prefix if present
          .replace(/\.[^/.]+$/, "") // Remove file extension
          .replace(/_/g, " ") // Replace underscores with spaces
      }

      // Get description from metadata if available
      const description = descriptions[blob.url] || ""

      return {
        id: uuidv4(),
        url: blob.url,
        caption: caption,
        description: description,
        date: blob.uploadedAt || new Date().toISOString(),
        partner: partner,
      }
    })

    // Filter by partner if requested
    let filteredPhotos = photos
    if (partnerId) {
      filteredPhotos = photos.filter((photo) => photo.partner === partnerId)
      console.log(`Filtered to ${filteredPhotos.length} photos for partner ${partnerId}`)
    }

    return NextResponse.json({ success: true, photos: filteredPhotos })
  } catch (error) {
    console.error("Error listing photos from Blob storage:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list photos",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
