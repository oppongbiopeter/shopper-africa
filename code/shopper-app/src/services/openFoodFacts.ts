import { BarcodeLookupResult } from './adminStore';

const OFF_URL = 'https://world.openfoodfacts.org/api/v2/product';

export async function lookupOpenFoodFacts(barcode: string): Promise<BarcodeLookupResult | null> {
  const clean = barcode.replace(/\s/g, '');
  if (!clean || clean.length < 8) return null;
  try {
    const res = await fetch(`${OFF_URL}/${clean}.json`, {
      headers: { 'User-Agent': 'ShopperGhana/1.0 (contact@shopper.gh)' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== 1 || !json.product) return null;
    const p = json.product;
    const name = p.product_name_en || p.product_name || p.generic_name_en || p.generic_name || undefined;
    return {
      barcode: clean,
      name: name ? `${p.brands ? p.brands + ' — ' : ''}${name}`.trim() : undefined,
      brand: p.brands || undefined,
      quantity: p.quantity || undefined,
      imageUrl: p.image_front_small_url || p.image_url || undefined,
      categories: p.categories_tags?.[0]?.replace('en:', '') || p.categories || undefined,
    };
  } catch {
    return null;
  }
}

export async function enrichBarcode(
  barcode: string,
  storeId: string | undefined,
  findLocal: (barcode: string, storeId?: string) => Promise<any[]>
) {
  const local = await findLocal(barcode, storeId);
  if (local.length) return { source: 'local' as const, local };
  const offline = await lookupOpenFoodFacts(barcode);
  if (offline?.name) return { source: 'openfoodfacts' as const, offline };
  return { source: 'none' as const };
}
