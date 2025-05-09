import { notFound } from "next/navigation"
import { getPartnerProfile } from "@/lib/profiles"
import { BlobGallery } from "@/components/blob-gallery"
import { ProfileForm } from "@/components/profile-form"
import { SimpleAvatar } from "@/components/simple-avatar"

interface ProfilePageProps {
  params: {
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = params

  if (slug !== "partner1" && slug !== "partner2") {
    notFound()
  }

  let profile = null

  try {
    profile = await getPartnerProfile(slug)
  } catch (err) {
    console.error("Error in Profile page:", err)
  }

  // If we couldn't load the profile, use a default one
  if (!profile) {
    profile = {
      id: slug,
      name: slug === "partner1" ? "Ujik" : "Maretta",
      tagline: "Photography enthusiast",
      bio: "I love capturing our special moments together.",
      avatar: null,
    }
  }

  // Ensure the name is correct based on the slug
  const displayName = slug === "partner1" ? "Ujik" : "Maretta"

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div>
          <div className="sticky top-24 space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <SimpleAvatar partnerId={slug} className="absolute inset-0 w-full h-full" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-muted-foreground">{profile.tagline}</p>
            </div>

            <div className="prose prose-sm">
              <p>{profile.bio}</p>
            </div>

            <ProfileForm profile={{ ...profile, name: displayName }} partnerId={slug} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">{displayName}'s Photos</h2>
          {/* Pass the partnerId to only show photos from this partner */}
          <BlobGallery partnerId={slug} />
        </div>
      </div>
    </div>
  )
}
