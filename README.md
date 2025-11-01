# Market Analyzer - AI-Powered Trade Analysis

A comprehensive market analysis application built with Next.js, LangGraph, Supabase, and Groq AI.

## Live On

<!-- [**Launch Site**](https://nx-next-rag.vercel.app/) -->

---

## Screenshots

<!-- ### 🔹 Analysis section -->
<!-- ![Analysis](apps/demoRAG/public/analysis.png) -->

<!-- ### 🔹 Historical Data View -->
<!-- ![Historical Data](apps/demoRAG/public/history.png) -->

<!-- ### 🔹 Modal View -->
<!-- ![Modal](apps/demoRAG/public/modal.png) -->

---

## Features

- **Risk Analysis**: Comprehensive risk assessment with charts and summaries
- **Best Market Analysis**: Identify high-margin markets with growth potential
- **Stable Partners**: Analyze trading partner stability and reliability
- **Smart Suggestions**: AI-powered recommendations for market expansion/reduction
- **Country Comparison**: Multi-country comparative analysis

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, LangGraph, LangChain
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq (llama-3.3-70b-versatile)
- **Monitoring**: LangSmith
- **Charts**: Recharts

---

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account
- Groq API key
- LangSmith account (optional)

### 2. Project Setup

\`\`\`bash
# Clone and install dependencies
git clone <repository-url>
cd market-analyzer
npm install
\`\`\`

### 3. Environment Configuration

Create `.env.local` file:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key

# LangSmith Configuration (Optional)
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_PROJECT=market-analyzer
\`\`\`

### 4. API Keys Setup

#### Supabase:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the URL and anon key

#### Groq:
1. Sign up at https://console.groq.com
2. Create an API key
3. Add to environment variables

#### LangSmith (Optional):
1. Sign up at https://smith.langchain.com
2. Create an API key
3. Add to environment variables

### 5. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

---

## LangGraph Features Implemented

### 1. Prompt Chaining
- Sequential analysis steps that build upon each other
- Risk → Market → Stability → Suggestions flow

### 2. Parallelization
- Multiple analysis nodes can run concurrently
- Efficient processing of independent analysis tasks

### 3. Routing
- Conditional routing based on analysis type
- Different paths for specific vs comprehensive analysis

### 4. Orchestrator Work
- Complex workflows broken into manageable subtasks
- Each node handles specific analysis aspects

### 5. Evaluator
- Quality assessment of analysis results
- Continuous improvement feedback loop

---

## API Endpoints

- `POST /api/analyze` - Main analysis endpoint
- `GET /api/data/hsn-codes` - Fetch available HSN codes
- `GET /api/data/countries` - Fetch available countries

## Database Schema

### market_prices table:
- `id` (UUID, Primary Key)
- `hsn_code` (VARCHAR, HSN classification code)
- `country` (VARCHAR, Country name)
- `price` (DECIMAL, Price per unit)
- `volume` (INTEGER, Trade volume)
- `date` (DATE, Record date)
- `risk_score` (INTEGER, Risk assessment score)
- `stability_index` (INTEGER, Stability rating)

## Usage

1. Select an HSN code from the dropdown
2. Optionally add countries for comparison
3. Click "Start Analysis" to run the AI analysis
4. View results in different tabs:
   - Risk Analysis: Risk scores and trends
   - Best Markets: High-margin opportunities
   - Stable Partners: Reliable trading partners
   - Smart Suggestions: AI recommendations
   - Country Comparison: Multi-country metrics

---

## Architecture

The application uses a modular architecture:

- **Frontend**: React components with TypeScript
- **API Layer**: Next.js API routes
- **LangGraph**: AI workflow orchestration
- **Database**: Supabase for data storage
- **AI**: Groq for language model inference

---

## Author

Created by [Vaibhav Kalvankar]  
[vaibhavkalvankar97@gmail.com]