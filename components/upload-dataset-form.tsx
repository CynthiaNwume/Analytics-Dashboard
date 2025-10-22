"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, LinkIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UploadDatasetForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [source, setSource] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!file) {
        alert("Please select a file")
        return
      }

      console.log("[v0] Reading CSV file...")
      // Read CSV file
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())

      // Parse CSV data
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          const value = values[index]
          // Try to parse as number
          row[header] = isNaN(Number(value)) ? value : Number(value)
        })
        return row
      })

      console.log("[v0] Parsed", rows.length, "rows")

      // Upload to database
      const response = await fetch("/api/datasets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          source: source || "CSV Upload",
          sourceUrl,
          data: rows,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] Upload failed:", errorData)

        // Show helpful error message
        if (errorData.error?.includes("relation") || errorData.error?.includes("does not exist")) {
          alert(
            "Database tables not found. Please run the SQL setup script first:\n\n" +
              "1. Go to https://supabase.com and log in\n" +
              "2. Open your project\n" +
              "3. Go to SQL Editor\n" +
              "4. Run the script from scripts/001_create_flexible_schema.sql",
          )
        } else {
          alert(`Failed to upload dataset: ${errorData.error || "Unknown error"}`)
        }
        return
      }

      const result = await response.json()
      console.log("[v0] Upload successful, redirecting to dashboard...")
      router.push(`/dashboard/${result.datasetId}`)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert(`Failed to upload dataset: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Fetching data from URL:", sourceUrl)
      // Fetch data from URL
      const response = await fetch(sourceUrl)
      const text = await response.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())

      // Parse CSV data
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          const value = values[index]
          row[header] = isNaN(Number(value)) ? value : Number(value)
        })
        return row
      })

      console.log("[v0] Parsed", rows.length, "rows from URL")

      // Upload to database
      const uploadResponse = await fetch("/api/datasets/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          source: source || "URL Import",
          sourceUrl,
          data: rows,
        }),
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] Upload failed:", errorData)

        // Show helpful error message
        if (errorData.error?.includes("relation") || errorData.error?.includes("does not exist")) {
          alert(
            "Database tables not found. Please run the SQL setup script first:\n\n" +
              "1. Go to https://supabase.com and log in\n" +
              "2. Open your project\n" +
              "3. Go to SQL Editor\n" +
              "4. Run the script from scripts/001_create_flexible_schema.sql",
          )
        } else {
          alert(`Failed to upload dataset: ${errorData.error || "Unknown error"}`)
        }
        return
      }

      const result = await uploadResponse.json()
      console.log("[v0] Import successful, redirecting to dashboard...")
      router.push(`/dashboard/${result.datasetId}`)
    } catch (error) {
      console.error("[v0] Import error:", error)
      alert(`Failed to import dataset: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="file" onValueChange={(v) => setUploadMethod(v as "file" | "url")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </TabsTrigger>
        <TabsTrigger value="url">
          <LinkIcon className="mr-2 h-4 w-4" />
          Import from URL
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file">
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Dataset Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Walmart Sales Data"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the dataset"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source (Optional)</Label>
            <Input
              id="source"
              placeholder="e.g., Kaggle, Internal Database"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">CSV File *</Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
            <p className="text-xs text-muted-foreground">Upload a CSV file with your data</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Dataset
              </>
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="url">
        <form onSubmit={handleUrlImport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name-url">Dataset Name *</Label>
            <Input
              id="name-url"
              placeholder="e.g., Walmart Sales Data"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description-url">Description</Label>
            <Textarea
              id="description-url"
              placeholder="Brief description of the dataset"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-url">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-url">Source (Optional)</Label>
            <Input
              id="source-url"
              placeholder="e.g., Kaggle"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Dataset URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/data.csv"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct link to a CSV file (e.g., from Kaggle, GitHub, or any public URL)
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <LinkIcon className="mr-2 h-4 w-4" />
                Import Dataset
              </>
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
