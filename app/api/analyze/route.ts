import { type NextRequest, NextResponse } from "next/server"
import { createAnalysisGraph } from "@/app/lib/langgraph-config"
import type { AnalysisState } from "@/app/lib/langgraph-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { analysis_type, hsn_code, country, countries } = body

    if (!hsn_code) {
      return NextResponse.json({ error: "HSN code is required" }, { status: 400 })
    }

    if (!analysis_type) {
      return NextResponse.json({ error: "Analysis type is required" }, { status: 400 })
    }

    // Validate specific requirements for each analysis type
    if (analysis_type === "risk" && !country) {
      return NextResponse.json({ error: "Country is required for risk analysis" }, { status: 400 })
    }

    if (analysis_type === "comparison" && (!countries || countries.length === 0)) {
      return NextResponse.json({ error: "Countries are required for comparison analysis" }, { status: 400 })
    }

    // Create the analysis graph
    const graph = createAnalysisGraph()

    // Initial state - ensure all fields are explicitly set
    const initialState: AnalysisState = {
      hsn_code: hsn_code || "",
      country: country || undefined,
      countries: countries || undefined,
      analysis_type: analysis_type || "",
      market_data: [],
      risk_analysis: undefined,
      market_analysis: undefined,
      stability_analysis: undefined,
      smart_suggestions: undefined,
      country_comparison: undefined,
      error: undefined,
    }

    // Run the analysis
    const result = await graph.invoke(initialState)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        risk_analysis: result.risk_analysis,
        market_analysis: result.market_analysis,
        stability_analysis: result.stability_analysis,
        smart_suggestions: result.smart_suggestions,
        country_comparison: result.country_comparison,
        market_data: result.market_data, // Include the raw market data
      },
    })
  } catch (error: unknown) {
    console.error("Analysis API error:", error);

    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error";

    return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
