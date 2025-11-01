import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

import { MarketPrice } from "./types";

export async function getMarketPrices(hsnCode?: string, countries?: string[]): Promise<MarketPrice[]> {
  if (!hsnCode) {
    return []; // HSN code is always required
  }

  let query;
  if (countries && countries.length > 0) {
    const selectCols = ['hsn_code', ...countries.map(c => `"${c}"`)].join(', ');
    query = supabase.from("market_prices").select(selectCols).eq("hsn_code", hsnCode).maybeSingle();
  } else {
    query = supabase.from("market_prices").select("*").eq("hsn_code", hsnCode).maybeSingle();
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Supabase] Fetch error:", error.message);
    throw new Error(`Failed to fetch market prices: ${error.message}`);
  }
  if (!data) {
    return [];
  }

  const result: MarketPrice[] = [];
  const allCountryKeys = Object.keys(data).filter(key => key !== 'hsn_code');
  const countriesToProcess = countries && countries.length > 0 ? countries : allCountryKeys;

  for (const country of countriesToProcess) {
    const countryData = (data as Record<string, any>)[country];
    if (!countryData) {
      continue;
    }

    for (const [year, value] of Object.entries(countryData)) {
      let price: number | undefined;
      let volume: number = 0;

      if (typeof value === 'object' && value !== null && 'price' in value && 'volume' in value) {
        price = parseFloat(value.price as string);
        volume = parseFloat(value.volume as string);
      } else if (typeof value === 'number' || typeof value === 'string') {
        price = parseFloat(value as string);
      }

      if (price !== undefined && !isNaN(price)) {
        result.push({
          id: uuidv4(),
          hsn_code: String(hsnCode),
          country,
          price,
          volume,
          date: year,
          risk_score: undefined,
          stability_index: undefined,
        });
      } else {
      }
    }
  }
  return result;
}


export async function getHSNCodes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('market_prices')
      .select('hsn_code');

    if (error) {
      console.error('[Supabase] Error fetching HSN codes:', error.message);
      throw new Error(`Failed to fetch HSN codes: ${error.message}`);
    }

    // Extract unique hsn_codes
    const hsnCodes = Array.from(new Set(data.map((item: { hsn_code: string }) => item.hsn_code)));
    return hsnCodes;
  } catch (error) {
    console.error('[Supabase] getHSNCodes function error:', error);
    return [];
  }
}

export async function getCountries(): Promise<string[]> {
  try {
    // Fetch all rows to get all country keys
    const { data, error } = await supabase
      .from('market_prices')
      .select('*')
      .limit(1);

    if (error) {
      console.error('[Supabase] Error fetching countries:', error.message);
      throw new Error(`Failed to fetch countries: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Assuming country names are direct keys in the row, excluding 'hsn_code'
    const firstRow = data[0];
    const countries = Object.keys(firstRow).filter(key => key !== 'hsn_code');
    console.log('[Supabase] Countries fetched:', countries);
    return countries;
  } catch (error) {
    console.error('[Supabase] getCountries function error:', error);
    return [];
  }
} 