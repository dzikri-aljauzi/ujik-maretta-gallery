"use client"

import { useState, useEffect } from "react"
import { DirectBlobImage } from "@/components/direct-blob-image"
import { SimpleAvatar } from "@/components/simple-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BlobTestPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [blobList, setBlobList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testUrl, setTestUrl] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch("/api/debug/images")

        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Debug API response:", data)

        if (data.photoUrls) {
          setPhotos(data.photoUrls)
        }

        if (data.profileAvatars) {
          setProfiles(data.profileAvatars)
        }

        if (data.blobList) {
          setBlobList(data.blobList)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Blob URL Test Page</h1>
      <p className="mb-6">This page tests direct image loading from Vercel Blob URLs.</p>

      <div className="mb-4">
        <Button onClick={handleRefresh} className="mb-4">
          Refresh Data
        </Button>
      </div>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Custom URL</h2>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="test-url">Enter Blob URL to test</Label>
            <Input
              id="test-url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://your-blob-url.vercel-storage.com/..."
              className="mb-2"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={() => setTestUrl("")} variant="outline">
              Clear
            </Button>
          </div>
        </div>

        {testUrl && (
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Test Result:</h3>
            <div className="h-64 relative mb-4">
              <DirectBlobImage
                src={testUrl}
                alt="Test image"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        )}
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && (
        <Tabs defaultValue="profiles">
          <TabsList className="mb-4">
            <TabsTrigger value="profiles">Profiles ({profiles.length})</TabsTrigger>
            <TabsTrigger value="photos">Photos ({photos.length})</TabsTrigger>
            <TabsTrigger value="blobs">All Blobs ({blobList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            <h2 className="text-2xl font-semibold mb-4">Profile Avatars</h2>
            {profiles.length === 0 ? (
              <p>No profile avatars found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profiles.map((profile) => (
                  <div key={profile.id} className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">{profile.name}</h3>
                    <div className="space-y-4">
                      <div className="h-40 w-40 relative overflow-hidden rounded-full mx-auto">
                        <SimpleAvatar
                          partnerId={profile.id}
                          className="w-full h-full"
                          key={`profile-${profile.id}-${refreshKey}`}
                        />
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-xs break-all">
                        <p className="font-semibold">Direct API URL:</p>
                        <p>{`/api/avatar/direct?name=${profile.id === "partner1" ? "ujik" : "maretta"}`}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos">
            <h2 className="text-2xl font-semibold mb-4">Photos from Data Store</h2>
            {photos.length === 0 ? (
              <p>No photos found in data store</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">{photo.caption || photo.id}</h3>
                    <div className="aspect-video relative mb-4">
                      <DirectBlobImage
                        src={photo.url}
                        alt={photo.caption || "Gallery photo"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-xs break-all">
                      <p className="font-semibold">URL:</p>
                      <p>{photo.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blobs">
            <h2 className="text-2xl font-semibold mb-4">All Blobs from Vercel Blob Storage</h2>
            {blobList.length === 0 ? (
              <p>No blobs found in Vercel Blob storage</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blobList.map((blob, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">{blob.pathname}</h3>
                    <div className="aspect-video relative mb-4">
                      <DirectBlobImage
                        src={blob.url}
                        alt={blob.pathname}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-xs break-all">
                      <p className="font-semibold">URL:</p>
                      <p>{blob.url}</p>
                      <p className="font-semibold mt-1">Path:</p>
                      <p>{blob.pathname}</p>
                      <p className="font-semibold mt-1">Uploaded:</p>
                      <p>{new Date(blob.uploadedAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
