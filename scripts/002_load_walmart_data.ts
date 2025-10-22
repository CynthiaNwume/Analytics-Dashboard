/**
 * Script to load Walmart Sales data from Kaggle into Supabase
 *
 * This script fetches the Walmart Sales CSV dataset and populates
 * the database with real historical sales data from 45 Walmart stores.
 *
 * Dataset: https://www.kaggle.com/datasets/mikhail1681/walmart-sales
 *
 * Run this script after creating the database table with 001_create_walmart_sales_table.sql
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function loadWalmartData() {
  console.log("[v0] Starting Walmart sales data import...")

  try {
    // Fetch the Walmart sales CSV data from a public source
    // Using a mirror of the Kaggle dataset
    const csvUrl = "https://raw.githubusercontent.com/plotly/datasets/master/walmart_store_sales.csv"

    console.log("[v0] Fetching Walmart sales data from CSV...")
    const response = await fetch(csvUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    console.log("[v0] CSV Headers:", headers)
    console.log("[v0] Total rows:", lines.length - 1)

    // Parse CSV and prepare data for insertion
    const salesData = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",")

      // Parse the CSV columns
      // Expected format: Store,Date,Weekly_Sales,Holiday_Flag,Temperature,Fuel_Price,CPI,Unemployment
      const record = {
        store: Number.parseInt(values[0]),
        date: values[1], // Format: DD-MM-YYYY or YYYY-MM-DD
        weekly_sales: Number.parseFloat(values[2]),
        holiday_flag: Number.parseInt(values[3]),
        temperature: values[4] ? Number.parseFloat(values[4]) : null,
        fuel_price: values[5] ? Number.parseFloat(values[5]) : null,
        cpi: values[6] ? Number.parseFloat(values[6]) : null,
        unemployment: values[7] ? Number.parseFloat(values[7]) : null,
      }

      // Validate the record
      if (!isNaN(record.store) && !isNaN(record.weekly_sales)) {
        salesData.push(record)
      }
    }

    console.log("[v0] Parsed records:", salesData.length)
    console.log("[v0] Sample record:", salesData[0])

    // Insert data in batches to avoid timeout
    const batchSize = 500
    let inserted = 0

    for (let i = 0; i < salesData.length; i += batchSize) {
      const batch = salesData.slice(i, i + batchSize)

      const { data, error } = await supabase.from("walmart_sales").insert(batch).select()

      if (error) {
        console.error("[v0] Error inserting batch:", error)
        throw error
      }

      inserted += batch.length
      console.log(`[v0] Inserted ${inserted}/${salesData.length} records...`)
    }

    console.log("[v0] ✅ Successfully loaded Walmart sales data!")
    console.log(`[v0] Total records inserted: ${inserted}`)

    // Verify the data
    const { count } = await supabase.from("walmart_sales").select("*", { count: "exact", head: true })

    console.log(`[v0] Total records in database: ${count}`)
  } catch (error) {
    console.error("[v0] Error loading Walmart data:", error)
    throw error
  }
}

// Run the import
loadWalmartData()
