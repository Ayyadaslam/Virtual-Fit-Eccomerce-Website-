import { useState } from "react";
import { Heart, Moon, Package, Sparkles, Sun, Trash2, User, X } from "lucide-react";
import {
  CATALOG,
  CatalogProduct,
  CurrencyCode,
  OrderRecord,
  formatPrice,
} from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface ProfileDrawerProps {
  open: boolean;
  currency: CurrencyCode;
  theme: "light" | "dark";
  wishlist: string[];
  orders: OrderRecord[];
  defaultSize: string;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onTryOn: (spatialIndex: number) => void;
  onQuickAdd: (product: CatalogProduct, size: string) => void;
  onChangeDefaultSize: (size: string) => void;
  onChangeTheme: (theme: "light" | "dark") => void;
}

export function ProfileDrawer({
  open,
  currency,
  theme,
  wishlist,
  orders,
  defaultSize,
  onClose,
  onToggleWishlist,
  onTryOn,
  onQuickAdd,
  onChangeDefaultSize,
  onChangeTheme,
}: ProfileDrawerProps) {
  const [tab, setTab] = useState<"wishlist" | "orders" | "account">("wishlist");

  if (!open) return null;

  const wishProducts = CATALOG.filter((p) => wishlist.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-[85] flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Member Account"
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-white/50 bg-[#f7f4ef]/95 text-stone-900 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
                Alex Mercer
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                alex@mercerstudio.co
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-stone-200 px-6 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setTab("wishlist")}
            className={`border-b-2 py-3 pr-5 text-xs font-semibold transition ${
              tab === "wishlist"
                ? "border-stone-900 text-stone-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-stone-500 dark:text-zinc-400"
            }`}
          >
            Wishlist ({wishProducts.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`border-b-2 px-5 py-3 text-xs font-semibold transition ${
              tab === "orders"
                ? "border-stone-900 text-stone-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-stone-500 dark:text-zinc-400"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("account")}
            className={`border-b-2 pl-5 py-3 text-xs font-semibold transition ${
              tab === "account"
                ? "border-stone-900 text-stone-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-stone-500 dark:text-zinc-400"
            }`}
          >
            Preferences
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "wishlist" && (
            <div className="space-y-3">
              {wishProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <Heart className="h-8 w-8 text-stone-300 dark:text-zinc-700" />
                  <p className="mt-3 text-sm font-semibold text-stone-800 dark:text-zinc-200">
                    No saved items yet
                  </p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
                    Tap the heart icon on any garment to save it for later.
                  </p>
                </div>
              ) : (
                wishProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <ProductVisual
                      name={p.name}
                      g={p.g}
                      image={p.image}
                      className="h-16 w-16 shrink-0 rounded-xl"
                      insetClass="inset-1.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-900 dark:text-zinc-100">
                        {p.name}
                      </p>
                      <p className="text-xs text-stone-500 tabular-nums dark:text-zinc-400">
                        {formatPrice(p.price, currency)} &middot; {p.category}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {typeof p.spatialIndex === "number" && (
                          <button
                            type="button"
                            onClick={() => {
                              onTryOn(p.spatialIndex!);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <Sparkles className="h-3 w-3" />
                            Try On
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            onQuickAdd(
                              p,
                              p.sizes.includes(defaultSize)
                                ? defaultSize
                                : p.sizes[0]
                            )
                          }
                          className="rounded-full bg-stone-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                        >
                          Move to Bag
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(p.id)}
                      aria-label={`Remove ${p.name} from wishlist`}
                      className="p-1.5 text-stone-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-bold text-stone-900 tabular-nums dark:text-zinc-100">
                      <Package className="h-3.5 w-3.5 text-stone-500 dark:text-zinc-400" />
                      Order #{order.id}
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-stone-500 dark:text-zinc-400">
                    {order.date} &middot; {order.paymentMethod}
                  </p>

                  <div className="mt-3 space-y-1.5 border-t border-stone-100 pt-2.5 dark:border-zinc-800">
                    {order.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex justify-between text-stone-700 dark:text-zinc-300"
                      >
                        <span>
                          {item.qty} &times; {item.name} ({item.size}, {item.colorName})
                        </span>
                        <span className="tabular-nums font-medium">
                          {formatPrice(item.price * item.qty, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 font-bold text-stone-900 dark:border-zinc-800 dark:text-zinc-50">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {formatPrice(order.total, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "account" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-semibold text-stone-900 dark:text-zinc-100">
                  Appearance Mode
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500 dark:text-zinc-400">
                  Switch between bright studio daylight and evening dark mode.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeTheme("light")}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition ${
                      theme === "light"
                        ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                        : "border-stone-200 bg-stone-50 text-stone-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeTheme("dark")}
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition ${
                      theme === "dark"
                        ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                        : "border-stone-200 bg-stone-50 text-stone-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Dark Mode
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-semibold text-stone-900 dark:text-zinc-100">
                  Default Try-On Size
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500 dark:text-zinc-400">
                  Pre-selected across the spatial buy card and product pages.
                </p>
                <div className="mt-3 flex gap-2">
                  {["S", "M", "L", "XL"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onChangeDefaultSize(s)}
                      className={`h-9 flex-1 rounded-full border text-xs font-semibold transition ${
                        defaultSize === s
                          ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                          : "border-stone-200 bg-stone-50 text-stone-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-semibold text-stone-900 dark:text-zinc-100">
                  Saved Shipping Address
                </p>
                <p className="mt-1.5 text-stone-600 dark:text-zinc-400">
                  Alex Mercer
                  <br />
                  412 Mercer St, Apt 4B
                  <br />
                  San Francisco, CA 94107
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
