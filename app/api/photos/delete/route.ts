import { type NextRequest, NextResponse } from "next/server"
import { getPhotos, savePhotos } from "@/lib/photos"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"

// Hanya gunakan Vercel Blob jika di Vercel
const useLocalStorage = process.env.STORAGE_PROVIDER === "local";
const { del: blobDel } = useLocalStorage ? { del: null } : require("@vercel/blob");

export async function POST(request: NextRequest) {
  try {
    const { photoId, url } = await request.json()

    if (!photoId) {
      return NextResponse.json({ error: "Missing photo ID" }, { status: 400 })
    }

    // Get all photos
    const photos = await getPhotos()

    // Find the photo to delete
    const photoToDelete = photos.find((photo) => photo.id === photoId)

    if (!photoToDelete) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    // Get the partner ID for revalidation
    const partnerId = photoToDelete.partner

    // Remove the photo from the array
    const updatedPhotos = photos.filter((photo) => photo.id !== photoId)

    // Save the updated photos array
    await savePhotos(updatedPhotos)

    // Delete the file if URL is provided
    if (url) {
      if (useLocalStorage) {
        const filePath = path.join(process.cwd(), "public", url.replace("/uploads/", "uploads/"));
        await fs.unlink(filePath).catch(() => {});
      } else {
        if (!blobDel) {
          throw new Error("Vercel Blob is not available in this environment");
        }
        try {
          await blobDel(url);
        } catch (blobError) {
          console.error("Error deleting blob:", blobError);
          // Continue even if blob deletion fails
        }
      }
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath(`/profiles/${partnerId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}