import { BlobGallery } from "@/components/blob-gallery"

export default async function Home() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#FFAEBC] mb-4">My Kind of Love</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Cerita yang tertulis di setiap jejak yang ditinggalkan oleh Ujik dan Maretta
        </p>
      </div>

      <BlobGallery />
    </div>
  )
}
