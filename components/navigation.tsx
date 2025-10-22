"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Database, LayoutDashboard, Plus } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Analytics Platform</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link href="/datasets">
              <Button variant={pathname?.startsWith("/datasets") ? "default" : "ghost"} size="sm">
                <Database className="mr-2 h-4 w-4" />
                Datasets
              </Button>
            </Link>
            <Link href="/datasets/upload">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
