import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Eye,
  Heart,
  PackageSearch,
  RefreshCw,
  Ruler,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import {
  CATALOG,
  CATEGORY_TABS,
  CatalogProduct,
  CategoryTab,
  CurrencyCode,
  OrderRecord,
  formatPrice,
} from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface StorefrontSectionProps {
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  wishlist: string[];
  recentlyViewedIds: string[];
  compareIds: string[];
  orders: OrderRecord[];
  selectedCategory: "All" | CategoryTab;
  onChangeCategory: (cat: "All" | CategoryTab) => void;
  onSelectProduct: (product: CatalogProduct) => void;
  onTryOn: (spatialIndex: number) => void;
  onAddToBag: (product: CatalogProduct, size: string, colorIdx: number) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onOpenCompare: () => void;
  onOpenFitGuide: () => void;
  onOpenCart: () => void;
  onScrollToHero: () => void;
}

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";
type PriceFilter = "all" | "under-100" | "100-200" | "over-200";

export function StorefrontSection({
  currency,
  onChangeCurrency,
  wishlist,
  recentlyViewedIds,
  compareIds,
  orders,
  selectedCategory,
  onChangeCategory,
  onSelectProduct,
  onTryOn,
  onAddToBag,
  onToggleWishlist,
  onToggleCompare,
  onOpenCompare,
  onOpenFitGuide,
  onOpenCart,
  onScrollToHero,
}: StorefrontSectionProps) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("All");
  const [onlySale, setOnlySale] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [cardColors, setCardColors] = useState<Record<string, number>>({});
  const [addedKey, setAddedKey] = useState<string | null>(null);

  const [orderLookupId, setOrderLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState<OrderRecord | "not-found" | null>(
    null
  );
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterJoined, setNewsletterJoined] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: CATALOG.length };
    for (const cat of CATEGORY_TABS) {
      counts[cat] = CATALOG.filter((p) => p.category === cat).length;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = CATALOG.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      if (onlySale && !item.compareAtPrice) return false;
      if (priceFilter === "under-100" && item.price >= 100) return false;
      if (priceFilter === "100-200" && (item.price < 100 || item.price > 200)) {
        return false;
      }
      if (priceFilter === "over-200" && item.price <= 200) return false;
      if (sizeFilter !== "All" && !item.sizes.includes(sizeFilter)) return false;

      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.colors.some(([cname]) => cname.toLowerCase().includes(q))
      );
    });

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [selectedCategory, onlySale, priceFilter, sizeFilter, searchQuery, sortBy]);

  const recentlyViewed = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => CATALOG.find((p) => p.id === id))
        .filter((p): p is CatalogProduct => Boolean(p)),
    [recentlyViewedIds]
  );

  const hasActiveFilters =
    selectedCategory !== "All" ||
    priceFilter !== "all" ||
    sizeFilter !== "All" ||
    onlySale ||
    searchQuery.trim() !== "";

  const resetFilters = () => {
    onChangeCategory("All");
    setPriceFilter("all");
    setSizeFilter("All");
    setOnlySale(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  const handleQuickAdd = (item: CatalogProduct, size: string) => {
    const colorIdx = cardColors[item.id] ?? 0;
    onAddToBag(item, size, colorIdx);
    const k = `${item.id}-${size}`;
    setAddedKey(k);
    window.setTimeout(() => setAddedKey((prev) => (prev === k ? null : prev)), 1100);
  };

  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = orderLookupId.trim().toUpperCase();
    if (!cleaned) return;
    const match = orders.find((o) => o.id.toUpperCase() === cleaned);
    setLookupResult(match || "not-found");
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterJoined(true);
    setNewsletterEmail("");
  };

  return (
    <div
      id="storefront"
      className="bg-[#f5f2ec] text-stone-900 transition-colors duration-300 dark:bg-[#0f1012] dark:text-zinc-100"
    >
      {/* Slim Dismissible Announcement Strip */}
      {bannerVisible && (
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-900 px-4 py-2 text-xs text-stone-100 dark:border-zinc-800 dark:bg-zinc-950 sm:px-8">
          <div className="mx-auto flex items-center gap-2 text-center">
            <span>
              Complimentary express shipping over {formatPrice(150, currency)}
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>
              Use code <strong className="font-semibold">VIRTUAL10</strong> for
              10% off
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            aria-label="Dismiss announcement"
            className="ml-2 rounded p-1 text-stone-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Storefront Catalog Container */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:py-20">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-stone-300/80 pb-8 dark:border-zinc-800 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-wide text-stone-500 dark:text-zinc-400">
              Autumn / Winter Wardrobe &middot; {CATALOG.length} Pieces
            </p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-50 sm:text-4xl">
              Complete Collection
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onScrollToHero}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 transition hover:border-stone-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Back to Spatial Try-On
            </button>
            <button
              type="button"
              onClick={onOpenFitGuide}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 transition hover:border-stone-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-400"
            >
              <Ruler className="h-3.5 w-3.5" />
              Fit Calculator
            </button>
          </div>
        </div>

        {/* Category Editorial Tiles */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(["All", ...CATEGORY_TABS] as const).map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChangeCategory(cat)}
                className={`flex flex-col items-start justify-between rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                    : "border-stone-200/90 bg-white text-stone-900 hover:border-stone-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
                }`}
              >
                <span className="text-sm font-semibold">{cat}</span>
                <span
                  className={`mt-2 text-xs tabular-nums ${
                    active
                      ? "text-stone-300 dark:text-zinc-600"
                      : "text-stone-500 dark:text-zinc-400"
                  }`}
                >
                  {categoryCounts[cat]} items
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shirts, wool, indigo, sneakers..."
              className="h-10 w-full rounded-full border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
              aria-label="Filter by price"
              className="h-10 rounded-full border border-stone-200 bg-stone-50 px-3.5 text-xs font-medium text-stone-800 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="all">All Prices</option>
              <option value="under-100">Under {formatPrice(100, currency)}</option>
              <option value="100-200">
                {formatPrice(100, currency)} – {formatPrice(200, currency)}
              </option>
              <option value="over-200">Over {formatPrice(200, currency)}</option>
            </select>

            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              aria-label="Filter by size"
              className="h-10 rounded-full border border-stone-200 bg-stone-50 px-3.5 text-xs font-medium text-stone-800 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="All">All Sizes</option>
              <option value="S">Size S</option>
              <option value="M">Size M</option>
              <option value="L">Size L</option>
              <option value="XL">Size XL</option>
              <option value="30">Waist 30</option>
              <option value="32">Waist 32</option>
              <option value="42">EU 42</option>
            </select>

            <button
              type="button"
              onClick={() => setOnlySale((v) => !v)}
              className={`h-10 rounded-full border px-4 text-xs font-medium transition ${
                onlySale
                  ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                  : "border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
              }`}
            >
              Seasonal Offers
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort catalog"
              className="h-10 rounded-full border border-stone-200 bg-stone-50 px-3.5 text-xs font-medium text-stone-800 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-5 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
          <span className="tabular-nums">
            Showing {filteredProducts.length} of {CATALOG.length} garments
          </span>
          {compareIds.length > 0 && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 font-semibold text-stone-900 underline underline-offset-4 dark:text-zinc-100"
            >
              <Scale className="h-3.5 w-3.5" />
              Compare {compareIds.length} selected
            </button>
          )}
        </div>

        {/* Main E-Commerce Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white py-20 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-base font-semibold text-stone-900 dark:text-zinc-100">
              No garments match your current filters
            </p>
            <p className="mt-1 text-sm text-stone-500 dark:text-zinc-400">
              Adjust your price, size, or search term to explore the collection.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              Show All {CATALOG.length} Products
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((item) => {
              const activeColorIdx = cardColors[item.id] ?? 0;
              const activeColor = item.colors[activeColorIdx] || item.colors[0];
              const isWish = wishlist.includes(item.id);
              const isCompared = compareIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* Image Slot */}
                  <div className="relative aspect-[4/4.6] overflow-hidden bg-[#ece8e1] dark:bg-zinc-800">
                    <div
                      onClick={() => onSelectProduct(item)}
                      className="h-full w-full cursor-pointer"
                    >
                      <ProductVisual
                        name={item.name}
                        g={item.g}
                        image={item.image}
                        className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
                        insetClass="inset-5"
                      />
                    </div>

                    {item.badgeText && (
                      <span className="pointer-events-none absolute left-3 top-3 text-[11px] font-semibold tracking-wide text-stone-700 dark:text-zinc-200">
                        {item.badgeText}
                      </span>
                    )}

                    {/* Top Right Wishlist & Compare */}
                    <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(item.id)}
                        aria-label={
                          isWish ? "Remove from wishlist" : "Add to wishlist"
                        }
                        className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                          isWish
                            ? "border-rose-200 bg-white text-rose-600 shadow-sm dark:border-rose-500/40 dark:bg-zinc-900 dark:text-rose-400"
                            : "border-white/70 bg-white/85 text-stone-600 hover:bg-white hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-900/85 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          fill={isWish ? "currentColor" : "none"}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleCompare(item.id)}
                        aria-label="Compare garment"
                        title={
                          isCompared ? "Remove from compare" : "Compare specs"
                        }
                        className={`grid h-8 w-8 place-items-center rounded-full border transition ${
                          isCompared
                            ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                            : "border-white/70 bg-white/85 text-stone-600 hover:bg-white hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-900/85 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <Scale className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {typeof item.spatialIndex === "number" && (
                      <button
                        type="button"
                        onClick={() => {
                          onTryOn(item.spatialIndex!);
                          onScrollToHero();
                        }}
                        className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-stone-900/85 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition hover:bg-stone-900"
                      >
                        <Sparkles className="h-3 w-3" />
                        Try On 3D
                      </button>
                    )}

                    {/* Hover Quick-Add Size Bar */}
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-end gap-1 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/95 p-1 shadow-md backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/95">
                        {item.sizes.slice(0, 4).map((sz) => {
                          const wasAdded = addedKey === `${item.id}-${sz}`;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleQuickAdd(item, sz)}
                              title={`Quick add size ${sz}`}
                              className="h-6 min-w-[26px] rounded-full px-1.5 text-[10px] font-bold text-stone-800 transition hover:bg-stone-900 hover:text-white dark:text-zinc-200 dark:hover:bg-zinc-100 dark:hover:text-zinc-950"
                            >
                              {wasAdded ? <Check className="mx-auto h-3 w-3" /> : sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-zinc-400">
                      <span>{item.category}</span>
                      <span className="inline-flex items-center gap-1 tabular-nums text-stone-700 dark:text-zinc-300">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(item)}
                      className="mt-1 text-left text-base font-semibold text-stone-900 hover:underline dark:text-zinc-100"
                    >
                      {item.name}
                    </button>
                    <p className="mt-0.5 line-clamp-1 text-xs text-stone-500 dark:text-zinc-400">
                      {item.subtitle}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5">
                      {item.colors.map(([cname, hex], idx) => (
                        <button
                          key={cname}
                          type="button"
                          onClick={() =>
                            setCardColors((prev) => ({ ...prev, [item.id]: idx }))
                          }
                          aria-label={`Preview ${cname}`}
                          title={cname}
                          className={`h-4 w-4 rounded-full border border-black/15 transition dark:border-white/20 ${
                            activeColorIdx === idx
                              ? "ring-2 ring-stone-900 ring-offset-1 dark:ring-zinc-100 dark:ring-offset-zinc-900"
                              : "hover:scale-110"
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                      <span className="ml-1 truncate text-[11px] text-stone-500 dark:text-zinc-400">
                        {activeColor[0]}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-zinc-800">
                      <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-base font-bold text-stone-900 dark:text-zinc-50">
                          {formatPrice(item.price, currency)}
                        </span>
                        {item.compareAtPrice && (
                          <span className="text-xs text-stone-400 line-through dark:text-zinc-500">
                            {formatPrice(item.compareAtPrice, currency)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(item)}
                          aria-label={`Quick view ${item.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full border border-stone-200 text-stone-600 transition hover:border-stone-400 hover:text-stone-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickAdd(
                              item,
                              item.sizes.includes("M") ? "M" : item.sizes[0]
                            )
                          }
                          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-stone-900 px-3.5 text-xs font-semibold text-white transition hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          {addedKey ===
                          `${item.id}-${
                            item.sizes.includes("M") ? "M" : item.sizes[0]
                          }`
                            ? "Added"
                            : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Recently Viewed Strip */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 border-t border-stone-300/80 pt-10 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-zinc-100">
              Recently Viewed
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              {recentlyViewed.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectProduct(item)}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-2.5 text-left transition hover:border-stone-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                >
                  <ProductVisual
                    name={item.name}
                    g={item.g}
                    image={item.image}
                    className="h-14 w-14 shrink-0 rounded-xl"
                    insetClass="inset-1"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-stone-900 dark:text-zinc-100">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs font-bold tabular-nums text-stone-600 dark:text-zinc-400">
                      {formatPrice(item.price, currency)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brand Craftsmanship & Guarantee Band */}
        <div className="mt-16 grid grid-cols-1 gap-6 border-t border-stone-300/80 pt-12 dark:border-zinc-800 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Sparkles className="h-5 w-5 text-stone-800 dark:text-zinc-200" />
            <h3 className="mt-3 text-base font-semibold text-stone-900 dark:text-zinc-100">
              Spatial Fit Calibration
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
              Preview drape, shoulder proportion, and layering silhouette on our
              studio model before ordering, backed by exact garment measurements.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Truck className="h-5 w-5 text-stone-800 dark:text-zinc-200" />
            <h3 className="mt-3 text-base font-semibold text-stone-900 dark:text-zinc-100">
              Global Express Dispatch
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
              Complimentary carbon-neutral courier delivery on orders over{" "}
              {formatPrice(150, currency)}, with Card, Apple Pay, and Cash on
              Delivery options.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <ShieldCheck className="h-5 w-5 text-stone-800 dark:text-zinc-200" />
            <h3 className="mt-3 text-base font-semibold text-stone-900 dark:text-zinc-100">
              30-Day Tailored Exchanges
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-zinc-400">
              Every garment is cut from traceable European flax, Supima cotton,
              or Italian wool and covered by free 30-day size exchanges.
            </p>
          </div>
        </div>
      </section>

      {/* Storefront Footer */}
      <footer className="border-t border-stone-300 bg-[#ebe6dd] text-stone-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold tracking-tight text-stone-900 dark:text-zinc-50">
              VirtualFit
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-zinc-400">
              Spatial apparel studio and direct-to-consumer wardrobe engineered
              for exact proportion, natural textiles, and effortless daily wear.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500 dark:text-zinc-400">
                Currency
              </span>
              {(["USD", "EUR", "GBP"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChangeCurrency(c)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    currency === c
                      ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                      : "bg-white/70 text-stone-700 hover:bg-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              Shop Categories
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORY_TABS.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeCategory(cat);
                      document
                        .getElementById("storefront")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-stone-900 hover:underline dark:hover:text-zinc-100"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Live Order Lookup */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              Track Your Order
            </h4>
            <p className="mt-2 text-xs text-stone-600 dark:text-zinc-400">
              Enter your order ID (try{" "}
              <button
                type="button"
                onClick={() => setOrderLookupId("VF-1038")}
                className="font-semibold underline"
              >
                VF-1038
              </button>
              ) for real-time dispatch status.
            </p>
            <form onSubmit={handleOrderLookup} className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <PackageSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={orderLookupId}
                  onChange={(e) => setOrderLookupId(e.target.value)}
                  placeholder="Order # (e.g. VF-1038)"
                  className="h-9 w-full rounded-full border border-stone-300 bg-white pl-8 pr-3 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
                />
              </div>
              <button
                type="submit"
                className="h-9 rounded-full bg-stone-900 px-3.5 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Track
              </button>
            </form>
            {lookupResult === "not-found" && (
              <p className="mt-2 text-xs text-rose-700 dark:text-rose-400">
                No order found with that ID.
              </p>
            )}
            {lookupResult && lookupResult !== "not-found" && (
              <div className="mt-2.5 rounded-xl border border-stone-300 bg-white/80 p-3 text-xs dark:border-zinc-700 dark:bg-zinc-900">
                <p className="font-semibold text-stone-900 dark:text-zinc-100">
                  #{lookupResult.id} &middot; {lookupResult.status}
                </p>
                <p className="mt-0.5 text-stone-600 dark:text-zinc-400">
                  {lookupResult.items.length} item(s) &middot;{" "}
                  {formatPrice(lookupResult.total, currency)} &middot;{" "}
                  {lookupResult.shippingTo.city}
                </p>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              Private Releases
            </h4>
            <p className="mt-2 text-xs text-stone-600 dark:text-zinc-400">
              Join for seasonal fabric drops and receive 10% off your first
              order.
            </p>
            {newsletterJoined ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                Welcome to VirtualFit. Use code <strong>VIRTUAL10</strong> at
                checkout.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-3 flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="h-9 flex-1 rounded-full border border-stone-300 bg-white px-3.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
                />
                <button
                  type="submit"
                  className="h-9 rounded-full bg-stone-900 px-4 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                >
                  Join
                </button>
              </form>
            )}

            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-stone-600 dark:text-zinc-400">
              <button
                type="button"
                onClick={onOpenFitGuide}
                className="inline-flex items-center gap-1 hover:text-stone-900 dark:hover:text-zinc-100"
              >
                Size Guide <ArrowUpRight className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={onOpenCart}
                className="inline-flex items-center gap-1 hover:text-stone-900 dark:hover:text-zinc-100"
              >
                View Bag <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-300/80 px-4 py-4 text-center text-[11px] text-stone-500 dark:border-zinc-800 dark:text-zinc-500 sm:px-8">
          &copy; {new Date().getFullYear()} VirtualFit Studio. All garments
          featured with real-time spatial fit preview.
        </div>
      </footer>

      {/* Floating Compare Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-[75] flex -translate-x-1/2 items-center gap-3 rounded-full border border-stone-300 bg-stone-900 px-4 py-2 text-xs text-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-950">
          <Scale className="h-3.5 w-3.5 opacity-75" />
          <span className="font-medium tabular-nums">
            {compareIds.length} garment{compareIds.length > 1 ? "s" : ""} selected
          </span>
          <button
            type="button"
            onClick={onOpenCompare}
            className="rounded-full bg-white px-3 py-1 font-semibold text-stone-900 hover:bg-stone-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            Compare
          </button>
        </div>
      )}
    </div>
  );
}
