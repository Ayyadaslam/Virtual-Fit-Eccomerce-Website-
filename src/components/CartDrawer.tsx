import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  CATALOG,
  CatalogProduct,
  CartItem,
  CurrencyCode,
  OrderRecord,
  formatPrice,
} from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onQuickAddProduct: (product: CatalogProduct) => void;
  onPlaceOrder: (order: OrderRecord) => void;
  onOpenOrders: () => void;
}

const FREE_SHIPPING_THRESHOLD = 150;

export function CartDrawer({
  open,
  items,
  currency,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onQuickAddProduct,
  onPlaceOrder,
  onOpenOrders,
}: CartDrawerProps) {
  const [step, setStep] = useState<"bag" | "checkout" | "confirmed">("bag");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "Card" | "Apple Pay" | "Cash on Delivery"
  >("Card");

  const [fullName, setFullName] = useState("Alex Mercer");
  const [email, setEmail] = useState("alex@mercerstudio.co");
  const [phone, setPhone] = useState("+1 (415) 555-0192");
  const [address, setAddress] = useState("412 Mercer St, Apt 4B");
  const [city, setCity] = useState("San Francisco");
  const [postalCode, setPostalCode] = useState("94107");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount =
    appliedPromo === "VIRTUAL10" ? Math.round(subtotal * 0.1) : 0;
  const qualifiesFreeStandard = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost =
    items.length === 0
      ? 0
      : appliedPromo === "FREESHIP"
      ? 0
      : shippingMethod === "express"
      ? 22
      : qualifiesFreeStandard
      ? 0
      : 12;
  const total = Math.max(0, subtotal - discount + shippingCost);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const crossSell = CATALOG.filter(
    (p) => !items.some((i) => i.productId === p.id)
  ).slice(0, 2);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === "VIRTUAL10" || code === "FREESHIP") {
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setPromoError("Try VIRTUAL10 (10% off) or FREESHIP");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      setFormError("Please complete all shipping address fields.");
      return;
    }
    setFormError(null);
    const orderNum = `VF-${Math.floor(1040 + Math.random() * 8900)}`;
    const newOrder: OrderRecord = {
      id: orderNum,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      status: "Preparing Shipment",
      items: [...items],
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      paymentMethod,
      shippingTo: {
        name: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        phone: phone.trim(),
      },
    };
    setConfirmedOrder(newOrder);
    onPlaceOrder(newOrder);
    setStep("confirmed");
  };

  const resetAndClose = () => {
    setStep("bag");
    setFormError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={resetAndClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-white/50 bg-[#f7f4ef]/95 text-stone-900 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            {step === "checkout" && (
              <button
                type="button"
                onClick={() => setStep("bag")}
                aria-label="Back to bag"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-stone-200/70 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="text-lg font-semibold tracking-tight">
              {step === "bag"
                ? `Shopping Bag (${items.reduce((s, i) => s + i.qty, 0)})`
                : step === "checkout"
                ? "Checkout"
                : "Order Confirmed"}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close bag"
            className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step 1: Bag */}
        {step === "bag" && (
          <>
            {items.length > 0 && (
              <div className="border-b border-stone-200/80 bg-white/70 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                <div className="flex items-center justify-between text-xs text-stone-700 dark:text-zinc-300">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Truck className="h-3.5 w-3.5 text-stone-500 dark:text-zinc-400" />
                    {remainingForFree === 0
                      ? "Complimentary standard shipping unlocked"
                      : `Add ${formatPrice(remainingForFree, currency)} more for free shipping`}
                  </span>
                  <span className="tabular-nums font-semibold">
                    {Math.round(progressPct)}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-stone-900 transition-all duration-300 dark:bg-zinc-100"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-stone-200/70 text-stone-600 dark:bg-zinc-800 dark:text-zinc-300">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-stone-900 dark:text-zinc-100">
                    Your bag is empty
                  </p>
                  <p className="mt-1 max-w-[240px] text-xs text-stone-500 dark:text-zinc-400">
                    Try garments in the spatial arc or browse the collection to add items.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-3.5 rounded-2xl border border-stone-200/90 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <ProductVisual
                        name={item.name}
                        g={item.g}
                        image={item.image}
                        className="h-20 w-20 shrink-0 rounded-xl"
                        insetClass="inset-1.5"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
                              {item.name}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500 dark:text-zinc-400">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-black/15 dark:border-white/20"
                                style={{ backgroundColor: item.colorHex }}
                              />
                              <span>{item.colorName}</span>
                              <span>&middot;</span>
                              <span>Size {item.size}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Remove ${item.name}`}
                            className="p-1 text-stone-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 dark:border-zinc-700 dark:bg-zinc-800">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -1)}
                              aria-label="Decrease quantity"
                              className="grid h-7 w-7 place-items-center text-stone-600 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, 1)}
                              aria-label="Increase quantity"
                              className="grid h-7 w-7 place-items-center text-stone-600 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold tabular-nums text-stone-900 dark:text-zinc-50">
                            {formatPrice(item.price * item.qty, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <form
                    onSubmit={handleApplyPromo}
                    className="rounded-2xl border border-stone-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 shrink-0 text-stone-400 dark:text-zinc-500" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Promo code (e.g. VIRTUAL10)"
                        className="h-8 flex-1 bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-stone-900 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <p className="mt-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        Code {appliedPromo} applied
                      </p>
                    )}
                    {promoError && (
                      <p className="mt-1.5 text-[11px] text-rose-600 dark:text-rose-400">
                        {promoError}
                      </p>
                    )}
                  </form>

                  {crossSell.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-stone-600 dark:text-zinc-400">
                        Complete the Look
                      </p>
                      <div className="mt-2.5 space-y-2">
                        {crossSell.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-stone-200/80 bg-white/80 p-2.5 dark:border-zinc-800 dark:bg-zinc-900"
                          >
                            <div className="flex items-center gap-2.5">
                              <ProductVisual
                                name={p.name}
                                g={p.g}
                                image={p.image}
                                className="h-12 w-12 shrink-0 rounded-lg"
                                insetClass="inset-1"
                              />
                              <div>
                                <p className="text-xs font-semibold text-stone-900 dark:text-zinc-100">
                                  {p.name}
                                </p>
                                <p className="text-[11px] tabular-nums text-stone-500 dark:text-zinc-400">
                                  {formatPrice(p.price, currency)} &middot; {p.category}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onQuickAddProduct(p)}
                              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] font-semibold text-stone-900 hover:bg-stone-900 hover:text-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-950"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-stone-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="space-y-1.5 text-xs text-stone-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-stone-900 dark:text-zinc-100">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Discount ({appliedPromo})</span>
                      <span className="tabular-nums font-medium">
                        -{formatPrice(discount, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="tabular-nums font-medium text-stone-900 dark:text-zinc-100">
                      {shippingCost === 0
                        ? "Free"
                        : formatPrice(shippingCost, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-bold text-stone-900 dark:border-zinc-800 dark:text-zinc-50">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* Step 2: Checkout */}
        {step === "checkout" && (
          <form
            onSubmit={handleCheckoutSubmit}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <div className="flex-1 space-y-5 px-6 py-5">
              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
                  {formError}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                  Shipping Details
                </h3>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address & apt"
                  className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                  Delivery Method
                </h3>
                <button
                  type="button"
                  onClick={() => setShippingMethod("standard")}
                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs ${
                    shippingMethod === "standard"
                      ? "border-stone-900 bg-white dark:border-zinc-200 dark:bg-zinc-900"
                      : "border-stone-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-zinc-100">
                      Standard Courier (3–5 business days)
                    </p>
                    <p className="text-stone-500 dark:text-zinc-400">
                      Free on orders over {formatPrice(150, currency)}
                    </p>
                  </div>
                  <span className="font-bold tabular-nums">
                    {qualifiesFreeStandard || appliedPromo === "FREESHIP"
                      ? "Free"
                      : formatPrice(12, currency)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingMethod("express")}
                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs ${
                    shippingMethod === "express"
                      ? "border-stone-900 bg-white dark:border-zinc-200 dark:bg-zinc-900"
                      : "border-stone-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-zinc-100">
                      Express Air (Next business day)
                    </p>
                    <p className="text-stone-500 dark:text-zinc-400">
                      Insured priority dispatch
                    </p>
                  </div>
                  <span className="font-bold tabular-nums">
                    {appliedPromo === "FREESHIP"
                      ? "Free"
                      : formatPrice(22, currency)}
                  </span>
                </button>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                  Payment Method
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(["Card", "Apple Pay", "Cash on Delivery"] as const).map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition ${
                          paymentMethod === method
                            ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                            : "border-stone-200 bg-white text-stone-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                        }`}
                      >
                        {method}
                      </button>
                    )
                  )}
                </div>
                {paymentMethod === "Card" && (
                  <div className="relative">
                    <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      aria-label="Card number"
                      className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-3.5 text-sm tabular-nums focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                )}
                {paymentMethod === "Cash on Delivery" && (
                  <p className="rounded-xl border border-stone-200 bg-white/80 p-3 text-xs text-stone-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    Pay{" "}
                    <strong className="tabular-nums text-stone-900 dark:text-zinc-50">
                      {formatPrice(total, currency)}
                    </strong>{" "}
                    in cash or mobile tap upon courier arrival. Courier will call{" "}
                    <span className="font-medium text-stone-900 dark:text-zinc-100">
                      {phone}
                    </span>{" "}
                    before delivery.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-stone-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-3 flex items-center justify-between text-sm font-bold text-stone-900 dark:text-zinc-50">
                <span>Order Total</span>
                <span className="tabular-nums">{formatPrice(total, currency)}</span>
              </div>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Place Order &middot; {formatPrice(total, currency)}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmed Receipt */}
        {step === "confirmed" && confirmedOrder && (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-8">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900 dark:text-zinc-50">
                Order #{confirmedOrder.id} Confirmed
              </h3>
              <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">
                {confirmedOrder.status} &middot; {confirmedOrder.paymentMethod}
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex justify-between text-stone-500 dark:text-zinc-400">
                  <span>Delivering to</span>
                  <span className="font-semibold text-stone-900 dark:text-zinc-100">
                    {confirmedOrder.shippingTo.name}
                  </span>
                </div>
                <p className="text-right text-stone-600 dark:text-zinc-400">
                  {confirmedOrder.shippingTo.address}, {confirmedOrder.shippingTo.city}{" "}
                  {confirmedOrder.shippingTo.postalCode}
                </p>

                <div className="border-t border-stone-100 pt-3 dark:border-zinc-800">
                  {confirmedOrder.items.map((item) => (
                    <div
                      key={item.key}
                      className="flex justify-between py-1 text-stone-700 dark:text-zinc-300"
                    >
                      <span>
                        {item.qty} &times; {item.name} ({item.size}, {item.colorName})
                      </span>
                      <span className="tabular-nums font-semibold">
                        {formatPrice(item.price * item.qty, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-stone-100 pt-3 text-sm font-bold text-stone-900 dark:border-zinc-800 dark:text-zinc-50">
                  <span>Total Paid</span>
                  <span className="tabular-nums">
                    {formatPrice(confirmedOrder.total, currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  resetAndClose();
                  onOpenOrders();
                }}
                className="flex h-11 w-full items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Track Order in Profile
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                className="flex h-11 w-full items-center justify-center rounded-full border border-stone-300 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
