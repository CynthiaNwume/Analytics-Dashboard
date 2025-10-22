import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, description, category, source, sourceUrl, data } = await request.json()

    console.log("[v0] Received upload request:", { name, category, rowCount: data?.length })

    if (!name || !category || !data || data.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Insert dataset metadata
    const { data: dataset, error: datasetError } = await supabase
      .from("datasets")
      .insert({
        name,
        description,
        source,
        source_url: sourceUrl,
        category,
        row_count: data.length,
        column_count: Object.keys(data[0] || {}).length,
      })
      .select()
      .single()

    if (datasetError) {
      console.error("[v0] Error creating dataset:", datasetError)
      return NextResponse.json({ error: "Failed to create dataset" }, { status: 500 })
    }

    console.log("[v0] Dataset created:", dataset.id)

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
      console.error("[v0] Error creating columns:", columnsError)
      return NextResponse.json({ error: "Failed to create columns" }, { status: 500 })
    }

    console.log("[v0] Columns created:", columns.length)

    // Clean and serialize the data to ensure it's JSON-compatible
    const rows = data.map((row: any) => {
      // Use JSON.parse(JSON.stringify()) to ensure proper serialization
      // This removes any non-serializable values and ensures clean JSON
      const cleanedRow = JSON.parse(JSON.stringify(row))

      return {
        dataset_id: dataset.id,
        data: cleanedRow,
      }
    })

    console.log("[v0] Inserting rows:", rows.length)

    // Insert in batches of 100 rows to avoid large payload issues
    const batchSize = 100
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const { error: rowsError } = await supabase.from("dataset_rows").insert(batch)

      if (rowsError) {
        console.error("[v0] Error inserting batch:", rowsError)
        return NextResponse.json({ error: `Failed to insert data at row ${i}` }, { status: 500 })
      }

      console.log("[v0] Inserted batch:", i, "to", Math.min(i + batchSize, rows.length))
    }

    console.log("[v0] All rows inserted successfully")

    return NextResponse.json({ success: true, datasetId: dataset.id })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
