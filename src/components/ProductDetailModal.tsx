import { useState } from "react";
import {
  Check,
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { CatalogProduct, CurrencyCode, ProductReview, formatPrice } from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface ProductDetailModalProps {
  product: CatalogProduct | null;
  currency: CurrencyCode;
  initialSize?: string;
  initialColorIndex?: number;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToBag: (
    product: CatalogProduct,
    size: string,
    colorIndex: number,
    qty: number
  ) => void;
  onTryOn: (spatialIndex: number) => void;
  onToggleWishlist: (productId: string) => void;
  onSaveLook: (product: CatalogProduct, size: string, colorIndex: number) => void;
}

export function ProductDetailModal({
  product,
  currency,
  initialSize,
  initialColorIndex = 0,
  isWishlisted,
  onClose,
  onAddToBag,
  onTryOn,
  onToggleWishlist,
  onSaveLook,
}: ProductDetailModalProps) {
  const [size, setSize] = useState(
    initialSize && product?.sizes.includes(initialSize)
      ? initialSize
      : product?.sizes.includes("M")
      ? "M"
      : product?.sizes[0] || "M"
  );
  const [colorIdx, setColorIdx] = useState(initialColorIndex);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"details" | "size" | "reviews">("details");
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [lookSaved, setLookSaved] = useState(false);

  const [extraReviews, setExtraReviews] = useState<ProductReview[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  if (!product) return null;

  const activeColor = product.colors[colorIdx] || product.colors[0];
  const allReviews = [...extraReviews, ...product.reviews];

  const handleAdd = () => {
    onAddToBag(product, size, colorIdx, qty);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1400);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      height: "180 cm",
      sizeBought: size,
      fitFeedback: "True to Size",
      rating: reviewRating,
      date: "Nov 2026",
      comment: reviewComment.trim(),
    };
    setExtraReviews((prev) => [newRev, ...prev]);
    setReviewAuthor("");
    setReviewComment("");
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/45 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/60 bg-[#f7f4ef] text-stone-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 md:grid md:grid-cols-[1.02fr_1.15fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white/90 text-stone-700 transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Visual Column */}
        <div className="relative flex flex-col justify-between bg-[#ece7df] p-6 dark:bg-zinc-900">
          <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-2xl bg-white/70 dark:bg-zinc-800/80">
            <ProductVisual
              name={product.name}
              g={product.g}
              image={product.image}
              className="h-full w-full"
              insetClass="inset-6"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {typeof product.spatialIndex === "number" && (
              <button
                type="button"
                onClick={() => {
                  onTryOn(product.spatialIndex!);
                  onClose();
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Try On Spatial Model
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onSaveLook(product, size, colorIdx);
                setLookSaved(true);
                window.setTimeout(() => setLookSaved(false), 1500);
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-800 transition hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {lookSaved ? <Check className="h-3.5 w-3.5" /> : null}
              {lookSaved ? "Saved to Lookbook" : "Save Look"}
            </button>
          </div>
        </div>

        {/* Right Purchase & Info Column */}
        <div className="flex max-h-[92vh] flex-col overflow-y-auto p-6 sm:p-7">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400">
            <span>{product.category}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="tabular-nums">{product.sku}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {product.stockStatus}
            </span>
          </div>

          <div className="mt-2 flex items-start justify-between gap-4 pr-8">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-50">
              {product.name}
            </h2>
            <div className="text-right">
              <span className="text-2xl font-bold tabular-nums text-stone-900 dark:text-zinc-50">
                {formatPrice(product.price, currency)}
              </span>
              {product.compareAtPrice && (
                <p className="text-xs tabular-nums text-stone-400 line-through dark:text-zinc-500">
                  {formatPrice(product.compareAtPrice, currency)}
                </p>
              )}
            </div>
          </div>

          <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">
            {product.subtitle}
          </p>

          <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-700 dark:text-zinc-300">
            <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
            <span className="text-stone-400 dark:text-zinc-600">&middot;</span>
            <button
              type="button"
              onClick={() => setTab("reviews")}
              className="underline decoration-stone-300 underline-offset-2 hover:text-stone-900 dark:decoration-zinc-600 dark:hover:text-zinc-100"
            >
              {allReviews.length} verified reviews
            </button>
          </div>

          {/* Color Selector */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700 dark:text-zinc-300">
              <span>
                Color &middot; <strong className="font-semibold">{activeColor[0]}</strong>
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              {product.colors.map(([cname, hex], idx) => (
                <button
                  key={cname}
                  type="button"
                  onClick={() => setColorIdx(idx)}
                  aria-label={`Select color ${cname}`}
                  className={`h-7 w-7 rounded-full border border-black/15 transition dark:border-white/20 ${
                    colorIdx === idx
                      ? "ring-2 ring-stone-900 ring-offset-2 ring-offset-[#f7f4ef] dark:ring-zinc-100 dark:ring-offset-zinc-950"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700 dark:text-zinc-300">
              <span>
                Size &middot; <strong className="font-semibold">{size}</strong>
              </span>
              <button
                type="button"
                onClick={() => setTab("size")}
                className="inline-flex items-center gap-1 text-stone-600 underline decoration-stone-300 underline-offset-2 hover:text-stone-900 dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:text-zinc-100"
              >
                <Ruler className="h-3 w-3" />
                Size chart
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`min-w-[44px] rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                    size === s
                      ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                      : "border-stone-300 bg-white text-stone-800 hover:border-stone-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Buy Actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-11 items-center rounded-full border border-stone-300 bg-white px-1.5 dark:border-zinc-700 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-8 w-8 place-items-center rounded-full text-stone-600 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                className="grid h-8 w-8 place-items-center rounded-full text-stone-600 hover:bg-stone-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition hover:bg-stone-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              {addedFeedback ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Add to Bag &middot; {formatPrice(product.price * qty, currency)}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition ${
                isWishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-950/50 dark:text-rose-400"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-y border-stone-200/90 py-3 text-[11px] text-stone-600 dark:border-zinc-800 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-stone-500 dark:text-zinc-400" />
              <span>Free shipping over {formatPrice(150, currency)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-stone-500 dark:text-zinc-400" />
              <span>30-day complimentary returns</span>
            </div>
          </div>

          <div className="mt-4 flex gap-4 border-b border-stone-200 text-xs font-semibold dark:border-zinc-800">
            {(
              [
                ["details", "Details & Fabric"],
                ["size", "Size Guide"],
                ["reviews", `Reviews (${allReviews.length})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`border-b-2 pb-2.5 transition ${
                  tab === key
                    ? "border-stone-900 text-stone-900 dark:border-zinc-100 dark:text-zinc-100"
                    : "border-transparent text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
            {tab === "details" && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <div className="space-y-1.5 rounded-xl bg-white/80 p-3.5 text-xs dark:bg-zinc-900">
                  <p>
                    <strong className="text-stone-900 dark:text-zinc-100">Material:</strong>{" "}
                    {product.fabric} ({product.weight})
                  </p>
                  <p>
                    <strong className="text-stone-900 dark:text-zinc-100">Care:</strong>{" "}
                    {product.care}
                  </p>
                  <p>
                    <strong className="text-stone-900 dark:text-zinc-100">Fit:</strong>{" "}
                    {product.fit}
                  </p>
                </div>
              </div>
            )}

            {tab === "size" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 dark:border-zinc-800 dark:text-zinc-400">
                      <th className="py-2 font-medium">Size</th>
                      <th className="py-2 font-medium">Chest / Fit</th>
                      <th className="py-2 font-medium">Length</th>
                      <th className="py-2 font-medium">Shoulder / Spec</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.measurements.map((row) => (
                      <tr
                        key={row.size}
                        className="border-b border-stone-200/60 dark:border-zinc-800/70"
                      >
                        <td className="py-2 font-semibold text-stone-900 dark:text-zinc-100">
                          {row.size}
                        </td>
                        <td className="py-2">{row.chest}</td>
                        <td className="py-2">{row.length}</td>
                        <td className="py-2">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-4">
                {allReviews.length === 0 ? (
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    No customer reviews yet. Be the first to review this garment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {allReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-xl border border-stone-200/80 bg-white/80 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900 dark:text-zinc-100">
                            {rev.author}
                          </span>
                          <span className="text-stone-400 dark:text-zinc-500">
                            {rev.date}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500 dark:text-zinc-400">
                          <span className="inline-flex items-center gap-0.5 text-amber-500">
                            {"★".repeat(rev.rating)}
                          </span>
                          <span>&middot;</span>
                          <span>Size {rev.sizeBought}</span>
                          <span>&middot;</span>
                          <span>{rev.fitFeedback}</span>
                        </div>
                        <p className="mt-2 text-stone-700 dark:text-zinc-300">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={handleReviewSubmit}
                  className="space-y-2.5 rounded-xl border border-stone-200 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <p className="text-xs font-semibold text-stone-900 dark:text-zinc-100">
                    Write a Review
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="Your name"
                      className="h-8 flex-1 rounded-lg border border-stone-200 bg-white px-2.5 text-xs focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      aria-label="Star rating"
                      className="h-8 rounded-lg border border-stone-200 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                    </select>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share how this piece fits and feels..."
                    rows={2}
                    className="w-full rounded-lg border border-stone-200 bg-white p-2.5 text-xs focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    Post Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
