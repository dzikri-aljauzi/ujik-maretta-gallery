import { type NextRequest, NextResponse } from "next/server"
import { updatePartnerProfile } from "@/lib/profiles"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { partnerId, profile } = await request.json()

    if (!partnerId || !profile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

<<<<<<< HEAD
    console.log("Updating profile for partner:", partnerId)
    console.log("Profile data:", profile)

=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
    // Update profile
    await updatePartnerProfile(partnerId, profile)

    // Revalidate path
    revalidatePath(`/profiles/${partnerId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
<<<<<<< HEAD
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error.message,
      },
      { status: 500 },
    )
=======
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  }
}
