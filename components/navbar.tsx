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
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Heart className="h-6 w-6 text-[#FFAEBC]" />
          <span className="hidden font-bold sm:inline-block">Ujik and Maretta</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#FFAEBC]",
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
