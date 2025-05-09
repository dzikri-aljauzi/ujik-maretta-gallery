import { SimpleAvatar } from "@/components/simple-avatar"

export default function AvatarTestPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Avatar Test Page</h1>
      <p className="mb-6">This page tests the direct avatar loading.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Ujik's Avatar</h2>
          <div className="h-64 w-64 mx-auto overflow-hidden rounded-full">
            <SimpleAvatar partnerId="partner1" className="w-full h-full" />
          </div>
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <p className="text-sm font-medium">Direct URL:</p>
            <p className="text-xs break-all">/api/avatar/direct?name=ujik</p>
          </div>
        </div>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Maretta's Avatar</h2>
          <div className="h-64 w-64 mx-auto overflow-hidden rounded-full">
            <SimpleAvatar partnerId="partner2" className="w-full h-full" />
          </div>
          <div className="mt-4 p-2 bg-gray-50 rounded">
            <p className="text-sm font-medium">Direct URL:</p>
            <p className="text-xs break-all">/api/avatar/direct?name=maretta</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <p className="mb-2">NEXT_PUBLIC_VERCEL_URL: {process.env.NEXT_PUBLIC_VERCEL_URL || "Not set"}</p>
        <p className="text-sm text-gray-600">
          If you're seeing "Not set", make sure to add the NEXT_PUBLIC_VERCEL_URL environment variable.
        </p>
      </div>
    </div>
  )
}
