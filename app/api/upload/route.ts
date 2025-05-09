import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const caption = formData.get("caption") as string
    const description = formData.get("description") as string
    const partner = formData.get("partner") as string

    if (!file || !caption || !partner) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Uploading photo with caption:", caption)
    console.log("File name:", file.name)
    console.log("File type:", file.type)
    console.log("File size:", file.size)
    console.log("Partner:", partner)
    console.log("Description:", description)

    // Generate a safe filename that includes the partner and caption
    const safeCaption = caption.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50)
    const partnerPrefix = partner === "partner1" ? "ujik" : "maretta"

    // Use just the partner prefix and caption without UUID in the filename
    const uniqueFilename = `photos/${partnerPrefix}-${safeCaption}.${file.name.split(".").pop() || "jpg"}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
      contentType: file.type,
    })

    console.log("Blob uploaded successfully:", blob.url)

    // Save description if provided
    if (description) {
      try {
        const descResponse = await fetch("/api/photos/descriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: blob.url,
            description,
          }),
        })

        if (!descResponse.ok) {
          console.error("Failed to save description:", await descResponse.text())
        } else {
          console.log("Description saved successfully")
        }
      } catch (error) {
        console.error("Error saving description:", error)
      }
    }

    // Revalidate paths
    revalidatePath("/")
    revalidatePath(`/profiles/${partner}`)
    revalidatePath("/blob-test")

    return NextResponse.json({
      success: true,
      photo: {
        id: uuidv4(),
        url: blob.url,
        caption: caption || "Untitled",
        description: description || "",
        date: new Date().toISOString(),
        partner: partner || "partner1",
      },
    })
  } catch (error) {
    console.error("Error uploading photo:", error)
    return NextResponse.json(
      {
        error: "Failed to upload photo",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
