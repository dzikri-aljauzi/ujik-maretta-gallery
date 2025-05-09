import { type NextRequest, NextResponse } from "next/server"
<<<<<<< HEAD
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
=======
import { v4 as uuidv4 } from "uuid"
import { addPhoto } from "@/lib/photos"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"

// Hanya gunakan Vercel Blob jika di Vercel
const useLocalStorage = process.env.STORAGE_PROVIDER === "local";
const { put: blobPut } = useLocalStorage ? { put: null } : require("@vercel/blob");
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

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

<<<<<<< HEAD
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
=======
    let url: string;
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${uuidv4()}-${filename}`;

    if (useLocalStorage) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueFilename);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      url = `/uploads/${uniqueFilename}`;
    } else {
      if (!blobPut) {
        throw new Error("Vercel Blob is not available in this environment");
      }
      const blob = await blobPut(`photos/${uniqueFilename}`, file, {
        access: "public",
        contentType: file.type,
      });
      url = blob.url;
    }

    const photo = {
      id: uuidv4(),
      url,
      caption,
      description: description || "",
      date: new Date().toISOString(),
      partner,
    };

    await addPhoto(photo);
    revalidatePath("/");
    revalidatePath(`/profiles/${partner}`);

    return NextResponse.json({ success: true, photo });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
