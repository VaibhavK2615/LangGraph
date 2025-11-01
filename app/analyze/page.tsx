"use client"

import { useState } from "react"
import ProductSelector from "@/components/product-selector"
import AnalysisResults from "@/components/analysis-results"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { RiskAnalysis, MarketAnalysis, StabilityAnalysis, SmartSuggestion, CountryComparison, MarketPrice } from "@/app/lib/types"

export default function AnalyzePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentAnalysisType, setCurrentAnalysisType] = useState<string>("")
  const [results, setResults] = useState<{
    riskAnalysis?: RiskAnalysis
    marketAnalysis?: MarketAnalysis
    stabilityAnalysis?: StabilityAnalysis
    smartSuggestions?: SmartSuggestion
    countryComparison?: CountryComparison
    marketData?: MarketPrice[]
  }>({})

  const handleAnalyze = async (analysisType: string, inputs: any) => {
    setLoading(true)
    setCurrentAnalysisType(analysisType)
    setResults({})

    try {
      //Calling api endpoint
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis_type: analysisType,
          ...inputs,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}...`)
      }

      const data = await response.json()

      if (data.success) {
        setResults({
          riskAnalysis: data.data.risk_analysis,
          marketAnalysis: data.data.market_analysis,
          stabilityAnalysis: data.data.stability_analysis,
          smartSuggestions: data.data.smart_suggestions,
          countryComparison: data.data.country_comparison,
          marketData: data.data.market_data,
        })
      } else {
        console.error("Analysis failed:", data.error)
        alert(`Analysis failed: ${data.error}`)
      }
    } catch (error) {
      console.error("Error during analysis:", error)
      alert(`Error during analysis: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const getLoadingMessage = () => {
    switch (currentAnalysisType) {
      case "risk":
        return "Analyzing market risks and generating risk assessment..."
      case "market":
        return "Finding best markets and calculating margins..."
      case "stability":
        return "Evaluating partner stability and reliability..."
      case "suggestions":
        return "Generating smart trading suggestions..."
      case "comparison":
        return "Comparing countries and analyzing metrics..."
      default:
        return "Running comprehensive market analysis..."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            onClick={() => router.push('/')}
            className="group flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Home</span>
          </Button>
        </div>

        {/* Product Selector */}
        <div className="max-w-4xl mx-auto">
          <ProductSelector onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="w-full max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-200"></div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyzing Market Data</h3>
                <p className="text-slate-600">{getLoadingMessage()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {(results.riskAnalysis ||
          results.marketAnalysis ||
          results.stabilityAnalysis ||
          results.smartSuggestions ||
          results.countryComparison) && (
          <div className="max-w-7xl mx-auto">
            <AnalysisResults {...results} currentAnalysisType={currentAnalysisType} allMarketData={results.marketData} />
          </div>
        )}
      </main>
    </div>
  )
}
