import { UploadDatasetForm } from "@/components/upload-dataset-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function UploadDatasetPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-1 container mx-auto p-6 max-w-3xl space-y-6">
        {/* Back Button */}
        <Link href="/datasets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Datasets
          </Button>
        </Link>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Dataset</CardTitle>
            <CardDescription>Upload a CSV file or paste data from Kaggle, APIs, or any other source</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDatasetForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
