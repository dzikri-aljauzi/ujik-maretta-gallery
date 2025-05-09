import fs from "fs/promises"
import path from "path"
import type { Photo } from "./types"
<<<<<<< HEAD
import { getMemoryPhotos, addMemoryPhoto, setMemoryPhotos, deleteMemoryPhoto } from "./memory-store"
=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

const DATA_PATH = path.join(process.cwd(), "data")
const PHOTOS_FILE = path.join(DATA_PATH, "photos.json")

<<<<<<< HEAD
// Ensure data directory exists
=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
async function ensureDataDir() {
  try {
    await fs.access(DATA_PATH)
  } catch {
<<<<<<< HEAD
    try {
      await fs.mkdir(DATA_PATH, { recursive: true })
      console.log("Created data directory")
    } catch (error) {
      console.error("Failed to create data directory:", error)
      // Continue with in-memory store
    }
  }
}

// Validate and sanitize a photo object
function sanitizePhoto(photo: any): Photo {
  return {
    id: photo?.id || `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    url: photo?.url || "/placeholder.svg",
    caption: photo?.caption || "Untitled",
    description: photo?.description || "",
    date: photo?.date || new Date().toISOString(),
    partner: photo?.partner || "partner1",
  }
}

// Get all photos
export async function getPhotos(): Promise<Photo[]> {
  try {
    await ensureDataDir()

    try {
      const data = await fs.readFile(PHOTOS_FILE, "utf-8")
      const parsedData = JSON.parse(data)

      // Validate that parsedData is an array
      if (!Array.isArray(parsedData)) {
        console.error("Photos data is not an array:", parsedData)
        return getMemoryPhotos()
      }

      // Validate and sanitize photos
      const photos = parsedData.map(sanitizePhoto)

      // Update memory store
      setMemoryPhotos(photos)

      // Log the photos for debugging
      console.log(`Retrieved ${photos.length} photos from file storage`)

      return photos
    } catch (error) {
      console.error("Error reading photos file:", error)

      // If file doesn't exist or can't be read, try to create an empty file
      try {
        await fs.writeFile(PHOTOS_FILE, JSON.stringify([], null, 2))
      } catch (writeError) {
        console.error("Failed to create empty photos file:", writeError)
      }

      // Return from memory store
      return getMemoryPhotos()
    }
  } catch (error) {
    console.error("Error in getPhotos:", error)
    return getMemoryPhotos()
  }
}

// Get photos by partner
export async function getPhotosByPartner(partnerId: string): Promise<Photo[]> {
  try {
    const photos = await getPhotos()
    return photos.filter((photo) => photo.partner === partnerId)
  } catch (error) {
    console.error("Error getting photos by partner:", error)
    return getMemoryPhotos().filter((photo) => photo.partner === partnerId)
  }
}

// Save photos
export async function savePhotos(photos: Photo[]): Promise<void> {
  try {
    await ensureDataDir()

    // Ensure all photos have required fields
    const validatedPhotos = photos.map(sanitizePhoto)

    // Update memory store first
    setMemoryPhotos(validatedPhotos)

    try {
      await fs.writeFile(PHOTOS_FILE, JSON.stringify(validatedPhotos, null, 2))
      console.log(`Saved ${validatedPhotos.length} photos to file storage`)
    } catch (error) {
      console.error("Error writing photos file:", error)
      // Continue with in-memory store
    }
  } catch (error) {
    console.error("Error saving photos:", error)
  }
}

// Add a new photo
export async function addPhoto(photo: Photo): Promise<void> {
  try {
    // Ensure the photo has all required fields
    const validatedPhoto = sanitizePhoto(photo)

    // Add to memory store first
    addMemoryPhoto(validatedPhoto)

    try {
      const photos = await getPhotos()

      // Check for duplicates (same URL)
      const isDuplicate = photos.some((p) => p.url === validatedPhoto.url)
      if (isDuplicate) {
        console.log(`Photo with URL ${validatedPhoto.url} already exists, skipping`)
        return
      }

      photos.unshift(validatedPhoto) // Add to beginning of array
      await savePhotos(photos)
      console.log(`Added new photo: ${validatedPhoto.caption} (${validatedPhoto.url})`)
    } catch (error) {
      console.error("Error adding photo to file:", error)
      // Continue with in-memory store
    }
  } catch (error) {
    console.error("Error adding photo:", error)
  }
}

// Delete a photo
export async function deletePhoto(photoId: string): Promise<void> {
  try {
    // Delete from memory store first
    deleteMemoryPhoto(photoId)

    try {
      const photos = await getPhotos()
      const updatedPhotos = photos.filter((photo) => photo.id !== photoId)
      await savePhotos(updatedPhotos)
      console.log(`Deleted photo with ID: ${photoId}`)
    } catch (error) {
      console.error("Error deleting photo from file:", error)
      // Continue with in-memory store
    }
  } catch (error) {
    console.error("Error deleting photo:", error)
  }
}
=======
    await fs.mkdir(DATA_PATH, { recursive: true })
  }
}

export async function getPhotos(): Promise<Photo[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(PHOTOS_FILE, "utf-8")
    return JSON.parse(data) as Photo[]
  } catch {
    return []
  }
}

export async function getPhotosByPartner(partnerId: string): Promise<Photo[]> {
  const photos = await getPhotos()
  return photos.filter((photo) => photo.partner === partnerId)
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(PHOTOS_FILE, JSON.stringify(photos, null, 2))
}

export async function addPhoto(photo: Photo): Promise<void> {
  const photos = await getPhotos()
  photos.unshift(photo)
  await savePhotos(photos)
}

export async function deletePhotoFromStore(photoId: string): Promise<void> {
  const photos = await getPhotos()
  const updatedPhotos = photos.filter((photo) => photo.id !== photoId)
  await savePhotos(updatedPhotos)
}
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
