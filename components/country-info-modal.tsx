import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Globe, TrendingUp, Target, AlertTriangle, Shield } from "lucide-react"
import type { MarketPrice } from "@/app/lib/types" // Import MarketPrice type

// Define a type for the detailed country information to be displayed in the modal
export interface CountryDetail {
  name: string;
  hsn_code?: string;

  // From MarketAnalysis
  marketMargin?: number;
  marketPotential?: string;

  // From StabilityAnalysis
  stabilityIndex?: number;
  reliability?: string;

  // From CountryComparison
  comparisonPrice?: number;
  comparisonVolume?: number;
  comparisonRisk?: number;
  comparisonStability?: number;

  // Historical data for charts and raw display
  historicalMarketPrices?: MarketPrice[];
}

interface CountryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: CountryDetail | null;
}

export default function CountryInfoModal({ isOpen, onClose, country }: CountryInfoModalProps) {
  if (!country) {
    return null; // Don't render if no country data is provided
  }

  // Prepare data for charts
  const chartData = country.historicalMarketPrices?.sort((a, b) => {
    const dateA = new Date(a.date || '0');
    const dateB = new Date(b.date || '0');
    return dateA.getTime() - dateB.getTime();
  }).map(item => ({
    date: item.date,
    price: item.price,
    volume: item.volume,
  })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {country.name} Analysis
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-2">
            Comprehensive market insights and historical data for {country.name}
            {country.hsn_code && <span className="block text-sm text-slate-500 mt-1">HSN Code: {country.hsn_code}</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Debug Information - Remove this in production */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-sm">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <p><strong>Country:</strong> {country.name}</p>
                <p><strong>HSN Code:</strong> {country.hsn_code}</p>
                <p><strong>Historical Data Count:</strong> {country.historicalMarketPrices?.length || 0}</p>
                <p><strong>Raw Historical Data:</strong></p>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                  {JSON.stringify(country.historicalMarketPrices, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Summary Metrics */}
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {country.marketMargin !== undefined && (
                  <div className="bg-white/80 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Market Margin</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{country.marketMargin?.toFixed(2)}%</div>
                  </div>
                )}
                {country.stabilityIndex !== undefined && (
                  <div className="bg-white/80 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Stability Index</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{country.stabilityIndex?.toFixed(2)}/100</div>
                  </div>
                )}
                {country.comparisonPrice !== undefined && (
                  <div className="bg-white/80 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Price</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">${country.comparisonPrice?.toFixed(2)}</div>
                  </div>
                )}
                {country.comparisonVolume !== undefined && (
                  <div className="bg-white/80 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-700">Volume</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{country.comparisonVolume}</div>
                  </div>
                )}
                {country.comparisonRisk !== undefined && (
                  <div className="bg-white/80 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Risk Score</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{country.comparisonRisk?.toFixed(2)}/100</div>
                  </div>
                )}
                {country.comparisonStability !== undefined && (
                  <div className="bg-white/80 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Stability</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{country.comparisonStability?.toFixed(2)}/100</div>
                  </div>
                )}
              </div>
              {(country.marketPotential || country.reliability) && (
                <div className="mt-6 space-y-3">
                  {country.marketPotential && (
                    <div className="bg-white/60 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Market Potential</h4>
                      <p className="text-sm text-slate-600">{country.marketPotential}</p>
                    </div>
                  )}
                  {country.reliability && (
                    <div className="bg-white/60 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Reliability Assessment</h4>
                      <p className="text-sm text-slate-600">{country.reliability}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historical Price Chart */}
          {chartData.length > 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  Historical Price Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      name="Price ($)"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}


          {/* Raw Historical Data */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Historical Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {country.historicalMarketPrices && country.historicalMarketPrices.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="py-3 px-4 text-left font-semibold text-slate-700">Date</th>
                          <th className="py-3 px-4 text-left font-semibold text-slate-700">Price</th>
                          <th className="py-3 px-4 text-left font-semibold text-slate-700">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {country.historicalMarketPrices.map((item, index) => (
                          <tr key={index} className="hover:bg-white/50 transition-colors">
                            <td className="py-3 px-4 text-slate-600">{item.date}</td>
                            <td className="py-3 px-4 font-medium text-green-600">${item.price?.toFixed(2)}</td>
                            <td className="py-3 px-4 text-slate-600">{item.volume.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Historical Data Available</h3>
                  <p className="text-slate-600 mb-4">No historical data found for {country.name}</p>
                  <div className="bg-slate-50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-slate-600 mb-2">This could be due to:</p>
                    <ul className="text-sm text-slate-600 text-left space-y-1">
                      <li>• No market data found for this country</li>
                      <li>• Country name mismatch in the database</li>
                      <li>• Data not yet loaded</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
