import { useMemo, useState } from "react";
import { Heart, Search, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import {
  CATALOG,
  CATEGORY_TABS,
  CatalogProduct,
  CategoryTab,
  CurrencyCode,
  formatPrice,
} from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface CatalogDrawerProps {
  open: boolean;
  initialCategory: "All" | CategoryTab;
  currency: CurrencyCode;
  wishlist: string[];
  onClose: () => void;
  onSelectProduct: (product: CatalogProduct) => void;
  onTryOn: (spatialIndex: number) => void;
  onQuickAdd: (product: CatalogProduct, size: string, colorIndex: number) => void;
  onToggleWishlist: (productId: string) => void;
}

type SortMode = "featured" | "price-asc" | "price-desc" | "rating";

export function CatalogDrawer({
  open,
  initialCategory,
  currency,
  wishlist,
  onClose,
  onSelectProduct,
  onTryOn,
  onQuickAdd,
  onToggleWishlist,
}: CatalogDrawerProps) {
  const [category, setCategory] = useState<"All" | CategoryTab>(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = CATALOG.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.colors.some(([cname]) => cname.toLowerCase().includes(q))
      );
    });
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [category, query, sort]);

  if (!open) return null;

  const handleQuickAdd = (item: CatalogProduct) => {
    const defaultSize = item.sizes.includes("M") ? "M" : item.sizes[0];
    onQuickAdd(item, defaultSize, 0);
    setAddedId(item.id);
    window.setTimeout(() => setAddedId((prev) => (prev === item.id ? null : prev)), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Storefront Catalog"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/60 bg-[#f7f4ef]/95 text-stone-900 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 px-6 py-5 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
              VirtualFit Collection
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              Spatial try-on wardrobe &middot; Free express shipping over{" "}
              {formatPrice(150, currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close catalog"
            className="grid h-10 w-10 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-stone-200/80 bg-white/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search garments, fabrics, colors..."
              className="h-10 w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(["All", ...CATEGORY_TABS] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`h-8 rounded-full px-3.5 text-xs font-medium whitespace-nowrap transition ${
                  category === cat
                    ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "bg-stone-200/70 text-stone-700 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            aria-label="Sort products"
            className="h-9 rounded-full border border-stone-200 bg-white px-3.5 text-xs font-medium text-stone-700 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-base font-medium text-stone-800 dark:text-zinc-200">
                No garments match &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-sm text-stone-500 dark:text-zinc-400">
                Try clearing your search or switching categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className="mt-4 rounded-full bg-stone-900 px-5 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => {
                const isWish = wishlist.includes(item.id);
                const isAdded = addedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div
                      className="relative aspect-[4/4.2] cursor-pointer overflow-hidden"
                      onClick={() => onSelectProduct(item)}
                    >
                      <ProductVisual
                        name={item.name}
                        g={item.g}
                        image={item.image}
                        className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
                        insetClass="inset-5"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(item.id);
                        }}
                        aria-label={isWish ? "Remove from wishlist" : "Save to wishlist"}
                        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border transition ${
                          isWish
                            ? "border-rose-200 bg-white text-rose-600 shadow-sm dark:border-rose-500/40 dark:bg-zinc-900 dark:text-rose-400"
                            : "border-white/70 bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <Heart className="h-4 w-4" fill={isWish ? "currentColor" : "none"} />
                      </button>

                      {typeof item.spatialIndex === "number" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTryOn(item.spatialIndex!);
                            onClose();
                          }}
                          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-stone-900/85 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition hover:bg-stone-900"
                        >
                          <Sparkles className="h-3 w-3" />
                          Try On Model
                        </button>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-zinc-400">
                        <span>{item.category}</span>
                        <span className="inline-flex items-center gap-1 tabular-nums text-stone-700 dark:text-zinc-300">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {item.rating.toFixed(1)} ({item.reviewCount})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(item)}
                        className="mt-1 text-left text-base font-semibold text-stone-900 hover:underline dark:text-zinc-100"
                      >
                        {item.name}
                      </button>
                      <p className="mt-0.5 text-xs text-stone-500 line-clamp-1 dark:text-zinc-400">
                        {item.subtitle}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5">
                        {item.colors.map(([cname, hex]) => (
                          <span
                            key={cname}
                            title={cname}
                            className="h-3.5 w-3.5 rounded-full border border-black/15 dark:border-white/20"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                        <span className="ml-1 text-[11px] text-stone-500 dark:text-zinc-400">
                          {item.colors.length} colors
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-zinc-800">
                        <span className="text-base font-bold tabular-nums text-stone-900 dark:text-zinc-50">
                          {formatPrice(item.price, currency)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectProduct(item)}
                            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(item)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {isAdded ? "Added" : "Quick Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
