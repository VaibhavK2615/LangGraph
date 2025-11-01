"use client"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Globe, Shield, Lightbulb } from 'lucide-react'
import type { RiskAnalysis, MarketAnalysis, StabilityAnalysis, SmartSuggestion, CountryComparison, MarketPrice } from "@/app/lib/types"
import CountryInfoModal, { type CountryDetail } from "@/components/country-info-modal" // Modal component and its type

interface AnalysisResultsProps {
  riskAnalysis?: RiskAnalysis
  marketAnalysis?: MarketAnalysis
  stabilityAnalysis?: StabilityAnalysis
  smartSuggestions?: SmartSuggestion
  countryComparison?: CountryComparison
  currentAnalysisType?: string
  hsnCode?: string;
  allMarketData?: MarketPrice[]; // Pass the full raw market data
}

export default function AnalysisResults({
  riskAnalysis,
  marketAnalysis,
  stabilityAnalysis,
  smartSuggestions,
  countryComparison,
  currentAnalysisType,
  hsnCode,
  allMarketData, // Receive the full raw market data
}: AnalysisResultsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountryInfo, setSelectedCountryInfo] = useState<CountryDetail | null>(null);

  const handleCountryClick = (countryName: string) => {

    // Filter the allMarketData to get historical prices and volumes for the specific country
    const historicalDataForCountry = allMarketData?.filter(item => item.country?.toUpperCase() === countryName.toUpperCase()) || [];

    console.log(`[AnalysisResults] Available countries in market data:`, allMarketData?.map(item => item.country));

    // Construct the CountryDetail object, combining data from all available analyses
    const countryDetail: CountryDetail = {
      name: countryName,
      hsn_code: hsnCode,
      historicalMarketPrices: historicalDataForCountry,
      // Market Analysis data
      marketMargin: marketAnalysis?.best_markets.find(m => m.country?.toUpperCase() === countryName.toUpperCase())?.margin,
      marketPotential: marketAnalysis?.best_markets.find(m => m.country?.toUpperCase() === countryName.toUpperCase())?.potential,
      // Stability Analysis data
      stabilityIndex: stabilityAnalysis?.partners.find(p => p.country?.toUpperCase() === countryName.toUpperCase())?.stability_index,
      reliability: stabilityAnalysis?.partners.find(p => p.country?.toUpperCase() === countryName.toUpperCase())?.reliability,
      // Country Comparison data
      comparisonPrice: countryComparison?.countries.find(c => c.name?.toUpperCase() === countryName.toUpperCase())?.metrics.price,
      comparisonVolume: countryComparison?.countries.find(c => c.name?.toUpperCase() === countryName.toUpperCase())?.metrics.volume,
      comparisonRisk: countryComparison?.countries.find(c => c.name?.toUpperCase() === countryName.toUpperCase())?.metrics.risk,
      comparisonStability: countryComparison?.countries.find(c => c.name?.toUpperCase() === countryName.toUpperCase())?.metrics.stability,
    };

    setSelectedCountryInfo(countryDetail);
    setIsModalOpen(true);
  };

  const getDefaultTab = () => {
    if (currentAnalysisType === "risk" && riskAnalysis) return "risk"
    if (currentAnalysisType === "market" && marketAnalysis) return "market"
    if (currentAnalysisType === "stability" && stabilityAnalysis) return "stability"
    if (currentAnalysisType === "suggestions" && smartSuggestions) return "suggestions"
    if (currentAnalysisType === "comparison" && countryComparison) return "comparison"
    return "risk"
  }

  const tabVisibilityMap: Record<string, string[]> = {
    risk: ["risk", "market", "stability"],
    market: ["market", "stability", "suggestions"],
    stability: ["stability", "market"],
    suggestions: ["suggestions"],
    comparison: ["comparison"],
  }

  const visibleTabs = tabVisibilityMap[currentAnalysisType ?? "risk"] || ["risk"]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Analysis Results
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Comprehensive market insights and recommendations based on your analysis
        </p>
      </div>

      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <Tabs defaultValue={getDefaultTab()} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              {visibleTabs.includes("risk") && (
                <TabsTrigger 
                  value="risk" 
                  disabled={!riskAnalysis}
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg disabled:opacity-50 border border-slate-200"
                >
                  <Shield className="h-4 w-4" />
                  Risk Analysis
                </TabsTrigger>
              )}
              {visibleTabs.includes("market") && (
                <TabsTrigger 
                  value="market" 
                  disabled={!marketAnalysis}
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg disabled:opacity-50 border border-slate-200"
                >
                  <TrendingUp className="h-4 w-4" />
                  Best Markets
                </TabsTrigger>
              )}
              {visibleTabs.includes("stability") && (
                <TabsTrigger 
                  value="stability" 
                  disabled={!stabilityAnalysis}
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg disabled:opacity-50 border border-slate-200"
                >
                  <Target className="h-4 w-4" />
                  Stable Partners
                </TabsTrigger>
              )}
              {visibleTabs.includes("suggestions") && (
                <TabsTrigger 
                  value="suggestions" 
                  disabled={!smartSuggestions}
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg disabled:opacity-50 border border-slate-200"
                >
                  <Lightbulb className="h-4 w-4" />
                  Smart Suggestions
                </TabsTrigger>
              )}
              {visibleTabs.includes("comparison") && (
                <TabsTrigger 
                  value="comparison" 
                  disabled={!countryComparison}
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg disabled:opacity-50 border border-slate-200"
                >
                  <Globe className="h-4 w-4" />
                  Country Comparison
                </TabsTrigger>
              )}
              </TabsList>
            </div>
            {visibleTabs.includes("risk") && (
              <TabsContent value="risk" className="space-y-4 mt-6">
                {riskAnalysis && (
                  <>
                    <Card>
                      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                        <AlertTriangle className="h-4 w-4 ml-auto" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{riskAnalysis.risk_score?.toFixed(2)}/100</div>
                        <p className="text-xs text-muted-foreground">
                          {riskAnalysis.risk_score > 70
                            ? "High Risk"
                            : riskAnalysis.risk_score > 40
                              ? "Medium Risk"
                              : "Low Risk"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {riskAnalysis.risk_factors.map((factor, index) => (
                            <Badge key={index} variant="outline">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={riskAnalysis.chart_data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number, name: string) => {
                                if (name === "risk") {
                                  return [value.toFixed(2), "Risk"];
                                }
                                return [value, name];
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="risk"
                              stroke="#ef4444"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Historical Price & Volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={riskAnalysis.chart_data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Bar yAxisId="left" dataKey="price" fill="#3b82f6" name="Price" />
                            <Bar yAxisId="right" dataKey="volume" fill="#a855f7" name="Volume" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{riskAnalysis.summary}</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            )}
            {visibleTabs.includes("market") && (
              <TabsContent value="market" className="space-y-4 mt-6">
                {marketAnalysis && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Best Markets by Margin</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={marketAnalysis.chart_data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="country" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="margin" fill="#22c55e" barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {marketAnalysis.best_markets.map((market, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 group"
                          onClick={() => handleCountryClick(market.country)}
                        >
                          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold text-slate-900">{market.country}</CardTitle>
                                <p className="text-sm text-slate-600">Best Market</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-3xl font-bold text-green-600">{market.margin?.toFixed(2)}%</span>
                              <span className="text-sm text-slate-600">margin</span>
                            </div>
                            <p className="text-sm text-slate-600 bg-white/60 p-2 rounded-lg">{market.potential}</p>
                            <div className="mt-3 flex items-center text-xs text-green-600 font-medium">
                              <span>Click for details →</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>
            )}
            {visibleTabs.includes("stability") && (
              <TabsContent value="stability" className="space-y-4 mt-6">
                {stabilityAnalysis && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stabilityAnalysis.partners.map((partner, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 group"
                          onClick={() => handleCountryClick(partner.country)}
                        >
                          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Target className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold text-slate-900">{partner.country}</CardTitle>
                                <p className="text-sm text-slate-600">Stable Partner</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-3xl font-bold text-blue-600">{partner.stability_index?.toFixed(2)}/100</span>
                              <span className="text-sm text-slate-600">stability</span>
                            </div>
                            <p className="text-sm text-slate-600 bg-white/60 p-2 rounded-lg">{partner.reliability}</p>
                            <div className="mt-3 flex items-center text-xs text-blue-600 font-medium">
                              <span>Click for details →</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Stability Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{stabilityAnalysis.summary}</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            )}
            {visibleTabs.includes("suggestions") && (
              <TabsContent value="suggestions" className="space-y-4 mt-6">
                {smartSuggestions && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Expand Markets</CardTitle>
                          <TrendingUp className="h-4 w-4 ml-auto text-green-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {smartSuggestions.expand_markets.map((market, index) => (
                              <Badge
                                key={index}
                                variant="default"
                                className="bg-green-100 text-green-800 mx-1 cursor-pointer hover:bg-green-200 transition-colors"
                                onClick={() => handleCountryClick(market)}
                              >
                                {market}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Reduce Exposure</CardTitle>
                          <TrendingDown className="h-4 w-4 ml-auto text-red-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {smartSuggestions.reduce_exposure.map((market, index) => (
                              <Badge
                                key={index}
                                variant="destructive"
                                className="mx-1 cursor-pointer hover:bg-red-700 transition-colors"
                                onClick={() => handleCountryClick(market)}
                              >
                                {market}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Reasoning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{smartSuggestions.reasoning}</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            )}
            {visibleTabs.includes("comparison") && (
              <TabsContent value="comparison" className="space-y-4 mt-6">
                {countryComparison && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {countryComparison.countries.map((country, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 group"
                          onClick={() => handleCountryClick(country.name)}
                        >
                          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Globe className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold text-slate-900">{country.name}</CardTitle>
                                <p className="text-sm text-slate-600">Country Comparison</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/60 p-3 rounded-lg">
                                <div className="text-xs text-slate-600 mb-1">Price</div>
                                <div className="text-lg font-bold text-slate-900">${country.metrics.price?.toFixed(2)}</div>
                              </div>
                              <div className="bg-white/60 p-3 rounded-lg">
                                <div className="text-xs text-slate-600 mb-1">Volume</div>
                                <div className="text-lg font-bold text-slate-900">{country.metrics.volume}</div>
                              </div>
                              <div className="bg-white/60 p-3 rounded-lg">
                                <div className="text-xs text-slate-600 mb-1">Risk</div>
                                <div className="text-lg font-bold text-red-600">{country.metrics.risk?.toFixed(2)}/100</div>
                              </div>
                              <div className="bg-white/60 p-3 rounded-lg">
                                <div className="text-xs text-slate-600 mb-1">Stability</div>
                                <div className="text-lg font-bold text-green-600">{country.metrics.stability?.toFixed(2)}/100</div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center text-xs text-purple-600 font-medium">
                              <span>Click for details →</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommendation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{countryComparison.recommendation}</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Country Info Modal */}
      <CountryInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        country={selectedCountryInfo}
      />
    </div>
  )
}
