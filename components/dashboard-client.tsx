"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// ============================================================================
// TYPES
// ============================================================================

interface KPIs {
  totalRevenue: number
  avgOrderValue: number
  totalUnits: number
}

interface MonthlyRevenue {
  month: string
  revenue: number
}

interface ProductMix {
  category: string
  sales: number
  units: number
  percentage: number
}

interface Filters {
  regions: string[]
  categories: string[]
  currentRegion: string
  currentCategory: string
  startDate: string
  endDate: string
}

interface DashboardClientProps {
  kpis: KPIs
  monthlyRevenue: MonthlyRevenue[]
  productMix: ProductMix[]
  filters: Filters
}

// ============================================================================
// PIE CHART COLORS
// ============================================================================

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"]

// ============================================================================
// DASHBOARD CLIENT COMPONENT
// ============================================================================

export function DashboardClient({ kpis, monthlyRevenue, productMix, filters }: DashboardClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>(filters.currentRegion)
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.currentCategory)
  const [startDate, setStartDate] = useState<string>(filters.startDate)
  const [endDate, setEndDate] = useState<string>(filters.endDate)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // ============================================================================
  // FILTER HANDLER - Updates URL search params to trigger server-side refetch
  // ============================================================================

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedRegion && selectedRegion !== "all") {
      params.set("region", selectedRegion)
    } else {
      params.delete("region")
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.set("store", selectedCategory)
    } else {
      params.delete("store")
    }

    if (startDate) {
      params.set("startDate", startDate)
    } else {
      params.delete("startDate")
    }

    if (endDate) {
      params.set("endDate", endDate)
    } else {
      params.delete("endDate")
    }

    router.push(`?${params.toString()}`)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format number with commas
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(value))
  }

  return (
    <>
      {/* ============================================================================
          HEADER SECTION
          ============================================================================ */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Walmart Sales Analytics Dashboard</h1>

          {/* Dark Mode Toggle Button */}
          <Button variant="outline" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* ============================================================================
          MAIN CONTENT AREA
          ============================================================================ */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============================================================================
              LEFT SIDEBAR - FILTERS PANEL
              ============================================================================ */}
          <aside className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>Refine your analytics view</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Region Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {filters.regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Store</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      {filters.categories.map((store) => (
                        <SelectItem key={store} value={store}>
                          Store {store}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Date Range</label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Start date"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="End date"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <Button onClick={handleApplyFilters} className="w-full">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* ============================================================================
              MAIN CONTENT AREA - KPIs and Charts
              ============================================================================ */}
          <div className="lg:col-span-9 space-y-6">
            {/* ============================================================================
                KPI CARDS ROW - Now using real Walmart data from Kaggle
                ============================================================================ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Revenue KPI */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Weekly Sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(kpis.totalRevenue)}</div>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Kaggle</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">from Walmart stores</p>
                </CardContent>
              </Card>

              {/* Average Order Value KPI */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg. Weekly Sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(kpis.avgOrderValue)}</div>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Kaggle</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">per store per week</p>
                </CardContent>
              </Card>

              {/* Units Sold KPI */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Est. Units Sold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-foreground">{formatNumber(kpis.totalUnits)}</div>
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Kaggle</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">estimated units</p>
                </CardContent>
              </Card>
            </div>

            {/* ============================================================================
                CHART 1: MONTHLY REVENUE TREND - Real Recharts implementation
                ============================================================================ */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Walmart weekly sales aggregated by month</CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [formatCurrency(value), "Sales"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                    No data available for the selected filters
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ============================================================================
                CHART 2: PRODUCT MIX BY SALES - Real Recharts Pie Chart
                ============================================================================ */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Distribution by Region</CardTitle>
                <CardDescription>Weekly sales distribution across store regions</CardDescription>
              </CardHeader>
              <CardContent>
                {productMix.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={productMix}
                        dataKey="sales"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                      >
                        {productMix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                    No data available for the selected filters
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
