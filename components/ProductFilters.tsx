"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function ProductFilters({ colors, sizes, priceRange, currentFilters, categories }: { colors: string[]; sizes: string[]; priceRange: { min: number; max: number }; currentFilters: Record<string, string>; categories?: { name: string; slug: string }[]; }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => router.push(pathname);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-leather-700 hover:underline">Clear All</button>
      </div>
      {categories && categories.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="category" checked={currentFilters.category === cat.slug} onChange={() => updateFilter("category", cat.slug)} className="accent-leather-700" />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {colors.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button key={color} onClick={() => updateFilter("color", currentFilters.color === color ? "" : color)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${currentFilters.color === color ? "bg-leather-700 text-white border-leather-700" : "bg-white text-gray-700 border-gray-200 hover:border-leather-700"}`}>{color}</button>
            ))}
          </div>
        </div>
      )}
      {sizes.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button key={size} onClick={() => updateFilter("size", currentFilters.size === size ? "" : size)}
                className={`w-10 h-10 text-sm rounded-lg border font-medium transition-colors ${currentFilters.size === size ? "bg-leather-700 text-white border-leather-700" : "bg-white text-gray-700 border-gray-200 hover:border-leather-700"}`}>{size}</button>
            ))}
          </div>
        </div>
      )}
      <div>
        <h4 className="font-medium mb-3">Sort By</h4>
        <select value={currentFilters.sort || ""} onChange={(e) => updateFilter("sort", e.target.value)} className="input-field py-2">
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="name_asc">Name: A-Z</option>
        </select>
      </div>
    </div>
  );
}
