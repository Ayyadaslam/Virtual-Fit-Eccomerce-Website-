import { Check, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import { CatalogProduct, CurrencyCode, formatPrice } from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface CompareModalProps {
  open: boolean;
  products: CatalogProduct[];
  currency: CurrencyCode;
  onClose: () => void;
  onRemove: (productId: string) => void;
  onAddToBag: (product: CatalogProduct) => void;
  onTryOn: (spatialIndex: number) => void;
}

export function CompareModal({
  open,
  products,
  currency,
  onClose,
  onRemove,
  onAddToBag,
  onTryOn,
}: CompareModalProps) {
  if (!open || products.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/45 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Compare Garments"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/60 bg-[#f7f4ef] text-stone-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Compare Specifications ({products.length}/3)
            </h2>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              Side-by-side fabric weight, fit profile, and sizing comparison
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <table className="w-full min-w-[540px] border-collapse text-left text-xs">
            <thead>
              <tr>
                <th className="w-36 pb-4 align-bottom text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                  Garment
                </th>
                {products.map((p) => (
                  <th key={p.id} className="pb-4 pl-4 align-top">
                    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <button
                        type="button"
                        onClick={() => onRemove(p.id)}
                        aria-label={`Remove ${p.name} from comparison`}
                        className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-stone-500 shadow-sm hover:text-stone-900 dark:bg-zinc-800/90 dark:text-zinc-300 dark:hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <ProductVisual
                        name={p.name}
                        g={p.g}
                        image={p.image}
                        className="aspect-[4/4.2] w-full rounded-xl"
                        insetClass="inset-3"
                      />
                      <p className="mt-2.5 text-sm font-semibold text-stone-900 dark:text-zinc-100">
                        {p.name}
                      </p>
                      <p className="text-xs font-bold tabular-nums text-stone-900 dark:text-zinc-50">
                        {formatPrice(p.price, currency)}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80 dark:divide-zinc-800">
              <tr>
                <td className="py-3 font-semibold text-stone-500 dark:text-zinc-400">
                  Category
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pl-4 font-medium text-stone-900 dark:text-zinc-100">
                    {p.category}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-stone-500 dark:text-zinc-400">
                  Fabric
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pl-4 text-stone-700 dark:text-zinc-300">
                    {p.fabric}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-stone-500 dark:text-zinc-400">
                  Weight / Spec
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pl-4 text-stone-700 dark:text-zinc-300">
                    {p.weight}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-stone-500 dark:text-zinc-400">
                  Fit Profile
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pl-4 text-stone-700 dark:text-zinc-300">
                    {p.fit}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-stone-500 dark:text-zinc-400">
                  Rating
                </td>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="py-3 pl-4 font-semibold tabular-nums text-stone-900 dark:text-zinc-100"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {p.rating.toFixed(1)} ({p.reviewCount})
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-stone-500 dark:text-zinc-400">
                  Sizes
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pl-4 text-stone-700 dark:text-zinc-300">
                    {p.sizes.join(" · ")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-stone-500 dark:text-zinc-400">
                  Availability
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pl-4 font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      {p.stockStatus}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="pt-4 font-semibold text-stone-500 dark:text-zinc-400">
                  Actions
                </td>
                {products.map((p) => (
                  <td key={p.id} className="pt-4 pl-4">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => onAddToBag(p)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Add to Bag
                      </button>
                      {typeof p.spatialIndex === "number" && (
                        <button
                          type="button"
                          onClick={() => {
                            onTryOn(p.spatialIndex!);
                            onClose();
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Try On Model
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
