import { StateGraph, END, START } from "@langchain/langgraph"
import Groq from "groq-sdk"
import { Client } from "langsmith"
import { getMarketPrices } from "./supabase"
import type {
  MarketPrice,
  RiskAnalysis,
  MarketAnalysis,
  StabilityAnalysis,
  SmartSuggestion,
  CountryComparison,
} from "./types"

// Initialize LangSmith client
export const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
})

// Initialize Groq client
export const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
})

// State interface for the graph
export interface AnalysisState {
  hsn_code: string
  country?: string
  countries?: string[]
  market_data: MarketPrice[]
  risk_analysis?: RiskAnalysis
  market_analysis?: MarketAnalysis
  stability_analysis?: StabilityAnalysis
  smart_suggestions?: SmartSuggestion
  country_comparison?: CountryComparison
  analysis_type: string // Can be "risk", "market", "stability", "suggestions", "comparison", or "all"
  error?: string
}

// Helper function to summarize market data
interface SummarizedCountryData {
  country: string;
  averagePrice: number;
  averageVolume: number;
  latestPrice?: number;
  latestVolume?: number;
  dataPoints: number;
}

function summarizeMarketData(data: MarketPrice[]): SummarizedCountryData[] {
  const countryMap = new Map<string, { prices: number[], volumes: number[], dates: string[] }>();

  for (const item of data) {
    if (!countryMap.has(item.country)) {
      countryMap.set(item.country, { prices: [], volumes: [], dates: [] });
    }
    const countryData = countryMap.get(item.country)!;
    countryData.prices.push(item.price);
    countryData.volumes.push(item.volume);
    countryData.dates.push(item.date || ''); // Store dates to find latest
  }

  const summarized: SummarizedCountryData[] = [];
  for (const [country, { prices, volumes, dates }] of countryMap.entries()) {
    const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const averageVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;

    // Find latest data point by date
    let latestPrice: number | undefined;
    let latestVolume: number | undefined;
    if (dates.length > 0) {
      const sortedDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const latestDate = sortedDates[0];
      const latestItem = data.find(item => item.country === country && item.date === latestDate);
      latestPrice = latestItem?.price;
      latestVolume = latestItem?.volume;
    }

    summarized.push({
      country,
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      averageVolume: parseFloat(averageVolume.toFixed(2)),
      latestPrice,
      latestVolume,
      dataPoints: prices.length,
    });
  }
  return summarized;
}


// Node functions
export async function fetchMarketData(state: AnalysisState): Promise<Partial<AnalysisState>> {
  try {
    const data = await getMarketPrices(state.hsn_code);
    return { market_data: data };
  } catch (error) {
    console.error("[LangGraph] Error in fetchMarketData:", error);
    return { error: `Failed to fetch market data: ${error}` };
  }
}

export async function performRiskAnalysis(state: AnalysisState): Promise<Partial<AnalysisState>> {
  try {
    // Filter market_data for the specific country for risk analysis
    const countrySpecificData = state.market_data.filter(item => item.country === state.country);

    const prompt = `
    Analyze the risk factors for HSN code ${state.hsn_code} in ${state.country} based on the following market data:
    ${JSON.stringify(countrySpecificData)}
    ONLY RETURN JSON. DO NOT include any explanation, markdown, or commentary.
    Provide a comprehensive risk analysis including:
    1. Overall risk score (0-100)
    2. Key risk factors
    3. Summary of findings
    Strictly Format your response as JSON with the structure:
    {
      "risk_score": number,
      "risk_factors": string[],
      "summary": string
    }
    `;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile"
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Model returned empty content");
    }
    const analysis = extractJson(content);
    // Generate chart data from country-specific market data
    const chartData = countrySpecificData
      .slice()
      .sort((a, b) => {
        const yearA = parseInt(a.date?.split("-")[0]);
        const yearB = parseInt(b.date?.split("-")[0]);
        return yearA - yearB;
      })
      .map((item) => ({
        month: item.date,
        risk: Math.random() * 100,
        volume: item.volume,
        price: item.price
      }));
    return {
      risk_analysis: {
        ...analysis,
        chart_data: chartData,
      },
    };
  } catch (error) {
    return { error: `Risk analysis failed: ${error}` };
  }
}

