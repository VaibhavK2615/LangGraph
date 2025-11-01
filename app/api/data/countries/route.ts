import { NextResponse } from "next/server"
import { getCountries } from "@/app/lib/supabase"

export async function GET() {
  try {
    //Get countries
    const countries = await getCountries()
    return NextResponse.json({
      success: true,
      data: countries,
    })
  } catch (error) {
    console.error("Countries API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch countries",
        data: [],
      },
      { status: 500 },
    )
  }
}
