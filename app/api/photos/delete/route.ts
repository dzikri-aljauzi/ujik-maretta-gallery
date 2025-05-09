import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { deletePhoto } from "@/lib/photos"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { photoId, url, partner } = await request.json()

    if (!photoId) {
      return NextResponse.json({ error: "Missing photo ID" }, { status: 400 })
    }

    // Delete the photo from our data store
    await deletePhoto(photoId)

    // Try to delete the file from Vercel Blob if URL is provided
    if (url) {
      try {
        await del(url)
      } catch (blobError) {
        console.error("Error deleting blob:", blobError)
        // Continue even if blob deletion fails
      }
    }

    // Revalidate paths
    revalidatePath("/")
    if (partner) {
      revalidatePath(`/profiles/${partner}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
