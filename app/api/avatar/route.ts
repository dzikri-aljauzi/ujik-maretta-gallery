import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { updatePartnerProfile } from "@/lib/profiles"
import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"

// Hanya gunakan Vercel Blob jika di Vercel
const useLocalStorage = process.env.STORAGE_PROVIDER === "local";
const { put: blobPut } = useLocalStorage ? { put: null } : require("@vercel/blob");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const partnerId = formData.get("partnerId") as string

    if (!file || !partnerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

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