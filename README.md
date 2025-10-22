# 📊 Universal Analytics Dashboard

A flexible, full-stack analytics platform that can visualize data from **any source** - CSV files, Kaggle datasets, APIs, or databases. Built with Next.js 16, React 19, TypeScript, and Supabase.

![Analytics Dashboard](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)

## ✨ Features

- **🔄 Universal Data Import** - Upload CSV files or import from URLs (Kaggle, APIs, etc.)
- **📈 Automatic Visualization** - Intelligent chart generation based on your data structure
- **🎯 Dynamic Dashboards** - Each dataset gets its own interactive dashboard
- **🔍 Smart Filters** - Real-time filtering by metrics, dimensions, and date ranges
- **📊 Multiple Chart Types** - Line charts, pie charts, bar charts, and KPI cards
- **🌓 Dark Mode** - Beautiful light and dark themes
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Data syncs automatically with your database
- **🎨 Modern UI** - Built with shadcn/ui and Tailwind CSS


## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL with JSONB)
- **Charts**: Recharts
- **Deployment**: Vercel
- **State Management**: React Server Components + Client Components

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great)
- Git

## 🔧 Installation

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yourusername/universal-analytics-dashboard.git
cd universal-analytics-dashboard
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Set up the database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to the SQL Editor
3. Copy and paste the contents of `scripts/001_create_flexible_schema.sql`
4. Click **Run** to create the tables

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Uploading Your First Dataset

1. Navigate to `/datasets/upload`
2. Choose one of two methods:
   - **Upload CSV**: Select a CSV file from your computer
   - **Import from URL**: Paste a direct link to a CSV file (works great with Kaggle datasets)
3. Click **Upload Dataset**
4. View your dashboard at `/dashboard/[dataset-id]`

### Supported Data Sources

- ✅ CSV files (any structure)
- ✅ Kaggle datasets (use direct download links)
- ✅ Google Sheets (export as CSV)
- ✅ API responses (JSON to CSV conversion)
- ✅ Excel files (convert to CSV first)

### Example Datasets to Try

- [Walmart Sales Data](https://www.kaggle.com/datasets/mikhail1681/walmart-sales)
- [Netflix Movies and TV Shows](https://www.kaggle.com/datasets/shivamb/netflix-shows)
- [COVID-19 Dataset](https://www.kaggle.com/datasets/imdevskp/corona-virus-report)
- [E-commerce Sales](https://www.kaggle.com/datasets/carrie1/ecommerce-data)

## 🎯 Use Cases

- **Business Intelligence**: Analyze sales, marketing, or operational data
- **Academic Research**: Visualize research data and findings
- **Personal Analytics**: Track fitness, finance, or habit data
- **Client Reporting**: Create custom dashboards for clients
- **Data Exploration**: Quickly explore and understand new datasets

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 💡 Feature Requests

Have an idea? Open an issue with the `enhancement` label and describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Charts by [Recharts](https://recharts.org/)

---

⭐ If you find this project useful, please consider giving it a star on GitHub!

## 🗺️ Roadmap

- [ ] Add more chart types (scatter plots, heatmaps)
- [ ] Export dashboards as PDF/PNG
- [ ] Real-time collaboration features
- [ ] API for programmatic data upload
- [ ] Custom dashboard templates
- [ ] AI-powered insights and recommendations
- [ ] Integration with Google Analytics, Stripe, etc.

# Analytics-Dashboard
