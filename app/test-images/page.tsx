import { getPhotos } from "@/lib/photos"
import { getProfiles } from "@/lib/profiles"
import Image from "next/image"

export default async function TestImagesPage() {
  const photos = await getPhotos()
  const profiles = await getProfiles()

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Test Images</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Profile Avatars</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(profiles).map(([id, profile]) => (
              <div key={id} className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">{profile.name}</h3>
                {profile.avatar ? (
                  <div className="space-y-4">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={profile.avatar || "/placeholder.svg"}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs break-all">{profile.avatar}</p>
                  </div>
                ) : (
                  <p>No avatar</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Photos ({photos.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">{photo.caption}</h3>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-2">
                  <Image
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.caption}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="text-xs break-all">{photo.url}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
