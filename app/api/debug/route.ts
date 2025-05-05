import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is available
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    const tokenAvailable = !!blobToken

    // Return status without exposing the actual token
    return NextResponse.json({
      status: "ok",
      blobTokenAvailable: tokenAvailable,
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: "Debug check failed" }, { status: 500 })
  }
}
