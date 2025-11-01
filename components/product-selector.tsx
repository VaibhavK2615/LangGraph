"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, TrendingUp, Shield, Target, Lightbulb, Globe } from "lucide-react"

interface ProductSelectorProps {
  onAnalyze: (analysisType: string, inputs: any) => void
  loading: boolean
}

export default function ProductSelector({ onAnalyze, loading }: ProductSelectorProps) {
  // Risk Analysis inputs
  const [riskHsn, setRiskHsn] = useState("")
  const [riskCountry, setRiskCountry] = useState("")

  // Best Market inputs
  const [marketHsn, setMarketHsn] = useState("")
  const [selectedTab, setSelectedTab] = useState("risk");


  // Stable Partners inputs
  const [partnersHsn, setPartnersHsn] = useState("")

  // Smart Suggestion inputs
  const [suggestionHsn, setSuggestionHsn] = useState("")

  // Country Comparison inputs
  const [comparisonHsn, setComparisonHsn] = useState("")
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([])
  const [newCountry, setNewCountry] = useState("")

  const addCountry = () => {
    if (newCountry.trim() && !comparisonCountries.includes(newCountry.trim())) {
      setComparisonCountries([...comparisonCountries, newCountry.trim()])
      setNewCountry("")
    }
  }

  const removeCountry = (country: string) => {
    setComparisonCountries(comparisonCountries.filter((c) => c !== country))
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action()
    }
  }

  const handleAnalyze = (analysisType: string) => {
    let inputs: any = {}

    switch (analysisType) {
      case "risk":
        if (!riskHsn || !riskCountry) return
        inputs = { hsn_code: riskHsn, country: riskCountry }
        break
      case "market":
        if (!marketHsn) return
        inputs = { hsn_code: marketHsn }
        break
      case "stability":
        if (!partnersHsn) return
        inputs = { hsn_code: partnersHsn }
        break
      case "suggestions":
        if (!suggestionHsn) return
        inputs = { hsn_code: suggestionHsn }
        break
      case "comparison":
        if (!comparisonHsn || comparisonCountries.length === 0) return
        inputs = { hsn_code: comparisonHsn, countries: comparisonCountries }
        break
      default:
        return
    }

    onAnalyze(analysisType, inputs)
  }

  return (
    <Card className="w-full max-w-5xl mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Choose Your Analysis
        </CardTitle>
        <p className="text-slate-600 mt-2">Select the type of market analysis you'd like to perform</p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Tabs
          value={selectedTab}
          onValueChange={(newTab) => {
            setSelectedTab(newTab);
            
            // Reset form data on tab switch
            setRiskHsn("");
            setRiskCountry("");
            setMarketHsn("");
            setPartnersHsn("");
            setSuggestionHsn("");
            setComparisonHsn("");
            setComparisonCountries([]);
          }}
        >
          <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger 
              value="risk" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Risk Analysis</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger 
              value="market" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Best Market</span>
              <span className="sm:hidden">Markets</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stability" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Stable Partners</span>
              <span className="sm:hidden">Partners</span>
            </TabsTrigger>
            <TabsTrigger 
              value="suggestions" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Smart Suggestions</span>
              <span className="sm:hidden">Suggestions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Country Comparison</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="risk" className="space-y-6 mt-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Risk Analysis</h3>
                  <p className="text-sm text-slate-600">Assess market risks and volatility</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="risk-hsn" className="text-sm font-medium text-slate-700">HSN Code *</Label>
                  <Input
                    id="risk-hsn"
                    placeholder="Enter HSN Code (e.g., 690100)"
                    value={riskHsn}
                    onChange={(e) => setRiskHsn(e.target.value)}
                    className="border-slate-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk-country" className="text-sm font-medium text-slate-700">Country *</Label>
                  <Input
                    id="risk-country"
                    placeholder="Enter Country (e.g., AUSTRALIA)"
                    value={riskCountry}
                    className="uppercase border-slate-300 focus:border-red-500 focus:ring-red-500"
                    onChange={(e) => setRiskCountry(e.target.value.toUpperCase())}
                  />
                </div>
                <Button
                  onClick={() => handleAnalyze("risk")}
                  disabled={!riskHsn || !riskCountry || loading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing Risk..." : "Analyze Risk"}
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Risk score and assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Risk trend charts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Key risk factors identification
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  Comprehensive risk summary
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6 mt-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Best Markets</h3>
                  <p className="text-sm text-slate-600">Discover high-potential markets</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="market-hsn" className="text-sm font-medium text-slate-700">HSN Code *</Label>
                  <Input
                    id="market-hsn"
                    placeholder="Enter HSN Code (e.g., 690100)"
                    value={marketHsn}
                    onChange={(e) => setMarketHsn(e.target.value)}
                    className="border-slate-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <Button
                  onClick={() => handleAnalyze("market")}
                  disabled={!marketHsn || loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Finding Best Markets..." : "Find Best Markets"}
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Top markets with highest margins
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Margin comparison charts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Growth potential assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Market opportunity insights
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="stability" className="space-y-6 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Stable Partners</h3>
                  <p className="text-sm text-slate-600">Find reliable trading partners</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partners-hsn" className="text-sm font-medium text-slate-700">HSN Code *</Label>
                  <Input
                    id="partners-hsn"
                    placeholder="Enter HSN Code (e.g., 690100)"
                    value={partnersHsn}
                    onChange={(e) => setPartnersHsn(e.target.value)}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={() => handleAnalyze("stability")}
                  disabled={!partnersHsn || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing Partners..." : "Analyze Stable Partners"}
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Partner stability index
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Reliability assessment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Trading consistency metrics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Partner recommendations
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6 mt-8">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Smart Suggestions</h3>
                  <p className="text-sm text-slate-600">Get AI-powered trading insights</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="suggestion-hsn" className="text-sm font-medium text-slate-700">HSN Code *</Label>
                  <Input
                    id="suggestion-hsn"
                    placeholder="Enter HSN Code (e.g., 690100)"
                    value={suggestionHsn}
                    onChange={(e) => setSuggestionHsn(e.target.value)}
                    className="border-slate-300 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
                <Button
                  onClick={() => handleAnalyze("suggestions")}
                  disabled={!suggestionHsn || loading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Generating Suggestions..." : "Get Smart Suggestions"}
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  Markets to expand trade
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  Markets to reduce exposure
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  Strategic recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  AI-powered insights
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6 mt-8">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Country Comparison</h3>
                  <p className="text-sm text-slate-600">Compare multiple countries side-by-side</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comparison-hsn" className="text-sm font-medium text-slate-700">HSN Code *</Label>
                  <Input
                    id="comparison-hsn"
                    placeholder="Enter HSN Code (e.g., 690100)"
                    value={comparisonHsn}
                    onChange={(e) => setComparisonHsn(e.target.value)}
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-country" className="text-sm font-medium text-slate-700">Add Countries for Comparison *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-country"
                      placeholder="Enter Country (e.g., AUSTRALIA)"
                      value={newCountry}
                      className="uppercase border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                      onChange={(e) => setNewCountry(e.target.value.toUpperCase())}
                      onKeyPress={(e) => handleKeyPress(e, addCountry)}
                    />
                    <Button 
                      type="button" 
                      onClick={addCountry} 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                {comparisonCountries.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Countries to Compare:</Label>
                    <div className="flex flex-wrap gap-2">
                      {comparisonCountries.map((country) => (
                        <Badge key={country} variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
                          {country}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeCountry(country)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => handleAnalyze("comparison")}
                  disabled={!comparisonHsn || comparisonCountries.length === 0 || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Comparing Countries..." : "Compare Countries"}
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Side-by-side country metrics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Price, volume, and risk comparison
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Stability index comparison
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Detailed recommendations
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
