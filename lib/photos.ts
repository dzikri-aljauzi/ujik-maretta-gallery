import fs from "fs/promises"
import path from "path"
import type { Photo } from "./types"

const DATA_PATH = path.join(process.cwd(), "data")
const PHOTOS_FILE = path.join(DATA_PATH, "photos.json")

async function ensureDataDir() {
  try {
    await fs.access(DATA_PATH)
  } catch {
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