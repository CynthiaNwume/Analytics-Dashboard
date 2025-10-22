/**
 * Seed Sample Datasets
 * This script populates the database with sample datasets from various sources
 * to demonstrate the multi-dataset analytics platform
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Sample Dataset 1: E-commerce Sales Data
const ecommerceSalesData = [
  { date: "2024-01-01", product: "Laptop", category: "Electronics", region: "North", revenue: 1200, units: 2 },
  { date: "2024-01-02", product: "Mouse", category: "Electronics", region: "South", revenue: 25, units: 5 },
  { date: "2024-01-03", product: "Keyboard", category: "Electronics", region: "East", revenue: 75, units: 3 },
  { date: "2024-01-04", product: "Monitor", category: "Electronics", region: "West", revenue: 300, units: 1 },
  { date: "2024-01-05", product: "Laptop", category: "Electronics", region: "North", revenue: 2400, units: 4 },
  { date: "2024-02-01", product: "Desk", category: "Furniture", region: "South", revenue: 450, units: 2 },
  { date: "2024-02-02", product: "Chair", category: "Furniture", region: "East", revenue: 200, units: 4 },
  { date: "2024-02-03", product: "Lamp", category: "Furniture", region: "West", revenue: 60, units: 6 },
  { date: "2024-03-01", product: "Notebook", category: "Stationery", region: "North", revenue: 15, units: 10 },
  { date: "2024-03-02", product: "Pen", category: "Stationery", region: "South", revenue: 5, units: 20 },
]

// Sample Dataset 2: Marketing Campaign Performance
const marketingData = [
  {
    date: "2024-01-01",
    campaign: "Social Media",
    platform: "Facebook",
    impressions: 10000,
    clicks: 500,
    conversions: 25,
    cost: 200,
  },
  {
    date: "2024-01-02",
    campaign: "Social Media",
    platform: "Instagram",
    impressions: 8000,
    clicks: 400,
    conversions: 20,
    cost: 150,
  },
  {
    date: "2024-01-03",
    campaign: "Email",
    platform: "Newsletter",
    impressions: 5000,
    clicks: 250,
    conversions: 30,
    cost: 50,
  },
  {
    date: "2024-02-01",
    campaign: "Search Ads",
    platform: "Google",
    impressions: 15000,
    clicks: 750,
    conversions: 50,
    cost: 500,
  },
  {
    date: "2024-02-02",
    campaign: "Display Ads",
    platform: "Banner",
    impressions: 20000,
    clicks: 300,
    conversions: 15,
    cost: 300,
  },
]

// Sample Dataset 3: Customer Satisfaction Survey
const customerSatisfactionData = [
  { date: "2024-01-15", department: "Sales", rating: 4.5, responses: 120, nps_score: 45 },
  { date: "2024-01-15", department: "Support", rating: 4.2, responses: 95, nps_score: 38 },
  { date: "2024-01-15", department: "Product", rating: 4.7, responses: 150, nps_score: 52 },
  { date: "2024-02-15", department: "Sales", rating: 4.6, responses: 130, nps_score: 48 },
  { date: "2024-02-15", department: "Support", rating: 4.4, responses: 105, nps_score: 42 },
  { date: "2024-02-15", department: "Product", rating: 4.8, responses: 160, nps_score: 55 },
]

async function seedDataset(name: string, description: string, source: string, category: string, data: any[]) {
  console.log(`[v0] Seeding dataset: ${name}`)

  // Insert dataset metadata
  const { data: dataset, error: datasetError } = await supabase
    .from("datasets")
    .insert({
      name,
      description,
      source,
      category,
      row_count: data.length,
      column_count: Object.keys(data[0] || {}).length,
    })
    .select()
    .single()

  if (datasetError) {
    console.error(`[v0] Error creating dataset ${name}:`, datasetError)
    return
  }

  console.log(`[v0] Created dataset with ID: ${dataset.id}`)

  // Insert column metadata
  const columns = Object.keys(data[0] || {}).map((key) => {
    const sampleValue = data[0][key]
    const columnType = typeof sampleValue === "number" ? "number" : sampleValue instanceof Date ? "date" : "text"

    return {
      dataset_id: dataset.id,
      column_name: key,
      column_type: columnType,
      is_metric: columnType === "number",
      is_dimension: columnType === "text",
    }
  })

  const { error: columnsError } = await supabase.from("dataset_columns").insert(columns)

  if (columnsError) {
    console.error(`[v0] Error creating columns for ${name}:`, columnsError)
    return
  }

  console.log(`[v0] Created ${columns.length} columns`)

  // Insert data rows
  const rows = data.map((row) => ({
    dataset_id: dataset.id,
    data: row,
  }))

  const { error: rowsError } = await supabase.from("dataset_rows").insert(rows)

  if (rowsError) {
    console.error(`[v0] Error inserting rows for ${name}:`, rowsError)
    return
  }

  console.log(`[v0] Inserted ${rows.length} rows for ${name}`)
}

async function main() {
  console.log("[v0] Starting to seed sample datasets...")

  await seedDataset(
    "E-commerce Sales",
    "Sample e-commerce sales data with products, categories, and regional information",
    "Sample Data",
    "Sales",
    ecommerceSalesData,
  )

  await seedDataset(
    "Marketing Campaigns",
    "Marketing campaign performance metrics across different platforms",
    "Sample Data",
    "Marketing",
    marketingData,
  )

  await seedDataset(
    "Customer Satisfaction",
    "Customer satisfaction survey results by department",
    "Sample Data",
    "Customer Service",
    customerSatisfactionData,
  )

  console.log("[v0] Finished seeding all datasets!")
}

main()
