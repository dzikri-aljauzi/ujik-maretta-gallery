import fs from "fs/promises"
import path from "path"
import type { Profile } from "./types"

const DATA_PATH = path.join(process.cwd(), "data")
const PROFILES_FILE = path.join(DATA_PATH, "profiles.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_PATH)
  } catch {
    await fs.mkdir(DATA_PATH, { recursive: true })
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
  }
}

// Get a specific partner profile
export async function getPartnerProfile(partnerId: string): Promise<Profile> {
  try {
    const profiles = await getProfiles()
    return profiles[partnerId] || defaultProfiles[partnerId]
  } catch (error) {
    console.error("Error getting partner profile:", error)
    return defaultProfiles[partnerId]
  }
}

// Save profiles
export async function saveProfiles(profiles: Record<string, Profile>): Promise<void> {
  await ensureDataDir()
  try {
    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2))
  } catch (error) {
    console.error("Error saving profiles:", error)
  }
}

// Update a profile
export async function updatePartnerProfile(partnerId: string, profile: Partial<Profile>): Promise<void> {
  try {
    const profiles = await getProfiles()

    profiles[partnerId] = {
      ...profiles[partnerId],
      ...profile,
      id: partnerId,
    }

    await saveProfiles(profiles)
  } catch (error) {
    console.error("Error updating partner profile:", error)
  }
}
