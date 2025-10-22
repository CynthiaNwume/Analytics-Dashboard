/**
 * Script to fetch product data from DummyJSON API and generate realistic sales transactions
 * This script populates the sales_transactions table with data that updates based on the API
 *
 * Run this script to populate your database with initial data
 */

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role key for admin access
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Define regions and their weights for realistic distribution
const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"]

// Function to generate random date within the last 12 months
function getRandomDate() {
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 12)
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Function to generate random sales data based on product
function generateSalesTransaction(product: any) {
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)]
  const unitsSold = Math.floor(Math.random() * 50) + 1 // 1-50 units
  const revenue = Number.parseFloat((product.price * unitsSold).toFixed(2))
  const saleDate = getRandomDate()

  return {
    product_name: product.title,
    category: product.category,
    region,
    revenue,
    units_sold: unitsSold,
    sale_date: saleDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
  }
}

async function populateSalesData() {
  try {
    console.log("[v0] Fetching products from DummyJSON API...")

    // Fetch products from DummyJSON API
    const response = await fetch("https://dummyjson.com/products?limit=100")
    const data = await response.json()

    console.log(`[v0] Fetched ${data.products.length} products`)

    // Generate multiple transactions per product (3-8 transactions each)
    const transactions = []
    for (const product of data.products) {
      const numTransactions = Math.floor(Math.random() * 6) + 3 // 3-8 transactions per product
      for (let i = 0; i < numTransactions; i++) {
        transactions.push(generateSalesTransaction(product))
      }
    }

    console.log(`[v0] Generated ${transactions.length} sales transactions`)

    // Clear existing data (optional - remove if you want to keep accumulating data)
    console.log("[v0] Clearing existing sales data...")
    await supabase.from("sales_transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Insert transactions in batches of 100
    const batchSize = 100
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)
      const { error } = await supabase.from("sales_transactions").insert(batch)

      if (error) {
        console.error(`[v0] Error inserting batch ${i / batchSize + 1}:`, error)
      } else {
        console.log(`[v0] Inserted batch ${i / batchSize + 1} (${batch.length} records)`)
      }
    }

    console.log("[v0] ✅ Sales data population complete!")

    // Fetch and display summary statistics
    const { data: stats } = await supabase.from("sales_transactions").select("revenue, units_sold")

    if (stats) {
      const totalRevenue = stats.reduce((sum, row) => sum + Number.parseFloat(row.revenue.toString()), 0)
      const totalUnits = stats.reduce((sum, row) => sum + row.units_sold, 0)
      console.log(`[v0] Total Revenue: $${totalRevenue.toFixed(2)}`)
      console.log(`[v0] Total Units Sold: ${totalUnits}`)
      console.log(`[v0] Total Transactions: ${stats.length}`)
    }
  } catch (error) {
    console.error("[v0] Error populating sales data:", error)
  }
}

// Run the population script
populateSalesData()
