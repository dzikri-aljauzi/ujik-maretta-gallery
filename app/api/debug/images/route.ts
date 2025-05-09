import { NextResponse } from "next/server"
import { getPhotos } from "@/lib/photos"
import { getProfiles } from "@/lib/profiles"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    // Get data from our data store
    const photos = await getPhotos()
    const profiles = await getProfiles()

    // Try to list blobs directly from Vercel Blob
    let blobList = []
    try {
      const result = await list()
      blobList = result.blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }))
    } catch (error) {
      console.error("Error listing blobs:", error)
    }

    // Extract image URLs
    const photoUrls = photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      partner: photo.partner,
    }))

    const profileAvatars = Object.entries(profiles).map(([id, profile]) => ({
      id,
      name: profile.name,
      avatarUrl: profile.avatar,
    }))

    return NextResponse.json({
      status: "ok",
      photoCount: photos.length,
      profileCount: Object.keys(profiles).length,
      photoUrls: photoUrls,
      profileAvatars: profileAvatars,
      blobList: blobList,
      blobTokenAvailable: !!process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Debug check failed", details: error.message }, { status: 500 })
  }
}
