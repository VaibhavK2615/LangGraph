import { NextResponse } from "next/server"
import { getHSNCodes } from "@/app/lib/supabase"

export async function GET() {
  try {
    //Get HSN codes
    const hsnCodes = await getHSNCodes()
    return NextResponse.json({
      success: true,
      data: hsnCodes,
    })
  } catch (error) {
    console.error("HSN codes API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch HSN codes",
        data: [],
      },
      { status: 500 },
    )
  }
}
