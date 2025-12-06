// Helper function to get pricing benchmarks for a category
export async function getPricingBenchmark(
  category: string,
  monetizationModel: string
): Promise<{ min: number; max: number; average: number; common: string }> {
  // Placeholder implementation
  // In production: Search for pricing data or use a pricing database
  // For now, return default ranges based on category
  const defaults: Record<string, { min: number; max: number; average: number; common: string }> = {
    "B2B/SaaS": { min: 29, max: 299, average: 99, common: "$49-99/month" },
    "B2C app": { min: 4.99, max: 19.99, average: 9.99, common: "$9.99/month" },
    Marketplace: { min: 0, max: 0, average: 0, common: "Commission-based" },
    "Dev tool": { min: 19, max: 199, average: 49, common: "$49/month" },
  };

  return defaults[category] || { min: 10, max: 50, average: 25, common: "$25/month" };
}

