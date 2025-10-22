-- Create sales_transactions table for analytics dashboard
-- This table stores individual sales transactions with product, region, and revenue data

CREATE TABLE IF NOT EXISTS sales_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  revenue NUMERIC(10, 2) NOT NULL,
  units_sold INTEGER NOT NULL,
  sale_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance on filtered columns
CREATE INDEX IF NOT EXISTS idx_sales_region ON sales_transactions(region);
CREATE INDEX IF NOT EXISTS idx_sales_category ON sales_transactions(category);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_transactions(sale_date);

-- Since this is a public analytics dashboard without user authentication,
-- we'll allow public read access but no write access from the client
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read sales data (public dashboard)
CREATE POLICY "Allow public read access to sales data"
  ON sales_transactions
  FOR SELECT
  TO anon
  USING (true);

-- Only allow authenticated users or service role to insert/update/delete
CREATE POLICY "Only authenticated users can modify sales data"
  ON sales_transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
