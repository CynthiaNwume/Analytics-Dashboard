"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChartIcon } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF6B9D"]

interface Column {
  column_name: string
  column_type: string
  is_metric: boolean
  is_dimension: boolean
}

interface DynamicDashboardProps {
  dataset: any
  columns: Column[]
  data: any[]
}

export function DynamicDashboard({ dataset, columns, data }: DynamicDashboardProps) {
  // Identify metric and dimension columns
  const metricColumns = columns.filter((col) => col.is_metric && col.column_name && col.column_name.trim() !== "")
  const dimensionColumns = columns.filter((col) => col.is_dimension && col.column_name && col.column_name.trim() !== "")
  const dateColumns = columns.filter(
    (col) =>
      col.column_name &&
      col.column_name.trim() !== "" &&
      (col.column_type === "date" || col.column_name.toLowerCase().includes("date")),
  )

  // State for filters
  const [selectedDimension, setSelectedDimension] = useState(dimensionColumns[0]?.column_name || "")
  const [selectedMetric, setSelectedMetric] = useState(metricColumns[0]?.column_name || "")
  const [selectedTimeColumn, setSelectedTimeColumn] = useState(dateColumns[0]?.column_name || "")

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (!data.length || !metricColumns.length) return []

    return metricColumns.slice(0, 3).map((col) => {
      const values = data.map((row) => Number(row[col.column_name]) || 0)
      const total = values.reduce((sum, val) => sum + val, 0)
      const avg = total / values.length
      const trend = values.length > 1 ? ((values[values.length - 1] - values[0]) / values[0]) * 100 : 0

      return {
        name: col.column_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: total,
        average: avg,
        trend: trend,
        icon: DollarSign,
      }
    })
  }, [data, metricColumns])

  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    if (!selectedTimeColumn || !selectedMetric) return []

    const grouped = data.reduce((acc: any, row) => {
      const timeKey = row[selectedTimeColumn]
      if (!acc[timeKey]) {
        acc[timeKey] = { time: timeKey, value: 0, count: 0 }
      }
      acc[timeKey].value += Number(row[selectedMetric]) || 0
      acc[timeKey].count += 1
      return acc
    }, {})

    return Object.values(grouped).sort((a: any, b: any) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime()
    })
  }, [data, selectedTimeColumn, selectedMetric])

  // Prepare dimension breakdown data
  const dimensionData = useMemo(() => {
    if (!selectedDimension || !selectedMetric) return []

    const grouped = data.reduce((acc: any, row) => {
      const dimKey = row[selectedDimension]
      if (!acc[dimKey]) {
        acc[dimKey] = { name: dimKey, value: 0 }
      }
      acc[dimKey].value += Number(row[selectedMetric]) || 0
      return acc
    }, {})

    return Object.values(grouped)
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 10)
  }, [data, selectedDimension, selectedMetric])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {dimensionColumns.length > 0 && (
              <div className="space-y-2">
                <Label>Group By</Label>
                <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dimensionColumns.map((col) => (
                      <SelectItem key={col.column_name} value={col.column_name}>
                        {col.column_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {metricColumns.length > 0 && (
              <div className="space-y-2">
                <Label>Metric</Label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {metricColumns.map((col) => (
                      <SelectItem key={col.column_name} value={col.column_name}>
                        {col.column_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {dateColumns.length > 0 && (
              <div className="space-y-2">
                <Label>Time Column</Label>
                <Select value={selectedTimeColumn} onValueChange={setSelectedTimeColumn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateColumns.map((col) => (
                      <SelectItem key={col.column_name} value={col.column_name}>
                        {col.column_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      {kpis.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>Avg: {kpi.average.toFixed(2)}</span>
                  {kpi.trend !== 0 && (
                    <span className={`flex items-center ${kpi.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                      {kpi.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(kpi.trend).toFixed(1)}%
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Time Series Chart */}
        {timeSeriesData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {selectedMetric.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} name={selectedMetric} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Dimension Breakdown Chart */}
        {dimensionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                {selectedMetric.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} by{" "}
                {selectedDimension.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={dimensionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {dimensionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bar Chart for Top Items */}
      {dimensionData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Top {selectedDimension.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} by{" "}
              {selectedMetric.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dimensionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name={selectedMetric} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Data Table Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {columns.slice(0, 6).map((col) => (
                    <th key={col.column_name} className="text-left p-2 font-medium">
                      {col.column_name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b">
                    {columns.slice(0, 6).map((col) => (
                      <td key={col.column_name} className="p-2">
                        {row[col.column_name]?.toString() || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 10 && (
              <p className="text-xs text-muted-foreground mt-2">Showing 10 of {data.length.toLocaleString()} rows</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
