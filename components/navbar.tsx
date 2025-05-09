"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Gallery", href: "/" },
    { name: "Ujik", href: "/profiles/partner1" },
    { name: "Maretta", href: "/profiles/partner2" },
    { name: "Upload", href: "/upload" },
<<<<<<< HEAD
    { name: "Blob Test", href: "/blob-test" },
    { name: "Avatar Test", href: "/avatar-test" },
=======
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Heart className="h-6 w-6 text-[#FFAEBC]" />
          <span className="hidden font-bold sm:inline-block">Ujik and Maretta</span>
        </Link>
<<<<<<< HEAD
        <nav className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto">
=======
        <nav className="flex items-center space-x-4 lg:space-x-6">
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
<<<<<<< HEAD
                "text-sm font-medium transition-colors hover:text-[#FFAEBC] whitespace-nowrap",
=======
                "text-sm font-medium transition-colors hover:text-[#FFAEBC]",
>>>>>>> ae1986620f1c5749f48bd7bb9f397a2e20fa6f43
                pathname === item.href ? "text-[#FFAEBC]" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
