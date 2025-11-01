export interface MarketPrice {
  id: string
  hsn_code: string
  country: string
  price: number
  volume: number
  date: string
  risk_score?: number
  stability_index?: number
}

export interface RiskAnalysis {
  risk_score: number
  risk_factors: string[]
  summary: string
  chart_data: Array<{
    month: string
    risk: number
    volume: number
    price: number
  }>
}

export interface MarketAnalysis {
  best_markets: Array<{
    country: string
    margin: number
    potential: string
  }>
  chart_data: Array<{
    country: string
    margin: number
    volume: number
  }>
}

export interface StabilityAnalysis {
  partners: Array<{
    country: string
    stability_index: number
    reliability: string
  }>
  summary: string
}

export interface SmartSuggestion {
  expand_markets: string[]
  reduce_exposure: string[]
  reasoning: string
}

export interface CountryComparison {
  countries: Array<{
    name: string
    metrics: {
      price: number
      volume: number
      risk: number
      stability: number
    }
  }>
  recommendation: string
}
