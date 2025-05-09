"use server"

import { revalidatePath } from "next/cache"
import { put, del } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import { addPhoto } from "./photos"
import { updatePartnerProfile, getPartnerProfile } from "./profiles"
import type { Photo, Profile } from "./types"

// Upload a photo
export async function uploadPhoto(file: File, data: { caption: string; description: string; partner: string }) {
  try {
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
      caption: data.caption,
      description: data.description,
      date: new Date().toISOString(),
      partner: data.partner,
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
  }
}

// Update profile
export async function updateProfile(partnerId: string, data: Partial<Profile>) {
  try {
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
