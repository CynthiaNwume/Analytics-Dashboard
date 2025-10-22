import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Upload, BarChart3, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  const supabase = await createServerClient()

  // Fetch recent datasets
  const { data: recentDatasets } = await supabase
    .from("datasets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">Multi-Dataset Analytics Platform</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Upload any dataset from Kaggle, CSV files, or APIs and visualize your data with interactive dashboards
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/datasets/upload">
                <Button size="lg">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Dataset
                </Button>
              </Link>
              <Link href="/datasets">
                <Button size="lg" variant="outline">
                  <Database className="mr-2 h-5 w-5" />
                  View Datasets
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 border-t">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Upload className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Flexible Data Import</CardTitle>
                <CardDescription>
                  Upload CSV files or import directly from URLs. Support for Kaggle datasets, APIs, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Dynamic Visualizations</CardTitle>
                <CardDescription>
                  Automatically generated charts and graphs that adapt to your data structure and types.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Interactive KPIs, filters, and drill-down capabilities to explore your data in depth.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Recent Datasets Section */}
        {recentDatasets && recentDatasets.length > 0 && (
          <section className="container mx-auto px-4 py-16 border-t">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Recent Datasets</h2>
              <Link href="/datasets">
                <Button variant="ghost">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {recentDatasets.map((dataset) => (
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
                      <div className="text-sm text-muted-foreground">
                        {dataset.row_count?.toLocaleString()} rows × {dataset.column_count} columns
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 border-t">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center space-y-4 py-12">
              <CardTitle className="text-3xl">Ready to Analyze Your Data?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Upload your first dataset and start exploring insights in minutes
              </CardDescription>
              <div className="pt-4">
                <Link href="/datasets/upload">
                  <Button size="lg" variant="secondary">
                    <Upload className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
