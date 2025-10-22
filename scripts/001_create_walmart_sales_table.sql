-- Create table for Walmart sales data from Kaggle
-- Dataset: https://www.kaggle.com/datasets/mikhail1681/walmart-sales
-- This table stores weekly sales data from 45 Walmart stores

DROP TABLE IF EXISTS walmart_sales;

CREATE TABLE walmart_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store INTEGER NOT NULL,
  date DATE NOT NULL,
  weekly_sales NUMERIC(12, 2) NOT NULL,
  holiday_flag INTEGER NOT NULL,
  temperature NUMERIC(6, 2),
  fuel_price NUMERIC(6, 3),
  cpi NUMERIC(10, 6),
  unemployment NUMERIC(6, 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_walmart_sales_date ON walmart_sales(date);
CREATE INDEX idx_walmart_sales_store ON walmart_sales(store);
CREATE INDEX idx_walmart_sales_store_date ON walmart_sales(store, date);

-- Enable Row Level Security (RLS)
ALTER TABLE walmart_sales ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON walmart_sales
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON walmart_sales
  FOR INSERT
  WITH CHECK (true);
