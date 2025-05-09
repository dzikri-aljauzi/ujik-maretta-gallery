import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

// In-memory fallback
let descriptionsCache = {}

export async function GET() {
  try {
    // Try to read from memory first
    if (Object.keys(descriptionsCache).length > 0) {
      return NextResponse.json({ success: true, descriptions: descriptionsCache })
    }

    // Try to read from file
    try {
      const dataDir = path.join(process.cwd(), "data")
      const filePath = path.join(dataDir, "descriptions.json")

      // Check if file exists before trying to read it
      try {
        await fs.access(filePath)
      } catch (error) {
        // File doesn't exist, return empty object
        console.log("Descriptions file doesn't exist yet, returning empty object")
        return NextResponse.json({ success: true, descriptions: {} })
      }

      const data = await fs.readFile(filePath, "utf-8")
      const descriptions = JSON.parse(data)

      // Update cache
      descriptionsCache = descriptions

      return NextResponse.json({ success: true, descriptions })
    } catch (error) {
      console.error("Error reading descriptions file:", error)
      return NextResponse.json({ success: true, descriptions: {} })
    }
  } catch (error) {
    console.error("Error getting descriptions:", error)
    return NextResponse.json({ success: true, descriptions: {} }) // Return empty object instead of error
  }
}

export async function POST(request: Request) {
  try {
    const { url, description } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 })
    }

    // Update in-memory cache
    descriptionsCache[url] = description || ""

    // Try to save to file
    try {
      const dataDir = path.join(process.cwd(), "data")
      const filePath = path.join(dataDir, "descriptions.json")

      // Ensure directory exists
      try {
        await fs.mkdir(dataDir, { recursive: true })
      } catch (error) {
        console.error("Error creating data directory:", error)
      }

      // Read existing data if available
      let descriptions = {}
      try {
        const data = await fs.readFile(filePath, "utf-8")
        descriptions = JSON.parse(data)
      } catch (error) {
        // File doesn't exist or can't be read, use empty object
        console.log("Couldn't read existing descriptions file, creating new one")
      }

      // Update with new description
      descriptions[url] = description || ""

      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(descriptions, null, 2))
      console.log("Saved description to file for URL:", url)
    } catch (error) {
      console.error("Error saving description to file:", error)
      // Continue with in-memory cache
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving description:", error)
    return NextResponse.json({ success: false, error: "Failed to save description" }, { status: 500 })
  }
}
