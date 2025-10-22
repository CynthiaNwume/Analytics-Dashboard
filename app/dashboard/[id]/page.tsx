import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { DynamicDashboard } from "@/components/dynamic-dashboard"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  // Fetch dataset metadata
  const { data: dataset, error: datasetError } = await supabase.from("datasets").select("*").eq("id", id).single()

  if (datasetError || !dataset) {
    notFound()
  }

  // Fetch dataset columns
  const { data: columns, error: columnsError } = await supabase.from("dataset_columns").select("*").eq("dataset_id", id)

  if (columnsError) {
    console.error("[v0] Error fetching columns:", columnsError)
  }

  // Fetch dataset rows
  const { data: rows, error: rowsError } = await supabase.from("dataset_rows").select("data").eq("dataset_id", id)

  if (rowsError) {
    console.error("[v0] Error fetching rows:", rowsError)
  }

  const data = rows?.map((row) => row.data) || []

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-1 container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/datasets">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{dataset.name}</h1>
              {dataset.description && <p className="text-muted-foreground mt-1">{dataset.description}</p>}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{dataset.category}</span>
          </div>
        </div>

        {/* Dynamic Dashboard */}
        <DynamicDashboard dataset={dataset} columns={columns || []} data={data} />
      </div>
      <Footer />
    </div>
  )
}
