📊 Universal Analytics Dashboard
A flexible, full-stack analytics platform designed to visualize data from any source—CSV files, Kaggle datasets, APIs, or databases. Built with Next.js 16, React 19, TypeScript, and Supabase.

✨ Key Features
🔄 Universal Data Import: Seamlessly upload CSV files or import data directly from URLs (Kaggle, APIs, etc.).

📈 Intelligent Auto-Charting: Automatically generates the most suitable charts and visualizations based on your data structure.

🎯 Dynamic Dashboards: Every dataset automatically receives its own interactive and dedicated dashboard.

🔍 Smart Filters: Real-time data filtering by metrics, dimensions, and custom date ranges.

🎨 Modern UI/UX: Built with shadcn/ui and Tailwind CSS for a beautiful, fully responsive experience with Dark Mode support.

⚡ Real-time Sync: Data updates and syncs automatically with the Supabase backend.

🛠️ Tech Stack
Category	Technologies
Frontend	Next.js 16 (App Router), React 19, TypeScript
Styling	Tailwind CSS v4, shadcn/ui components
Database	Supabase (PostgreSQL, leveraging JSONB for flexibility)
State	React Server Components + Client Components
Charts	Recharts
Deployment	Vercel

📋 Getting Started
Prerequisites

Node.js 18+ and npm

A Supabase account (the free tier works great)

Git

1. Installation

Bash
# Clone the repository
git clone https://github.com/CynthiaNwume/universal-analytics-dashboard.git
cd universal-analytics-dashboard

# Install dependencies
npm install
2. Configure Environment

Create a .env.local file in the root directory and add your Supabase connection details:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Database Setup

Go to your Supabase Dashboard.

Navigate to the SQL Editor.

Copy and paste the contents of scripts/001_create_flexible_schema.sql into the editor.

Click Run to create the necessary tables.

4. Run the Development Server

Bash
npm run dev
Open http://localhost:3000 in your browser.

📖 Usage
Uploading Your First Dataset

Navigate to the upload page (usually /datasets/upload).

Choose your source: Upload CSV from your computer or Import from URL (e.g., a direct link to a Kaggle CSV).

Click Upload Dataset.

Your new, interactive dashboard is ready at /dashboard/[dataset-id].

Supported Data Sources

✅ CSV Files (any structure)

✅ Kaggle Datasets (use direct download links)

✅ Google Sheets (exported as CSV)

✅ API Responses (JSON-to-CSV conversion)

Example Datasets to Try

Walmart Sales Data

Netflix Movies and TV Shows

COVID-19 Dataset

🚀 Use Cases
Business Intelligence: Quickly analyze sales, marketing performance, or operational data.

Data Exploration: Rapidly visualize and understand new or unfamiliar datasets.

Academic Research: Create shareable dashboards for research findings.

Personal Analytics: Track and visualize personal finance, fitness, or habit data.

🤝 Contributing & Roadmap
We welcome contributions! Please check out the existing issues and read the Contributing Guide.

Roadmap

[ ] Add more chart types (scatter plots, heatmaps, etc.).

[ ] Export dashboards as PDF/PNG.

[ ] Real-time collaboration features.

[ ] Custom dashboard templates.

[ ] AI-powered insights and recommendations.

[ ] Integration with third-party services (Google Analytics, Stripe, etc.).

🙏 Acknowledgments
Built with Next.js

UI components from shadcn/ui

Database powered by Supabase

Charts by Recharts

⭐ If you find this project useful, please consider giving it a star on GitHub!
