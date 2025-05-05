export interface Photo {
  id: string
  url: string
  caption: string
  description?: string
  date: string
  partner: string
}

export interface Profile {
  id: string
  name: string
  tagline: string
  bio: string
  avatar: string | null
}
