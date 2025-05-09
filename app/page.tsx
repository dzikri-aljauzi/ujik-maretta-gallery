<<<<<<< HEAD
import { BlobGallery } from "@/components/blob-gallery"

export default async function Home() {
=======
import { Gallery } from "@/components/gallery"
import { getPhotos } from "@/lib/photos"

export default async function Home() {
  const photos = await getPhotos()

>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#FFAEBC] mb-4">My Kind of Love</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Cerita yang tertulis di setiap jejak yang ditinggalkan oleh Ujik dan Maretta
        </p>
      </div>

<<<<<<< HEAD
      <BlobGallery />
=======
      <Gallery photos={photos} />
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
    </div>
  )
}
