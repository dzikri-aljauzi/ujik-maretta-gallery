import { NextResponse } from "next/server"
import { getPhotos } from "@/lib/photos"
import { getProfiles } from "@/lib/profiles"
import { getMemoryPhotos, getMemoryProfiles } from "@/lib/memory-store"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const DATA_PATH = path.join(process.cwd(), "data")
    const PHOTOS_FILE = path.join(DATA_PATH, "photos.json")
    const PROFILES_FILE = path.join(DATA_PATH, "profiles.json")

    // Check if data directory exists
    let dataDirectoryExists = false
    try {
      await fs.access(DATA_PATH)
      dataDirectoryExists = true
    } catch (error) {
      console.error("Data directory does not exist:", error)
    }

    // Check if files exist
    let photosFileExists = false
    let profilesFileExists = false
    if (dataDirectoryExists) {
      try {
        await fs.access(PHOTOS_FILE)
        photosFileExists = true
      } catch (error) {
        console.error("Photos file does not exist:", error)
      }

      try {
        await fs.access(PROFILES_FILE)
        profilesFileExists = true
      } catch (error) {
        console.error("Profiles file does not exist:", error)
      }
    }

    // Get data from files
    let photosFromFile = []
    let profilesFromFile = {}
    if (photosFileExists) {
      try {
        const data = await fs.readFile(PHOTOS_FILE, "utf-8")
        photosFromFile = JSON.parse(data)
      } catch (error) {
        console.error("Error reading photos file:", error)
      }
    }

    if (profilesFileExists) {
      try {
        const data = await fs.readFile(PROFILES_FILE, "utf-8")
        profilesFromFile = JSON.parse(data)
      } catch (error) {
        console.error("Error reading profiles file:", error)
      }
    }

    // Get data from memory store
    const photosFromMemory = getMemoryPhotos()
    const profilesFromMemory = getMemoryProfiles()

    // Get data from functions
    const photosFromFunction = await getPhotos()
    const profilesFromFunction = await getProfiles()

    return NextResponse.json({
      status: "ok",
      filesystem: {
        dataDirectoryExists,
        photosFileExists,
        profilesFileExists,
      },
      data: {
        photosFromFile: photosFromFile.length,
        profilesFromFile: Object.keys(profilesFromFile).length,
        photosFromMemory: photosFromMemory.length,
        profilesFromMemory: Object.keys(profilesFromMemory).length,
        photosFromFunction: photosFromFunction.length,
        profilesFromFunction: Object.keys(profilesFromFunction).length,
      },
      environment: process.env.NODE_ENV,
      blobTokenAvailable: !!process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Debug check failed", details: error.message }, { status: 500 })
  }
}
