import type { Photo, Profile } from "./types"

// In-memory fallback stores
let photosStore: Photo[] = []
const profilesStore: Record<string, Profile> = {
  partner1: {
    id: "partner1",
    name: "Ujik",
    tagline: "Tech Geek",
    bio: "I love capturing our special moments together.",
    avatar: null,
  },
  partner2: {
    id: "partner2",
    name: "Maretta",
    tagline: "Pekerja keras well",
    bio: "Always looking for new experiences to share.",
    avatar: null,
  },
}

// Photos methods
export function getMemoryPhotos(): Photo[] {
  return [...photosStore]
}

export function addMemoryPhoto(photo: Photo): void {
  photosStore.unshift(photo)
}

export function deleteMemoryPhoto(photoId: string): void {
  photosStore = photosStore.filter((photo) => photo.id !== photoId)
}

export function setMemoryPhotos(photos: Photo[]): void {
  photosStore = [...photos]
}

// Profiles methods
export function getMemoryProfile(partnerId: string): Profile {
  return (
    profilesStore[partnerId] || {
      id: partnerId,
      name: partnerId === "partner1" ? "Ujik" : "Maretta",
      tagline: "Photography enthusiast",
      bio: "I love capturing our special moments together.",
      avatar: null,
    }
  )
}

export function updateMemoryProfile(partnerId: string, profile: Partial<Profile>): void {
  profilesStore[partnerId] = {
    ...profilesStore[partnerId],
    ...profile,
    id: partnerId,
  }
}

export function getMemoryProfiles(): Record<string, Profile> {
  return { ...profilesStore }
}