function extractJson(content: string): any {
  // Try to find JSON wrapped in triple backticks
  const tripleBacktickMatch = content.match(/\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`/i);
  let jsonString = tripleBacktickMatch?.[1];

  if (!jsonString) {
    // If not found in backticks, try to find the first '{' and last '}'
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = content.substring(firstBrace, lastBrace + 1);
    }
  }

  if (!jsonString) {
    throw new Error("No valid JSON structure found in model response");
  }

  try {
    return JSON.parse(jsonString.trim());
  } catch (parseError: any) {
    // Log the problematic string and the original error for debugging
    console.error("Failed to parse JSON. Problematic string:", jsonString);
    console.error("Original parsing error:", parseError);
    throw new Error(`Failed to parse JSON from model: ${parseError.message}. Content: ${jsonString.substring(0, 200)}...`);
  }
}

export async function findBestMarkets(state: AnalysisState): Promise<Partial<AnalysisState>> {
  try {
    const summarizedData = summarizeMarketData(state.market_data);
    const prompt = `
    Analyze the best markets for HSN code ${state.hsn_code} based on the following summarized market data:
    ${JSON.stringify(summarizedData)}
    ONLY RETURN JSON. DO NOT include any explanation, markdown, or commentary.
    Identify the top 5 markets with highest profit margins and growth potential. Consider average price, average volume, and number of data points as indicators.
    Strictly Format as JSON:
    {
      "best_markets": [
        {
          "country": string,
          "margin": number,
          "potential": string
        }
      ]
    }
    `;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile"
    });
    const content = response.choices[0]?.message?.content || "";
    const analysis = extractJson(content);
    const chartData = analysis.best_markets?.map((market: any) => ({
      country: market.country,
      margin: market.margin,
      volume: state.market_data.find((d) => d.country === market.country)?.volume || 0,
    })) || [];
    return {
      market_analysis: {
        ...analysis,
        chart_data: chartData,
      },
    };
  } catch (error) {
    console.error("[LangGraph] Error in findBestMarkets:", error);
    return { error: `Market analysis failed: ${error}` };
  }
}

export async function analyzeStablePartners(state: AnalysisState): Promise<Partial<AnalysisState>> {
  try {
    const summarizedData = summarizeMarketData(state.market_data);
    const prompt = `
    Analyze partner stability for HSN code ${state.hsn_code} based on the following summarized market data:
    ${JSON.stringify(summarizedData)}
    ONLY RETURN JSON. DO NOT include any explanation, markdown, or commentary.
    Evaluate trading partners based on:
    1. Price stability (e.g., low variance in average price)
    2. Volume consistency (e.g., consistent average volume)
    3. Market reliability (overall assessment based on available data)
    Strictly Format as JSON:
    {
      "partners": [
        {
          "country": string,
          "stability_index": number,
          "reliability": string
        }
      ],
      "summary": string
    }
    `;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile"
    });
    const content = response.choices[0]?.message?.content ?? "";
    const analysis = extractJson(content);
    
    // Filter out countries with stability index of 0.00
    if (analysis && analysis.partners && Array.isArray(analysis.partners)) {
      const originalCount = analysis.partners.length;
      analysis.partners = analysis.partners.filter((partner: any) => 
        partner.stability_index && partner.stability_index > 0
      );
      const filteredCount = analysis.partners.length;
    }
    
    return { stability_analysis: analysis };
  } catch (error) {
    console.error("[LangGraph] Error in analyzeStablePartners:", error);
    return { error: `Stability analysis failed: ${error}` };
  }
}

export async function generateSmartSuggestions(state: AnalysisState): Promise<Partial<AnalysisState>> {
  try {
    const summarizedData = summarizeMarketData(state.market_data);
    const prompt = `
    Based on the following summarized market data for HSN code ${state.hsn_code}, provide smart trading suggestions:
    ${JSON.stringify(summarizedData)}
    ONLY RETURN JSON. DO NOT include any explanation, markdown, or commentary.
          Analyze the data and suggest:
    1. Markets to expand into (based on growth potential, high average margins, and consistent volume)
    2. Markets to reduce exposure (based on potential risk, declining trends, or low average margins)
    3. Reasoning for recommendations
    Format as JSON:
    {
      "expand_markets": string[],
      "reduce_exposure": string[],
      "reasoning": string
    }
    `;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile"
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Model returned empty content");
    }
    const suggestions = extractJson(content);
    return { smart_suggestions: suggestions };
  } catch (error) {
    console.error("[LangGraph] Error in generateSmartSuggestions:", error);
    return { error: `Smart suggestions failed: ${error}` };
  }
}

export async function compareCountries(state: AnalysisState): Promise<Partial<AnalysisState>> {
  try {
    const summarizedData = summarizeMarketData(state.market_data);
    // Filter summarized data to only include the countries being compared
    const filteredSummarizedData = summarizedData.filter(s => state.countries?.includes(s.country));

    const prompt = `
      Compare the following countries for HSN code ${state.hsn_code} based on their summarized market metrics:
      Countries to compare: ${state.countries?.join(", ")}
      Summarized market data:
      ${JSON.stringify(filteredSummarizedData, null, 2)}
      For each country, provide average price, average volume, and an estimated risk (0-100) and stability (0-100) based on the provided data.
      ONLY RETURN JSON. DO NOT include any explanation, markdown, or commentary.
      Strictly respond in this format:
      {
        "countries": [
          {
            "name": "COUNTRY_NAME",
            "metrics": {
              "price": 0, // Use averagePrice from summarized data
              "volume": 0, // Use averageVolume from summarized data
              "risk": 0, // Estimate based on data
              "stability": 0 // Estimate based on data
            }
          }
        ],
        "recommendation": "Your one-line recommendation"
      }
      `;
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile"
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Model returned empty content");
    }
    const comparison = extractJson(content);
    return { country_comparison: comparison };
  } catch (error) {
    console.error("[LangGraph] Error in compareCountries:", error);
    return { error: `Country comparison failed: ${error}` };
  }
}

// Evaluator function
export async function evaluateResults(state: AnalysisState): Promise<Partial<AnalysisState>> {
  try {
    const prompt = `
    Evaluate the quality and completeness of the analysis results:
    ${JSON.stringify({
      risk_analysis: state.risk_analysis,
      market_analysis: state.market_analysis,
      stability_analysis: state.stability_analysis,
      smart_suggestions: state.smart_suggestions,
      country_comparison: state.country_comparison,
    })}
          Provide a quality score (0-100) and suggestions for improvement.
    `
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile"
    })
    return state
  } catch (error) {
    console.error("[LangGraph] Evaluation failed:", error)
    return state
  }
}

export function createAnalysisGraph() {
  const workflow = new StateGraph<AnalysisState>({
    channels: {
      hsn_code: null,
      country: null,
      countries: null,
      market_data: null,
      risk_analysis: null,
      market_analysis: null,
      stability_analysis: null,
      smart_suggestions: null,
      country_comparison: null,
      analysis_type: null,
      error: null,
    },
  })
    .addNode("fetch_data", fetchMarketData)
    .addNode("do_risk_analysis", performRiskAnalysis)
    .addNode("do_market_analysis", findBestMarkets)
    .addNode("do_stability_analysis", analyzeStablePartners)
    .addNode("do_smart_suggestions", generateSmartSuggestions)
    .addNode("do_country_comparison", compareCountries)
    .addNode("evaluator", evaluateResults)
    .addEdge(START, "fetch_data")
    .addConditionalEdges("fetch_data", (state) => {
      if (state.error) {
        return "evaluator"; // If data fetch fails, go to evaluator
      }
      switch (state.analysis_type) {
        case "risk":
          return ["do_risk_analysis", "do_market_analysis", "do_stability_analysis"]; // Parallel execution for risk analysis
        case "market":
          return ["do_market_analysis", "do_stability_analysis", "do_smart_suggestions"]; // Parallel execution for best markets
        case "stability":
          return ["do_stability_analysis", "do_market_analysis"]; // Parallel execution for stable partners
        case "suggestions":
          return "do_smart_suggestions";
        case "comparison":
          return "do_country_comparison";
        default:
          return "evaluator"; // Fallback for unknown analysis types
      }
    })
    .addEdge("do_risk_analysis", "evaluator")
    .addEdge("do_market_analysis", "evaluator")
    .addEdge("do_stability_analysis", "evaluator")
    .addEdge("do_smart_suggestions", "evaluator")
    .addEdge("do_country_comparison", "evaluator")
    .addEdge("evaluator", END)
  return workflow.compile()
}
