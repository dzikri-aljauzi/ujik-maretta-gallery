"use server"

import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import { addPhoto, deletePhotoFromStore } from "./photos"
import { updatePartnerProfile } from "./profiles"
import type { Photo, Profile } from "./types"
import fs from "fs/promises"
import path from "path"

// Hanya impor @vercel/blob jika di Vercel
const useLocalStorage = process.env.STORAGE_PROVIDER === "local";
const { put: blobPut } = useLocalStorage ? { put: null } : require("@vercel/blob");

// Upload a photo
export async function uploadPhoto(file: File, data: { caption: string; description: string; partner: string }) {
  try {
    let url: string;

    if (useLocalStorage) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = path.join(uploadDir, `${uuidv4()}-${filename}`);

      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      url = `/uploads/${path.basename(filePath)}`;
    } else {
      if (!blobPut) {
        throw new Error("Vercel Blob is not available in this environment");
      }
      const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `photos/${uuidv4()}-${filename}`;
      const blob = await blobPut(uniqueFilename, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: true,
      });
      url = blob.url;
    }

    const photo: Photo = {
      id: uuidv4(),
      url,
      caption: data.caption,
      description: data.description,
      date: new Date().toISOString(),
      partner: data.partner,
    };

    await addPhoto(photo);
    revalidatePath("/");
    revalidatePath(`/profiles/${data.partner}`);

    return { success: true, photo };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return { success: false, error: "Failed to upload photo. Please try again." };
  }
}

// Upload avatar
export async function uploadAvatar(file: File, partnerId: string) {
  try {
    let url: string;

    if (useLocalStorage) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = path.join(uploadDir, `${partnerId}-${uuidv4()}-${filename}`);

      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      url = `/uploads/${path.basename(filePath)}`;
    } else {
      if (!blobPut) {
        throw new Error("Vercel Blob is not available in this environment");
      }
      const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `avatars/${partnerId}-${uuidv4()}-${filename}`;
      const blob = await blobPut(uniqueFilename, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: true,
      });
      url = blob.url;
    }

    await updatePartnerProfile(partnerId, { avatar: url });
    revalidatePath(`/profiles/${partnerId}`);

    return { success: true, url };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { success: false, error: "Failed to upload avatar. Please try again." };
  }
}

// Update profile
export async function updateProfile(partnerId: string, data: Partial<Profile>) {
  try {
    await updatePartnerProfile(partnerId, data);
    revalidatePath(`/profiles/${partnerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}

// Delete a photo
export async function deletePhoto(photoId: string, photoUrl: string) {
  try {
    if (useLocalStorage) {
      const filePath = path.join(process.cwd(), "public", photoUrl.replace("/uploads/", "uploads/"));
      await fs.unlink(filePath).catch(() => {});
    } else {
      // Catatan: Vercel Blob tidak mendukung penghapusan langsung via SDK saat ini
      // Implementasi tambahan diperlukan di backend Vercel
    }
    await deletePhotoFromStore(photoId);
    revalidatePath("/");
    revalidatePath(`/profiles/${(await getPhotos()).find(p => p.id === photoId)?.partner || ""}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting photo:", error);
    return { success: false, error: "Failed to delete photo. Please try again." };
  }
}