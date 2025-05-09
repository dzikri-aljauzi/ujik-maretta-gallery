import { notFound } from "next/navigation"
<<<<<<< HEAD
import { getPartnerProfile } from "@/lib/profiles"
import { BlobGallery } from "@/components/blob-gallery"
import { ProfileForm } from "@/components/profile-form"
import { SimpleAvatar } from "@/components/simple-avatar"
=======
import Image from "next/image"
import { getPartnerProfile } from "@/lib/profiles"
import { getPhotosByPartner } from "@/lib/photos"
import { Gallery } from "@/components/gallery"
import { ProfileForm } from "@/components/profile-form"
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

interface ProfilePageProps {
  params: {
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
<<<<<<< HEAD
  const { slug } = params
=======
  const { slug } = await params
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43

  if (slug !== "partner1" && slug !== "partner2") {
    notFound()
  }

<<<<<<< HEAD
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
=======
  try {
    const profile = await getPartnerProfile(slug)
    const photos = await getPhotosByPartner(slug)

    return (
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                {profile.avatar ? (
                  <Image src={profile.avatar || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFAEBC] to-[#A0E7E5]">
                    <span className="text-4xl font-bold text-white">{profile.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.tagline}</p>
              </div>

              <div className="prose prose-sm">
                <p>{profile.bio}</p>
              </div>

              <ProfileForm profile={profile} partnerId={slug} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">{profile.name}'s Photos</h2>
            <Gallery photos={photos} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in profile page:", error)
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground">We're having trouble loading this profile. Please try again later.</p>
      </div>
    )
  }
}
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
