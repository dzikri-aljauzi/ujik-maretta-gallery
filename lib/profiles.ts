import fs from "fs/promises"
import path from "path"
import type { Profile } from "./types"
<<<<<<< HEAD
import { getMemoryProfile, getMemoryProfiles, updateMemoryProfile } from "./memory-store"
=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

const DATA_PATH = path.join(process.cwd(), "data")
const PROFILES_FILE = path.join(DATA_PATH, "profiles.json")

// Ensure data directory exists
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
=======
    await fs.mkdir(DATA_PATH, { recursive: true })
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  }
}

// Default profiles
const defaultProfiles: Record<string, Profile> = {
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

<<<<<<< HEAD
// Validate and sanitize a profile object
function sanitizeProfile(profile: any, partnerId: string): Profile {
  return {
    id: partnerId,
    name: profile?.name || (partnerId === "partner1" ? "Ujik" : "Maretta"),
    tagline: profile?.tagline || "Photography enthusiast",
    bio: profile?.bio || "I love capturing our special moments together.",
    avatar: profile?.avatar || null,
  }
}

// Get all profiles
export async function getProfiles(): Promise<Record<string, Profile>> {
  try {
    await ensureDataDir()

    try {
      const data = await fs.readFile(PROFILES_FILE, "utf-8")
      const parsedData = JSON.parse(data)

      // Validate that parsedData is an object
      if (typeof parsedData !== "object" || parsedData === null || Array.isArray(parsedData)) {
        console.error("Profiles data is not an object:", parsedData)
        return getMemoryProfiles()
      }

      // Ensure default profiles exist
      const profiles: Record<string, Profile> = { ...defaultProfiles }

      // Add parsed profiles
      for (const [key, value] of Object.entries(parsedData)) {
        profiles[key] = sanitizeProfile(value, key)
      }

      return profiles
    } catch (error) {
      console.error("Error reading profiles file:", error)

      // If file doesn't exist or can't be read, try to create a default file
      try {
        await fs.writeFile(PROFILES_FILE, JSON.stringify(defaultProfiles, null, 2))
      } catch (writeError) {
        console.error("Failed to create default profiles file:", writeError)
      }

      return getMemoryProfiles()
    }
  } catch (error) {
    console.error("Error in getProfiles:", error)
    return getMemoryProfiles()
=======
// Get all profiles
export async function getProfiles(): Promise<Record<string, Profile>> {
  await ensureDataDir()

  try {
    const data = await fs.readFile(PROFILES_FILE, "utf-8")
    return JSON.parse(data) as Record<string, Profile>
  } catch (error) {
    // If file doesn't exist, create it with default profiles
    await saveProfiles(defaultProfiles)
    return defaultProfiles
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  }
}

// Get a specific partner profile
export async function getPartnerProfile(partnerId: string): Promise<Profile> {
  try {
    const profiles = await getProfiles()
<<<<<<< HEAD
    return profiles[partnerId] || defaultProfiles[partnerId] || getMemoryProfile(partnerId)
  } catch (error) {
    console.error("Error getting partner profile:", error)
    return getMemoryProfile(partnerId)
=======
    return profiles[partnerId] || defaultProfiles[partnerId]
  } catch (error) {
    console.error("Error getting partner profile:", error)
    return defaultProfiles[partnerId]
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  }
}

// Save profiles
export async function saveProfiles(profiles: Record<string, Profile>): Promise<void> {
<<<<<<< HEAD
  try {
    await ensureDataDir()

    // Validate profiles
    const validatedProfiles: Record<string, Profile> = {}
    for (const [key, value] of Object.entries(profiles)) {
      validatedProfiles[key] = sanitizeProfile(value, key)
      // Update memory store
      updateMemoryProfile(key, validatedProfiles[key])
    }

    try {
      await fs.writeFile(PROFILES_FILE, JSON.stringify(validatedProfiles, null, 2))
    } catch (error) {
      console.error("Error writing profiles file:", error)
      // Continue with in-memory store
    }
=======
  await ensureDataDir()
  try {
    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2))
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  } catch (error) {
    console.error("Error saving profiles:", error)
  }
}

// Update a profile
export async function updatePartnerProfile(partnerId: string, profile: Partial<Profile>): Promise<void> {
  try {
<<<<<<< HEAD
    // Update memory store first
    updateMemoryProfile(partnerId, profile)

    try {
      const profiles = await getProfiles()

      profiles[partnerId] = {
        ...profiles[partnerId],
        ...profile,
        id: partnerId,
      }

      await saveProfiles(profiles)
    } catch (error) {
      console.error("Error updating profile in file:", error)
      // Continue with in-memory store
    }
=======
    const profiles = await getProfiles()

    profiles[partnerId] = {
      ...profiles[partnerId],
      ...profile,
      id: partnerId,
    }

    await saveProfiles(profiles)
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  } catch (error) {
    console.error("Error updating partner profile:", error)
  }
}
