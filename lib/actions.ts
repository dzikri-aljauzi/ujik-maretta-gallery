"use server"

import { revalidatePath } from "next/cache"
<<<<<<< HEAD
import { put, del } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import { addPhoto } from "./photos"
import { updatePartnerProfile, getPartnerProfile } from "./profiles"
import type { Photo, Profile } from "./types"
=======
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
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

// Upload a photo
export async function uploadPhoto(file: File, data: { caption: string; description: string; partner: string }) {
  try {
<<<<<<< HEAD
    // Generate a safe filename
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const uniqueFilename = `photos/${uuidv4()}-${filename}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
    })

    console.log("Photo uploaded to Blob:", blob.url)

    // Create photo object
    const photo: Photo = {
      id: uuidv4(),
      url: blob.url,
=======
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
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
      caption: data.caption,
      description: data.description,
      date: new Date().toISOString(),
      partner: data.partner,
<<<<<<< HEAD
    }

    // Save to our data store
    await addPhoto(photo)

    // Revalidate paths
    revalidatePath("/")
    revalidatePath(`/profiles/${data.partner}`)
    revalidatePath("/blob-test")

    return { success: true, photo }
  } catch (error) {
    console.error("Error uploading photo:", error)
    return { success: false, error: "Failed to upload photo. Please try again." }
  }
}

// Upload avatar with consistent naming
export async function uploadAvatar(file: File, partnerId: string) {
  try {
    // Get current profile to check if there's an existing avatar
    const profile = await getPartnerProfile(partnerId)

    // Delete the old avatar if it exists
    if (profile.avatar) {
      try {
        console.log("Attempting to delete old avatar:", profile.avatar)
        await del(profile.avatar)
        console.log("Successfully deleted old avatar")
      } catch (error) {
        console.error("Error deleting old avatar (continuing anyway):", error)
      }
    }

    // Get file extension
    const fileExt = file.name.split(".").pop() || "jpg"

    // Create consistent filename based on partner ID
    const partnerName = partnerId === "partner1" ? "ujik" : "maretta"
    const filename = `avatars/${partnerName}.${fileExt}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false, // Don't add random suffix to ensure consistent naming
    })

    console.log("Avatar uploaded to Blob:", blob.url)

    // Update profile
    await updatePartnerProfile(partnerId, {
      avatar: blob.url,
    })

    // Revalidate path
    revalidatePath(`/profiles/${partnerId}`)
    revalidatePath("/blob-test")

    return blob.url
  } catch (error) {
    console.error("Error uploading avatar:", error)
    throw new Error("Failed to upload avatar. Please try again.")
=======
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
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  }
}

// Update profile
export async function updateProfile(partnerId: string, data: Partial<Profile>) {
  try {
<<<<<<< HEAD
    await updatePartnerProfile(partnerId, data)

    // Revalidate path
    revalidatePath(`/profiles/${partnerId}`)
    revalidatePath("/blob-test")

    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile. Please try again." }
  }
}
=======
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
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
