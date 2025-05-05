import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { addPhoto } from "@/lib/photos"
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
    const caption = formData.get("caption") as string
    const description = formData.get("description") as string
    const partner = formData.get("partner") as string

    if (!file || !caption || !partner) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

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