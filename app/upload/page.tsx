import { UploadForm } from "@/components/upload-form"

export default function UploadPage() {
  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#A0E7E5] mb-4">Upload a Photo</h1>
        <p className="text-muted-foreground">Cerita tentang Kita.</p>
      </div>

      <UploadForm />
    </div>
  )
}
