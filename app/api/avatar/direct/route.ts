import { type NextRequest, NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name") // "ujik" or "maretta"

    if (!name) {
      return new NextResponse("Name parameter is required", { status: 400 })
    }

    console.log(`Serving direct avatar for: ${name}`)

    // Try to find the avatar in Vercel Blob
    const { blobs } = await list()

    // Look for the exact filename
    const avatar = blobs.find(
      (blob) =>
        blob.pathname === `avatars/${name}.jpg` ||
        blob.pathname === `avatars/${name}.jpeg` ||
        blob.pathname === `avatars/${name}.png`,
    )

    if (avatar) {
      console.log(`Found avatar at: ${avatar.url}`)

      // Fetch the image from Vercel Blob
      const imageResponse = await fetch(avatar.url)

      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
      }

      const imageBuffer = await imageResponse.arrayBuffer()

      // Determine content type
      let contentType = "image/jpeg"
      if (avatar.pathname.endsWith(".png")) {
        contentType = "image/png"
      } else if (avatar.pathname.endsWith(".gif")) {
        contentType = "image/gif"
      }

      // Return the image directly
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
    } else {
      console.log(`No avatar found for: ${name}`)
    }

    // If no avatar found, return a default image or placeholder
    return NextResponse.redirect(new URL("/placeholder.svg", request.url))
  } catch (error) {
    console.error("Error serving avatar:", error)
    return new NextResponse("Error serving avatar", { status: 500 })
  }
}
