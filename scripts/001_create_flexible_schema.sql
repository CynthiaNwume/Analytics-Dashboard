-- Multi-Dataset Analytics Platform Schema
-- This schema supports multiple datasets from any source (Kaggle, CSV, API, etc.)

-- Datasets table: stores metadata about each uploaded dataset
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  source TEXT, -- e.g., "Kaggle", "CSV Upload", "API", etc.
  source_url TEXT,
  category TEXT, -- e.g., "Sales", "Marketing", "Finance", "Healthcare", etc.
  row_count INTEGER DEFAULT 0,
  column_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dataset columns: stores the schema/structure of each dataset
CREATE TABLE IF NOT EXISTS dataset_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  column_name TEXT NOT NULL,
  column_type TEXT NOT NULL, -- "text", "number", "date", "boolean"
  is_metric BOOLEAN DEFAULT false, -- true if this column contains numeric metrics
  is_dimension BOOLEAN DEFAULT false, -- true if this column is a categorical dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dataset rows: stores the actual data in a flexible JSONB format
CREATE TABLE IF NOT EXISTS dataset_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  data JSONB NOT NULL, -- flexible JSON storage for any data structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dataset_rows_dataset_id ON dataset_rows(dataset_id);
CREATE INDEX IF NOT EXISTS idx_dataset_rows_data ON dataset_rows USING GIN(data);
CREATE INDEX IF NOT EXISTS idx_dataset_columns_dataset_id ON dataset_columns(dataset_id);

-- Enable Row Level Security (RLS) for security
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_rows ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (adjust based on your needs)
CREATE POLICY "Allow public read access to datasets" ON datasets FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dataset_columns" ON dataset_columns FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dataset_rows" ON dataset_rows FOR SELECT USING (true);

-- Create policies to allow public insert (for demo purposes - restrict in production)
CREATE POLICY "Allow public insert to datasets" ON datasets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to dataset_columns" ON dataset_columns FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to dataset_rows" ON dataset_rows FOR INSERT WITH CHECK (true);
