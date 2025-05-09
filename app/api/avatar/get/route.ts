import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get("partnerId")
    const timestamp = searchParams.get("t") || Date.now()

    if (!partnerId) {
      return NextResponse.json({ error: "Missing partnerId parameter" }, { status: 400 })
    }

    console.log(`Fetching avatar for partner: ${partnerId}`)

    // Determine the expected filename based on partnerId
    const partnerName = partnerId === "partner1" ? "ujik" : "maretta"

    // List all blobs from Vercel Blob storage
    const { blobs } = await list()

    // Find the avatar for this partner
    // First try exact match with the expected filename pattern
    let avatar = blobs.find(
      (blob) =>
        blob.pathname === `avatars/${partnerName}.jpg` ||
        blob.pathname === `avatars/${partnerName}.jpeg` ||
        blob.pathname === `avatars/${partnerName}.png`,
    )

    // If not found, try a more flexible match
    if (!avatar) {
      avatar = blobs.find(
        (blob) => blob.pathname.startsWith(`avatars/${partnerName}`) || blob.pathname.includes(`/${partnerId}-`),
      )
    }

    if (avatar) {
      console.log(`Found avatar for ${partnerId}: ${avatar.url}`)
      // Add timestamp to URL to prevent caching
      const urlWithTimestamp = `${avatar.url}?t=${timestamp}`
      return NextResponse.json({ success: true, url: urlWithTimestamp })
    } else {
      console.log(`No avatar found for ${partnerId}`)
      return NextResponse.json({ success: false, url: null })
    }
  } catch (error) {
    console.error("Error fetching avatar:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch avatar",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
