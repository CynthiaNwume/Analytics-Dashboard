import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Database, Calendar, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function DatasetsPage() {
  const supabase = await createServerClient()

  let datasets = null
  let error = null

  try {
    const result = await supabase.from("datasets").select("*").order("created_at", { ascending: false })

    datasets = result.data
    error = result.error
  } catch (e) {
    console.error("[v0] Exception fetching datasets:", e)
    error = e
  }

  const tablesNotExist =
    error &&
    (error.message?.includes("does not exist") || error.message?.includes("relation") || error.code === "42P01")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-1 container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Datasets</h1>
            <p className="text-muted-foreground mt-1">Manage and upload your analytics datasets</p>
          </div>
          <Link href="/datasets/upload">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Dataset
            </Button>
          </Link>
        </div>

        {tablesNotExist && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription>
              The database tables haven't been created yet. Please run the SQL script{" "}
              <code className="bg-muted px-1 py-0.5 rounded">scripts/001_create_flexible_schema.sql</code> to set up the
              database schema.
            </AlertDescription>
          </Alert>
        )}

        {error && !tablesNotExist && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Datasets</AlertTitle>
            <AlertDescription>
              {error.message || "An error occurred while fetching datasets. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Datasets Grid */}
        {!error && (!datasets || datasets.length === 0) ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Database className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No datasets yet</h3>
                <p className="text-muted-foreground">Get started by uploading your first dataset</p>
              </div>
              <Link href="/datasets/upload">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Dataset
                </Button>
              </Link>
            </div>
          </Card>
        ) : !error && datasets ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {datasets.map((dataset) => (
              <Link key={dataset.id} href={`/dashboard/${dataset.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Database className="h-8 w-8 text-primary" />
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {dataset.category}
                      </span>
                    </div>
                    <CardTitle className="mt-4">{dataset.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{dataset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          {dataset.row_count?.toLocaleString()} rows × {dataset.column_count} columns
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(dataset.created_at).toLocaleDateString()}</span>
                      </div>
                      {dataset.source && (
                        <div className="text-xs bg-muted px-2 py-1 rounded inline-block">Source: {dataset.source}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  )
}
