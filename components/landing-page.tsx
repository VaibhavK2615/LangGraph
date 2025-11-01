"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, Shield, Target, TrendingUp, Globe, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: Shield,
      title: "Risk Analysis",
      description: "Comprehensive risk assessment with detailed scoring and trend analysis"
    },
    {
      icon: TrendingUp,
      title: "Best Markets",
      description: "Identify high-potential markets with margin analysis and growth insights"
    },
    {
      icon: Target,
      title: "Stable Partners",
      description: "Find reliable trading partners with stability and reliability metrics"
    },
    {
      icon: Lightbulb,
      title: "Smart Suggestions",
      description: "AI-powered recommendations for market expansion and risk reduction"
    },
    {
      icon: Globe,
      title: "Country Comparison",
      description: "Compare multiple countries side-by-side with detailed metrics"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights with historical data and predictive analysis"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo and Title */}
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Market Analyzer
            </h1>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              AI-powered market analysis using LangGraph and advanced analytics. 
              Get comprehensive insights into market risks, opportunities, and trading strategies.
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-green-200 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-medium text-slate-700">Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200 shadow-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-medium text-slate-700">AI-Powered Insights</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-200 shadow-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-medium text-slate-700">Advanced Analytics</span>
            </div>
          </div>

          {/* Redirect Button */}
          <div className="pt-8">
            <Button
              onClick={() => router.push('/analyze')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Start Analysis
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Analysis Features</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive tools to help you make informed trading decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Redirect Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-6 md:p-8 lg:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Unlock the power of AI-driven market analysis and make smarter trading decisions today.
            </p>
            <Button
              onClick={() => router.push('/analyze')}
              className="bg-white text-blue-600 hover:bg-blue-50 text-base sm:text-lg px-6 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Launch Analysis Tool
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-slate-500">
          <p>&copy; 2025 Market Analyzer. Powered by LangGraph and AI.</p>
        </div>
      </div>
    </div>
  )
}
