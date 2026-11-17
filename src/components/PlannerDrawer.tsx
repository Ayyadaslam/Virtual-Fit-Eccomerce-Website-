import { useState } from "react";
import { Calendar, Plus, Ruler, Sparkles, Trash2, X } from "lucide-react";
import { CurrencyCode, ITEMS, SavedLook, formatPrice } from "../data/catalog";
import { ProductVisual } from "./ProductVisual";

interface PlannerDrawerProps {
  open: boolean;
  currency: CurrencyCode;
  activeSpatialIdx: number;
  activeSize: string;
  activeColorIdx: number;
  looks: SavedLook[];
  onClose: () => void;
  onSaveCurrentLook: (day: string, occasion: string) => void;
  onRemoveLook: (id: string) => void;
  onTryOn: (spatialIndex: number) => void;
  onAddLookToBag: (look: SavedLook) => void;
  onApplyRecommendedSize: (size: string) => void;
}

const DAYS = ["Monday · Studio", "Wednesday · Client", "Friday · Evening", "Saturday · Brunch"];

export function PlannerDrawer({
  open,
  currency,
  activeSpatialIdx,
  activeSize,
  activeColorIdx,
  looks,
  onClose,
  onSaveCurrentLook,
  onRemoveLook,
  onTryOn,
  onAddLookToBag,
  onApplyRecommendedSize,
}: PlannerDrawerProps) {
  const [tab, setTab] = useState<"looks" | "fit">("looks");
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [occasion, setOccasion] = useState("Minimalist Daily Rotation");

  const [heightCm, setHeightCm] = useState(180);
  const [weightKg, setWeightKg] = useState(76);
  const [drape, setDrape] = useState<"Slim" | "Regular" | "Relaxed">("Regular");

  if (!open) return null;

  const currentItem = ITEMS[activeSpatialIdx];
  const currentColor = currentItem.c[activeColorIdx] || currentItem.c[0];

  const computeRecommendedSize = () => {
    let score = 0;
    if (heightCm < 171 && weightKg < 65) score = 0;
    else if (heightCm < 181 && weightKg < 79) score = 1;
    else if (heightCm < 189 && weightKg < 90) score = 2;
    else score = 3;

    if (drape === "Relaxed" && score < 3) score += 1;
    if (drape === "Slim" && score > 0) score -= 1;

    return ["S", "M", "L", "XL"][score];
  };

  const recommended = computeRecommendedSize();

  return (
    <div
      className="fixed inset-0 z-[85] flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Outfit Lookbook and Fit Guide"
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-white/50 bg-[#f7f4ef]/95 text-stone-900 shadow-2xl backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-stone-700 dark:text-zinc-300" />
            <h2 className="text-lg font-semibold tracking-tight">
              Lookbook &amp; Fit Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lookbook"
            className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-stone-200 px-6 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setTab("looks")}
            className={`border-b-2 py-3 pr-5 text-xs font-semibold transition ${
              tab === "looks"
                ? "border-stone-900 text-stone-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-stone-500 dark:text-zinc-400"
            }`}
          >
            Outfit Planner ({looks.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("fit")}
            className={`border-b-2 px-5 py-3 text-xs font-semibold transition ${
              tab === "fit"
                ? "border-stone-900 text-stone-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-stone-500 dark:text-zinc-400"
            }`}
          >
            Size &amp; Fit Calculator
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "looks" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
                  Currently on Model
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <ProductVisual
                    name={currentItem.n}
                    g={currentItem.g}
                    className="h-14 w-14 shrink-0 rounded-xl"
                    insetClass="inset-1"
                  />
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
                      {currentItem.n}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-zinc-400">
                      Size {activeSize} &middot; {currentColor[0]} &middot;{" "}
                      {formatPrice(currentItem.p, currency)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    aria-label="Schedule slot"
                    className="h-9 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs font-medium text-stone-800 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="Occasion note..."
                    className="h-9 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs text-stone-800 focus:border-stone-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  />
                  <button
                    type="button"
                    onClick={() => onSaveCurrentLook(selectedDay, occasion)}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-stone-900 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Save Current Fit to Calendar
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                  Saved Weekly Rotation
                </h3>
                {looks.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-stone-300 py-8 text-center text-xs text-stone-500 dark:border-zinc-700 dark:text-zinc-400">
                    No outfits scheduled yet. Save the active garment above.
                  </p>
                ) : (
                  looks.map((look) => (
                    <div
                      key={look.id}
                      className="rounded-2xl border border-stone-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-zinc-400">
                        <span>{look.day}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveLook(look.id)}
                          aria-label="Delete saved look"
                          className="text-stone-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <ProductVisual
                          name={look.name}
                          g={look.g}
                          className="h-14 w-14 shrink-0 rounded-xl"
                          insetClass="inset-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-stone-900 dark:text-zinc-100">
                            {look.name}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-zinc-400">
                            {look.colorName} &middot; Size {look.size} &middot;{" "}
                            <span className="tabular-nums">
                              {formatPrice(look.price, currency)}
                            </span>
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-stone-400 dark:text-zinc-500">
                            {look.occasion}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {typeof look.spatialIndex === "number" && (
                          <button
                            type="button"
                            onClick={() => {
                              onTryOn(look.spatialIndex!);
                              onClose();
                            }}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-stone-300 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                          >
                            <Sparkles className="h-3 w-3" />
                            Try On
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onAddLookToBag(look)}
                          className="flex-1 rounded-full bg-stone-900 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-zinc-100">
                  <Ruler className="h-4 w-4 text-stone-600 dark:text-zinc-400" />
                  <span>Personal Fit Estimator</span>
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400">
                  Adjust height, weight, and drape preference to calibrate your VirtualFit size.
                </p>

                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>Height</span>
                      <span className="tabular-nums font-semibold">
                        {heightCm} cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={158}
                      max={200}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="mt-1.5 w-full accent-stone-900 dark:accent-zinc-100"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span>Weight</span>
                      <span className="tabular-nums font-semibold">
                        {weightKg} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={115}
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="mt-1.5 w-full accent-stone-900 dark:accent-zinc-100"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium">Preferred Drape</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(["Slim", "Regular", "Relaxed"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDrape(d)}
                          className={`rounded-full border py-1.5 text-xs font-semibold transition ${
                            drape === d
                              ? "border-stone-900 bg-stone-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                              : "border-stone-200 bg-stone-50 text-stone-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl bg-stone-100 p-4 dark:bg-zinc-800">
                  <div>
                    <p className="text-[11px] font-medium text-stone-500 dark:text-zinc-400">
                      Recommended Size
                    </p>
                    <p className="text-2xl font-bold text-stone-900 dark:text-zinc-50">
                      {recommended}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onApplyRecommendedSize(recommended);
                      onClose();
                    }}
                    className="rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    Apply Size {recommended}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
