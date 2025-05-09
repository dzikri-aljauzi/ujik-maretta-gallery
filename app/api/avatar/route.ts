import { type NextRequest, NextResponse } from "next/server"
<<<<<<< HEAD
import { put, del, list } from "@vercel/blob"
import { updatePartnerProfile } from "@/lib/profiles"
import { revalidatePath } from "next/cache"
=======
import { v4 as uuidv4 } from "uuid"
import { updatePartnerProfile } from "@/lib/profiles"
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
    const partnerId = formData.get("partnerId") as string

    if (!file || !partnerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

<<<<<<< HEAD
    console.log("Uploading avatar for partner:", partnerId)
    console.log("File name:", file.name)
    console.log("File type:", file.type)
    console.log("File size:", file.size)

    // Try to find and delete existing avatar
    try {
      const { blobs } = await list()
      const partnerName = partnerId === "partner1" ? "ujik" : "maretta"

      // Find any existing avatar for this partner
      const existingAvatars = blobs.filter(
        (blob) => blob.pathname.startsWith(`avatars/${partnerName}`) || blob.pathname.includes(`/${partnerId}-`),
      )

      // Delete all existing avatars for this partner
      for (const avatar of existingAvatars) {
        console.log(`Deleting existing avatar: ${avatar.pathname}`)
        await del(avatar.url)
      }
    } catch (error) {
      console.error("Error deleting existing avatars:", error)
      // Continue anyway
    }

    // Get file extension
    const fileExt = file.name.split(".").pop() || "jpg"

    // Create consistent filename based on partner ID
    const partnerName = partnerId === "partner1" ? "ujik" : "maretta"
    const filename = `avatars/${partnerName}.${fileExt}`

    // Upload to Vercel Blob with allowOverwrite
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false, // Don't add random suffix to ensure consistent naming
      allowOverwrite: true, // Allow overwriting existing file
    })

    console.log("Avatar uploaded successfully:", blob.url)

    // Update profile
    await updatePartnerProfile(partnerId, {
      avatar: blob.url,
      // Ensure the name is correct based on the partnerId
      name: partnerId === "partner1" ? "Ujik" : "Maretta",
    })

    // Revalidate paths
    revalidatePath(`/profiles/${partnerId}`)
    revalidatePath("/blob-test")
    revalidatePath("/")

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return NextResponse.json(
      {
        error: "Failed to upload avatar",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
=======
    let url: string;
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${partnerId}-${uuidv4()}-${filename}`;

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
      const blob = await blobPut(`avatars/${uniqueFilename}`, file, {
        access: "public",
        contentType: file.type,
      });
      url = blob.url;
    }

    await updatePartnerProfile(partnerId, { avatar: url });
    revalidatePath(`/profiles/${partnerId}`);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
