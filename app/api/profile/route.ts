import { type NextRequest, NextResponse } from "next/server"
import { updatePartnerProfile } from "@/lib/profiles"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { partnerId, profile } = await request.json()

    if (!partnerId || !profile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Updating profile for partner:", partnerId)
    console.log("Profile data:", profile)

    // Update profile
    await updatePartnerProfile(partnerId, profile)

    // Revalidate path
    revalidatePath(`/profiles/${partnerId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
