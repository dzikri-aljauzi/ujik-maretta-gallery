import fs from "fs/promises"
import path from "path"
import type { Profile } from "./types"

const DATA_PATH = path.join(process.cwd(), "data")
const PROFILES_FILE = path.join(DATA_PATH, "profiles.json")
const PHOTOS_FILE = path.join(DATA_PATH, "photos.json")

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

export async function initializeData() {
  try {
    // Ensure data directory exists
    try {
      await fs.access(DATA_PATH)
    } catch {
      await fs.mkdir(DATA_PATH, { recursive: true })
      console.log("Created data directory")
    }

    // Ensure profiles file exists
    try {
      await fs.access(PROFILES_FILE)
    } catch {
      await fs.writeFile(PROFILES_FILE, JSON.stringify(defaultProfiles, null, 2))
      console.log("Created profiles file with default data")
    }

    // Ensure photos file exists
    try {
      await fs.access(PHOTOS_FILE)
    } catch {
      await fs.writeFile(PHOTOS_FILE, JSON.stringify([], null, 2))
      console.log("Created empty photos file")
    }

    console.log("Data initialization complete")
  } catch (error) {
    console.error("Error initializing data:", error)
  }
}
