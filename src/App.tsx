import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Moon,
  Search,
  Shirt,
  ShoppingBag,
  SlidersHorizontal,
  Sun,
  User,
} from "lucide-react";
import {
  CATALOG,
  CATEGORY_TABS,
  CatalogProduct,
  CartItem,
  CategoryTab,
  CurrencyCode,
  INITIAL_ORDERS,
  ITEMS,
  OrderRecord,
  SavedLook,
  formatPrice,
} from "./data/catalog";
import { CatalogDrawer } from "./components/CatalogDrawer";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer } from "./components/CartDrawer";
import { PlannerDrawer } from "./components/PlannerDrawer";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { CompareModal } from "./components/CompareModal";
import { StorefrontSection } from "./components/StorefrontSection";

const CARDS = [...ITEMS, ...ITEMS];
const SIZES = ["S", "M", "L", "XL"];
const mod = (n: number, m: number) => ((n % m) + m) % m;

function RollingLine({
  text,
  className = "",
  reducedMotion,
}: {
  text: string;
  className?: string;
  reducedMotion: boolean;
}) {
  const [prevText, setPrevText] = useState<string | null>(null);
  const [currText, setCurrText] = useState(text);
  const oldRef = useRef<HTMLSpanElement>(null);
  const newRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (text === currText) return;
    if (reducedMotion) {
      setPrevText(null);
      setCurrText(text);
      return;
    }
    setPrevText(currText);
    setCurrText(text);
  }, [text, currText, reducedMotion]);

  useEffect(() => {
    if (!prevText || reducedMotion) return;
    const oldEl = oldRef.current;
    const newEl = newRef.current;
    const easing = "cubic-bezier(.2, .8, .2, 1)";
    const a1 = oldEl?.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }],
      { duration: 620, easing, fill: "forwards" }
    );
    const a2 = newEl?.animate(
      [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
      { duration: 620, easing, fill: "forwards" }
    );
    if (a2) {
      a2.onfinish = () => setPrevText(null);
    }
    return () => {
      a1?.cancel();
      a2?.cancel();
    };
  }, [prevText, currText, reducedMotion]);

  return (
    <div className={`ln ${className}`}>
      {prevText && (
        <span
          ref={oldRef}
          className="ln-inner absolute inset-x-0 top-0"
          aria-hidden="true"
        >
          {prevText}
        </span>
      )}
      <span ref={newRef} className="ln-inner">
        {currText}
      </span>
    </div>
  );
}

export default function App() {
  // Spatial Hero State
  const [activeTab, setActiveTab] = useState<CategoryTab>("Tops");
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [scrolledPastHero, setScrolledPastHero] = useState<boolean>(false);

  // Storefront & Theme State
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("vf_theme_v1");
      if (saved === "dark" || saved === "light") return saved;
      if (
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
      return "light";
    } catch {
      return "light";
    }
  });
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [storeCategory, setStoreCategory] = useState<"All" | CategoryTab>("All");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([
    "vf-basic-tee",
    "vf-wool-trousers",
    "vf-oat-overshirt",
  ]);

  // Persistent E-Commerce State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("vf_cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("vf_wishlist_v1");
      return raw ? JSON.parse(raw) : ["vf-linen-shirt", "vf-wool-trousers"];
    } catch {
      return ["vf-linen-shirt", "vf-wool-trousers"];
    }
  });
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const raw = localStorage.getItem("vf_orders_v1");
      return raw ? JSON.parse(raw) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [looks, setLooks] = useState<SavedLook[]>(() => {
    try {
      const raw = localStorage.getItem("vf_looks_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Drawers & Modals
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogInitialCategory, setCatalogInitialCategory] = useState<
    "All" | CategoryTab
  >("All");
  const [detailProduct, setDetailProduct] = useState<CatalogProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const anyModalOpen =
    catalogOpen ||
    Boolean(detailProduct) ||
    cartOpen ||
    plannerOpen ||
    profileOpen ||
    compareOpen;

  useEffect(() => {
    document.body.classList.toggle("modal-open", anyModalOpen);
  }, [anyModalOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("vf_theme_v1", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("vf_cart_v1", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("vf_wishlist_v1", JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("vf_orders_v1", JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("vf_looks_v1", JSON.stringify(looks));
    } catch {
      // ignore
    }
  }, [looks]);

  // DOM Refs for 60fps spatial engine
  const heroRef = useRef<HTMLElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mCurRef = useRef<HTMLDivElement>(null);
  const mNextRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const thumbImgRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Physics & animation refs
  const physRef = useRef({
    pos: 0,
    target: 0,
    intro: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    p0: 0,
    moved: 0,
    vel: 0,
    lastX: 0,
    lastTime: 0,
    sx: 0,
    sy: 0,
    tx: 0,
    ty: 0,
    curX: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    curY: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    curTargetX: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    curTargetY: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    shownOutfit: -1,
    xs: [0, 260, 420, 525, 595, 630],
    lastWheel: 0,
    wheelAcc: 0,
    scanAnims: [] as Animation[],
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const syncPill = useCallback(() => {
    const idx = CATEGORY_TABS.indexOf(activeTab);
    const btn = tabBtnRefs.current[idx];
    const pill = pillRef.current;
    if (!btn || !pill) return;
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.transform = `translateX(${btn.offsetLeft}px)`;
  }, [activeTab]);

  useEffect(() => {
    syncPill();
    window.addEventListener("resize", syncPill);
    return () => window.removeEventListener("resize", syncPill);
  }, [syncPill]);

  const runTryOn = useCallback(
    (idx: number) => {
      const p = physRef.current;
      p.shownOutfit = idx;
      setActiveIdx(idx);
      setSelectedColorIdx(0);

      p.scanAnims.forEach((a) => a.cancel());
      p.scanAnims = [];

      const mCur = mCurRef.current;
      const mNext = mNextRef.current;
      const grid = gridRef.current;
      const scan = scanRef.current;
      if (!mCur || !mNext || !grid || !scan) return;

      const nextPosX = `${ITEMS[idx].m}%`;
      mNext.style.backgroundPositionX = nextPosX;

      if (reducedMotion) {
        mCur.style.backgroundPositionX = nextPosX;
        mCur.style.opacity = "1";
        mNext.style.clipPath = "inset(0 0 100% 0)";
        return;
      }

      const easing = "cubic-bezier(.65, 0, .35, 1)";
      const aClip = mNext.animate(
        [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
        { duration: 950, easing, fill: "forwards" }
      );
      const aGrid = grid.animate(
        [
          { clipPath: "inset(0 0 100% 0)", offset: 0 },
          { clipPath: "inset(0 0 0% 0)", offset: 0.5 },
          { clipPath: "inset(100% 0 0 0)", offset: 1 },
        ],
        { duration: 1092, easing, fill: "forwards" }
      );
      const aScan = scan.animate(
        [
          { top: "0%", transform: "scaleX(.2)", opacity: 0, offset: 0 },
          { top: "6%", transform: "scaleX(1)", opacity: 1, offset: 0.08 },
          { top: "94%", transform: "scaleX(1)", opacity: 1, offset: 0.92 },
          { top: "100%", transform: "scaleX(.2)", opacity: 0, offset: 1 },
        ],
        { duration: 950, easing, fill: "forwards" }
      );
      const aSettle = mNext.animate(
        [{ transform: "scale(1.012)" }, { transform: "scale(1)" }],
        { duration: 1250, easing: "ease-out", fill: "forwards" }
      );

      p.scanAnims = [aClip, aGrid, aScan, aSettle];
      aClip.onfinish = () => {
        mCur.style.backgroundPositionX = nextPosX;
        mCur.style.opacity = "1";
        p.scanAnims.forEach((a) => a.cancel());
        p.scanAnims = [];
        mNext.style.clipPath = "inset(0 0 100% 0)";
      };
    },
    [reducedMotion]
  );

  useEffect(() => {
    if (reducedMotion || !thumbImgRef.current) return;
    const anim = thumbImgRef.current.animate(
      [
        { transform: "translateY(70%) scale(.8)" },
        { transform: "translateY(0) scale(1)" },
      ],
      { duration: 650, easing: "cubic-bezier(.2, .8, .2, 1)" }
    );
    return () => anim.cancel();
  }, [activeIdx, reducedMotion]);

  // 60fps spatial arc loop
  useEffect(() => {
    const seeds = CARDS.map((_, i) => i * 1.37);

    const updateSizes = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const phone = W <= 767;
      const CW = phone ? Math.min(0.3 * W, 170) : Math.min(0.148 * W, 0.33 * H);
      document.documentElement.style.setProperty("--CW", `${CW}px`);
      const ratios = phone
        ? [0, 0.36, 0.5, 0.56, 0.6, 0.62]
        : [0, 0.215, 0.345, 0.432, 0.49, 0.52];
      physRef.current.xs = ratios.map((r) => r * W);
    };
    updateSizes();
    window.addEventListener("resize", updateSizes);

    const xAt = (a: number, xs: number[]) => {
      const clamped = Math.min(5, Math.max(0, a));
      const idx = Math.min(4, Math.floor(clamped));
      const frac = clamped - idx;
      return xs[idx] + (xs[idx + 1] - xs[idx]) * frac;
    };

    let rafId = 0;
    const tick = (now: number) => {
      const t = now * 0.001;
      const p = physRef.current;
      const H = window.innerHeight;

      if (reducedMotion) {
        p.intro = 1;
        if (!p.dragging) p.pos = p.target;
      } else {
        p.intro = Math.min(1, p.intro + 0.012);
        if (!p.dragging) {
          p.pos += (p.target - p.pos) * 0.11;
        }
      }

      const ie = 1 - Math.pow(1 - p.intro, 3);

      p.sx += (p.tx - p.sx) * 0.06;
      p.sy += (p.ty - p.sy) * 0.06;
      p.curX += (p.curTargetX - p.curX) * 0.22;
      p.curY += (p.curTargetY - p.curY) * 0.22;

      if (curRef.current) {
        curRef.current.style.transform = `translate3d(${p.curX.toFixed(1)}px, ${p.curY.toFixed(1)}px, 0)`;
      }

      if (roomRef.current) {
        roomRef.current.style.transform = `translate3d(${(-p.sx * 22).toFixed(2)}px, ${(-p.sy * 14).toFixed(2)}px, 0) scale(${(1.08 - 0.03 * ie).toFixed(4)})`;
      }

      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(calc(-50% - ${(p.sx * 40).toFixed(2)}px), ${(-p.sy * 16).toFixed(2)}px)`;
      }

      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translateY(${((1 - ie) * (60 + 30 * i)).toFixed(2)}px)`;
      });

      for (let i = 0; i < CARDS.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const u = mod(i - p.pos + 5, 10) - 5;
        const a = Math.abs(u);
        const sg = Math.sign(u);
        const x = sg * xAt(a, p.xs) * ie;

        let s: number;
        let z: number;
        let opacity: number;
        let ry: number;
        let blur = 0;

        if (a < 1) {
          s = 0.55 + 0.45 * a;
          z = -260 * (1 - a);
          opacity = a;
          ry = -sg * 16 * a;
        } else {
          s = 1 / (1 + 0.3 * Math.pow(a - 1, 1.15));
          z = -110 * (a - 1);
          ry = -sg * (16 + 9 * Math.min(2, a - 1));
          blur = Math.max(0, a - 1.6) * 2.4;
          opacity = a > 3.4 ? Math.max(0, 1 - (a - 3.4) / 0.8) : 1;
        }

        const bob = reducedMotion
          ? 0
          : Math.sin(t * 1.1 + seeds[i]) * H * 0.006 * Math.min(1, a);
        const y = bob - (1 - s) * H * 0.04;
        ry += p.sx * 10;
        const rx = -p.sy * 6;
        const finalOpacity = opacity * ie;

        if (finalOpacity < 0.01) {
          el.style.visibility = "hidden";
        } else {
          el.style.visibility = "visible";
          el.style.opacity = finalOpacity.toFixed(3);
          el.style.zIndex = String(a < 1 ? 1 : Math.round(100 - 10 * a));
          el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
          el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) perspective(1300px) translateZ(${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) scale(${(s * (0.6 + 0.4 * ie)).toFixed(4)})`;
        }
      }

      if (!p.dragging && Math.abs(p.target - p.pos) < 0.02) {
        const settled = mod(Math.round(p.target), 5);
        if (settled !== p.shownOutfit) {
          runTryOn(settled);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateSizes);
    };
  }, [reducedMotion, runTryOn]);

  // Global pointer & cursor tracking scoped to .spatial-hero
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const p = physRef.current;
      p.curTargetX = e.clientX;
      p.curTargetY = e.clientY;
      p.tx = e.clientX / window.innerWidth - 0.5;
      p.ty = e.clientY / window.innerHeight - 0.5;

      const cur = curRef.current;
      if (!cur) return;

      const targetEl = e.target as HTMLElement | null;
      const inHero = Boolean(targetEl?.closest(".spatial-hero"));
      document.body.classList.toggle("hero-active", inHero);

      if (anyModalOpen || !inHero) {
        cur.dataset.mode = "hidden";
        return;
      }

      if (p.dragging) {
        cur.dataset.mode = "drag";
        return;
      }

      if (targetEl?.closest("button, a, input, select")) {
        cur.dataset.mode = "btn";
      } else if (targetEl?.closest(".card")) {
        cur.dataset.mode = "try";
      } else if (targetEl?.closest(".stage")) {
        cur.dataset.mode = "drag";
      } else {
        cur.dataset.mode = "";
      }
    };

    const onPointerDown = () => {
      if (curRef.current && !anyModalOpen) {
        curRef.current.dataset.down = "1";
      }
    };

    const onPointerUp = () => {
      if (curRef.current) {
        curRef.current.dataset.down = "0";
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.body.classList.remove("hero-active");
    };
  }, [anyModalOpen]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCatalogOpen(false);
        setDetailProduct(null);
        setCartOpen(false);
        setPlannerOpen(false);
        setProfileOpen(false);
        setCompareOpen(false);
        return;
      }
      if (anyModalOpen) return;
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") {
        return;
      }
      if (e.key === "ArrowRight") {
        physRef.current.target += 1;
      } else if (e.key === "ArrowLeft") {
        physRef.current.target -= 1;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anyModalOpen]);

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (anyModalOpen) return;
    const p = physRef.current;
    p.dragging = true;
    p.startX = e.clientX;
    p.startY = e.clientY;
    p.p0 = p.pos;
    p.moved = 0;
    p.vel = 0;
    p.lastX = e.clientX;
    p.lastTime = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physRef.current;
    if (!p.dragging) return;
    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;
    p.moved = Math.max(p.moved, Math.hypot(dx, dy));
    p.pos = p.p0 - dx / (p.xs[1] || 200);

    const now = performance.now();
    const dt = now - p.lastTime;
    if (dt > 0) {
      p.vel = (e.clientX - p.lastX) / dt;
    }
    p.lastX = e.clientX;
    p.lastTime = now;
  };

  const handleStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physRef.current;
    if (!p.dragging) return;
    p.dragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (p.moved < 6) {
      const hit = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest(".card") as HTMLElement | null;
      if (hit && hit.dataset.idx !== undefined) {
        const cardIdx = Number(hit.dataset.idx);
        const u = mod(cardIdx - p.pos + 5, 10) - 5;
        p.target = Math.round(p.pos + u);
        return;
      }
    }
    p.target = Math.round(p.pos - p.vel * 3.2);
  };

  // Only intercept horizontal wheel gestures on stage so vertical page scroll to storefront works naturally!
  const handleStageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (anyModalOpen) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const p = physRef.current;
    p.wheelAcc += e.deltaX;
    const now = performance.now();
    if (Math.abs(p.wheelAcc) > 60 && now - p.lastWheel > 260) {
      p.target += p.wheelAcc > 0 ? 1 : -1;
      p.wheelAcc = 0;
      p.lastWheel = now;
    }
  };

  const focusSpatialItem = useCallback((spatialIdx: number) => {
    const p = physRef.current;
    const current = mod(Math.round(p.target), 5);
    let diff = spatialIdx - current;
    if (diff > 2) diff -= 5;
    if (diff < -2) diff += 5;
    p.target = Math.round(p.target) + diff;
  }, []);

  const handleTabClick = (tab: CategoryTab) => {
    setActiveTab(tab);
    setStoreCategory(tab);
    physRef.current.target += 5;
  };

  const openProductDetail = (product: CatalogProduct) => {
    setDetailProduct(product);
    setRecentlyViewedIds((prev) => [
      product.id,
      ...prev.filter((id) => id !== product.id),
    ]);
  };

  const activeItem = ITEMS[activeIdx];
  const activeProduct = useMemo(
    () => CATALOG.find((p) => p.spatialIndex === activeIdx) || CATALOG[0],
    [activeIdx]
  );
  const activeColor = activeItem.c[selectedColorIdx] || activeItem.c[0];

  const showToast = (msg: string) => {
    setAddedToast(msg);
    window.setTimeout(() => {
      setAddedToast((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const addToBag = (
    product: CatalogProduct,
    size: string,
    colorIndex: number,
    qty = 1
  ) => {
    const color = product.colors[colorIndex] || product.colors[0];
    const key = `${product.id}__${size}__${color[0]}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          size,
          colorName: color[0],
          colorHex: color[1],
          qty,
          g: product.g,
          image: product.image,
          spatialIndex: product.spatialIndex,
        },
      ];
    });
    showToast(`Added ${product.name} (${size}) to bag`);
  };

  const updateCartQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeCartItem = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 3) {
        showToast("Compare up to 3 garments at once");
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const saveLook = (
    product: CatalogProduct,
    size: string,
    colorIdx: number,
    day = "Friday · Evening",
    occasion = "Studio Lookbook"
  ) => {
    const color = product.colors[colorIdx] || product.colors[0];
    const entry: SavedLook = {
      id: `look-${Date.now()}`,
      day,
      occasion,
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      colorName: color[0],
      colorHex: color[1],
      g: product.g,
      spatialIndex: product.spatialIndex,
      savedAt: new Date().toLocaleDateString(),
    };
    setLooks((prev) => [entry, ...prev]);
    showToast(`Saved ${product.name} to ${day}`);
  };

  const scrollToStorefront = (cat?: "All" | CategoryTab) => {
    if (cat) setStoreCategory(cat);
    document.getElementById("storefront")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const isCurrentWishlisted = wishlist.includes(activeProduct.id);
  const comparedProducts = useMemo(
    () =>
      compareIds
        .map((id) => CATALOG.find((p) => p.id === id))
        .filter((p): p is CatalogProduct => Boolean(p)),
    [compareIds]
  );

  return (
    <>
      {/* Sticky Storefront Top Navigation (appears when scrolled into the store below hero) */}
      <header
        className={`fixed inset-x-0 top-0 z-[70] border-b border-stone-200/80 bg-[#f7f4ef]/90 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950/90 ${
          scrolledPastHero
            ? "translate-y-0 opacity-100"
            : "-translate-y-full pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={scrollToHero}
            className="shrink-0 whitespace-nowrap text-lg font-bold tracking-tight text-stone-900 dark:text-zinc-100"
          >
            VirtualFit
          </button>

          {/* Zone 2: Concise single-line category links */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex dark:text-zinc-400">
            {(["All", ...CATEGORY_TABS] as const).slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => scrollToStorefront(cat)}
                className={`shrink-0 whitespace-nowrap transition hover:text-stone-900 dark:hover:text-zinc-100 ${
                  storeCategory === cat
                    ? "text-stone-900 underline underline-offset-4 dark:text-zinc-100"
                    : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary action cluster */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className="grid h-9 w-9 place-items-center rounded-full text-stone-700 transition hover:bg-stone-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Wishlist and account"
              className="grid h-9 w-9 place-items-center rounded-full text-stone-700 transition hover:bg-stone-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-stone-900 px-4 text-xs font-semibold text-white transition hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: 100vh Spatial Try-On Arc Hero */}
      <section ref={heroRef} className="spatial-hero" aria-label="Spatial Virtual Try-On Studio">
        {/* 1. Blurred Scandinavian Living Room */}
        <div ref={roomRef} className="room" aria-hidden="true" />

        {/* 2. Ghost FIT Word */}
        <div ref={ghostRef} className="ghost" aria-hidden="true">
          {["F", "I", "T"].map((ch, i) => (
            <span
              key={ch}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Top-left subtle brand pill */}
        <div className="hero-brand glass">
          <span>VirtualFit</span>
        </div>

        {/* 3. Top Pill Tab Bar */}
        <nav ref={tabsRef} className="tabs glass" aria-label="Product categories">
          <div ref={pillRef} className="pill" aria-hidden="true" />
          {CATEGORY_TABS.map((tab, i) => (
            <button
              key={tab}
              ref={(el) => {
                tabBtnRefs.current[i] = el;
              }}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={activeTab === tab ? "active" : ""}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Top-Right Storefront Actions */}
        <div className="top-actions glass">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setCatalogInitialCategory(activeTab === "Tops" ? "All" : activeTab);
              setCatalogOpen(true);
            }}
            aria-label="Open storefront catalog and search"
          >
            <Search className="h-4 w-4" />
            <span className="shop-label">Search</span>
          </button>
          <button
            type="button"
            onClick={() =>
              scrollToStorefront(activeTab === "Tops" ? "All" : activeTab)
            }
            aria-label="Scroll to full storefront"
          >
            <ArrowDown className="h-4 w-4" />
            <span className="shop-label">Store</span>
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="bag-pill"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="tabular-nums">{cartCount}</span>
          </button>
        </div>

        {/* 4. Left Glass Tool Rail */}
        <aside className="rail glass" aria-label="Workspace tools">
          <button
            type="button"
            className={!anyModalOpen ? "active" : ""}
            onClick={() => {
              setCatalogOpen(false);
              setCartOpen(false);
              setPlannerOpen(false);
              setProfileOpen(false);
              setDetailProduct(null);
              setCompareOpen(false);
            }}
            title="Spatial Try-On Studio"
            aria-label="Spatial Try-On Studio"
          >
            <Shirt
              className="h-5 w-5"
              fill={!anyModalOpen ? "currentColor" : "none"}
            />
          </button>

          <button
            type="button"
            className={cartOpen ? "active" : ""}
            onClick={() => setCartOpen(true)}
            title="Shopping Bag & Checkout"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span className="rail-badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className={plannerOpen ? "active" : ""}
            onClick={() => setPlannerOpen(true)}
            title="Outfit Lookbook & Size Guide"
            aria-label="Outfit Lookbook and Size Guide"
          >
            <Calendar className="h-5 w-5" />
          </button>

          <button
            type="button"
            className={profileOpen ? "active" : ""}
            onClick={() => setProfileOpen(true)}
            title="Profile, Wishlist & Orders"
            aria-label="Profile, Wishlist and Orders"
          >
            <User className="h-5 w-5" />
          </button>
        </aside>

        {/* 5. 3D Spatial Garment Arc Stage */}
        <main
          ref={stageRef}
          className="stage"
          onPointerDown={handleStagePointerDown}
          onPointerMove={handleStagePointerMove}
          onPointerUp={handleStagePointerUp}
          onPointerCancel={handleStagePointerUp}
          onWheel={handleStageWheel}
        >
          <div className="arc">
            {CARDS.map((item, i) => (
              <div
                key={`${item.n}-${i}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-idx={i}
                className="card glass"
                onPointerEnter={(e) => {
                  if (reducedMotion) return;
                  const el = e.currentTarget;
                  el.classList.remove("sheen-run");
                  void el.offsetWidth;
                  el.classList.add("sheen-run");
                }}
              >
                <div
                  className="g"
                  style={{ backgroundPosition: `${item.g[0]}% ${item.g[1]}%` }}
                />
                <div className="name">{item.n}</div>
                <div className="price">{formatPrice(item.p, currency)}</div>
                <div className="sheen" />
              </div>
            ))}
          </div>
        </main>

        {/* 6. Center Model + Scan-Line Reveal */}
        <div className="model" aria-hidden="true">
          <div id="mCur" ref={mCurRef} className="fig" />
          <div id="mNext" ref={mNextRef} className="fig" />
          <div ref={gridRef} className="grid" />
          <div ref={scanRef} className="scan" />
        </div>

        {/* 7. Side Navigation Arrows */}
        <button
          type="button"
          className="arrow-btn arrow-prev glass"
          onClick={() => {
            physRef.current.target -= 1;
          }}
          aria-label="Previous garment"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="arrow-btn arrow-next glass"
          onClick={() => {
            physRef.current.target += 1;
          }}
          aria-label="Next garment"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Quick Shop Category Prompt when non-Tops tab is selected */}
        {activeTab !== "Tops" && !anyModalOpen && (
          <button
            type="button"
            onClick={() => scrollToStorefront(activeTab)}
            className="glass absolute left-1/2 bottom-[calc(4.6vh+96px)] z-[60] -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold text-stone-900 shadow-lg transition hover:bg-white/60 max-md:bottom-[calc(2.4vh+136px)] dark:text-zinc-100 dark:hover:bg-white/15"
          >
            Shop {activeTab} Below &darr;
          </button>
        )}

        {/* 8. Bottom Glass Buy Card */}
        <section className="buy glass" aria-label="Selected garment purchase bar">
          <div
            className="thumb cursor-pointer"
            onClick={() => openProductDetail(activeProduct)}
            title="View product details"
          >
            <div
              ref={thumbImgRef}
              className="thumb-img"
              style={{
                backgroundPosition: `${activeItem.g[0]}% ${activeItem.g[1]}%`,
              }}
            />
          </div>

          <div className="info">
            <RollingLine
              text={activeItem.n}
              className="bname"
              reducedMotion={reducedMotion}
            />
            <RollingLine
              text={formatPrice(activeItem.p, currency)}
              className="bprice"
              reducedMotion={reducedMotion}
            />
          </div>

          <div className="sizes-wrap">
            <span className="lbl">Size</span>
            <div className="sizes" role="group" aria-label="Select size">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={selectedSize === s ? "active" : ""}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="colors-wrap">
            <RollingLine
              text={`Color · ${activeColor[0]}`}
              className="lbl"
              reducedMotion={reducedMotion}
            />
            <div className="colors" role="group" aria-label="Select color">
              {activeItem.c.map(([cname, hex], idx) => (
                <button
                  key={cname}
                  type="button"
                  aria-label={`Color ${cname}`}
                  title={cname}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={selectedColorIdx === idx ? "active" : ""}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <div className="cta-group">
            <button
              type="button"
              onClick={() =>
                addToBag(activeProduct, selectedSize, selectedColorIdx, 1)
              }
              className="add-bag-btn"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add to Bag</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(activeProduct.id)}
              aria-label={
                isCurrentWishlisted ? "Remove from wishlist" : "Save to wishlist"
              }
              title="Wishlist"
              className={`icon-btn ${isCurrentWishlisted ? "liked" : ""}`}
            >
              <Heart
                className="h-4 w-4"
                fill={isCurrentWishlisted ? "currentColor" : "none"}
              />
            </button>

            <button
              type="button"
              onClick={() => openProductDetail(activeProduct)}
              aria-label="Product specifications and reviews"
              title="Product Details"
              className="icon-btn"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </section>
      </section>

      {/* SECTION 2: Full E-Commerce Storefront */}
      <StorefrontSection
        currency={currency}
        onChangeCurrency={setCurrency}
        wishlist={wishlist}
        recentlyViewedIds={recentlyViewedIds}
        compareIds={compareIds}
        orders={orders}
        selectedCategory={storeCategory}
        onChangeCategory={setStoreCategory}
        onSelectProduct={openProductDetail}
        onTryOn={(idx) => focusSpatialItem(idx)}
        onAddToBag={(p, s, c) => addToBag(p, s, c, 1)}
        onToggleWishlist={toggleWishlist}
        onToggleCompare={toggleCompare}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenFitGuide={() => setPlannerOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onScrollToHero={scrollToHero}
      />

      {/* Added to Bag Feedback Toast */}
      {addedToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-full border border-stone-200 bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <span>{addedToast}</span>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-stone-900 dark:bg-zinc-100 dark:text-zinc-950"
          >
            View Bag
          </button>
        </div>
      )}

      {/* 58px Glass Cursor (active over .spatial-hero) */}
      <div
        ref={curRef}
        className="cur"
        data-mode="hidden"
        data-down="0"
        aria-hidden="true"
      >
        <div className="cur-ring" />
        <div className="cur-dot" />
        <span className="cur-lbl try">TRY ON</span>
        <span className="cur-lbl drag">DRAG</span>
      </div>

      {/* E-Commerce Drawers & Modals */}
      <CatalogDrawer
        key={catalogOpen ? `cat-${catalogInitialCategory}` : "cat-closed"}
        open={catalogOpen}
        initialCategory={catalogInitialCategory}
        currency={currency}
        wishlist={wishlist}
        onClose={() => setCatalogOpen(false)}
        onSelectProduct={openProductDetail}
        onTryOn={(idx) => {
          focusSpatialItem(idx);
          scrollToHero();
        }}
        onQuickAdd={(product, size, colorIdx) =>
          addToBag(product, size, colorIdx, 1)
        }
        onToggleWishlist={toggleWishlist}
      />

      <ProductDetailModal
        key={detailProduct?.id || "closed"}
        product={detailProduct}
        currency={currency}
        initialSize={selectedSize}
        initialColorIndex={
          detailProduct?.id === activeProduct.id ? selectedColorIdx : 0
        }
        isWishlisted={
          detailProduct ? wishlist.includes(detailProduct.id) : false
        }
        onClose={() => setDetailProduct(null)}
        onAddToBag={addToBag}
        onTryOn={(idx) => {
          focusSpatialItem(idx);
          scrollToHero();
        }}
        onToggleWishlist={toggleWishlist}
        onSaveLook={(p, s, c) => saveLook(p, s, c)}
      />

      <CompareModal
        open={compareOpen}
        products={comparedProducts}
        currency={currency}
        onClose={() => setCompareOpen(false)}
        onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        onAddToBag={(p) =>
          addToBag(p, p.sizes.includes(selectedSize) ? selectedSize : p.sizes[0], 0, 1)
        }
        onTryOn={(idx) => {
          focusSpatialItem(idx);
          scrollToHero();
        }}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        currency={currency}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onQuickAddProduct={(p) =>
          addToBag(p, p.sizes.includes(selectedSize) ? selectedSize : p.sizes[0], 0, 1)
        }
        onPlaceOrder={(order) => {
          setOrders((prev) => [order, ...prev]);
          setCart([]);
        }}
        onOpenOrders={() => setProfileOpen(true)}
      />

      <PlannerDrawer
        open={plannerOpen}
        currency={currency}
        activeSpatialIdx={activeIdx}
        activeSize={selectedSize}
        activeColorIdx={selectedColorIdx}
        looks={looks}
        onClose={() => setPlannerOpen(false)}
        onSaveCurrentLook={(day, occasion) =>
          saveLook(activeProduct, selectedSize, selectedColorIdx, day, occasion)
        }
        onRemoveLook={(id) =>
          setLooks((prev) => prev.filter((l) => l.id !== id))
        }
        onTryOn={(idx) => {
          focusSpatialItem(idx);
          scrollToHero();
        }}
        onAddLookToBag={(look) => {
          const prod = CATALOG.find((p) => p.id === look.productId);
          if (prod) {
            const cIdx = Math.max(
              0,
              prod.colors.findIndex(([n]) => n === look.colorName)
            );
            addToBag(prod, look.size, cIdx, 1);
          }
        }}
        onApplyRecommendedSize={(size) => {
          setSelectedSize(size);
          showToast(`Applied recommended size ${size}`);
        }}
      />

      <ProfileDrawer
        open={profileOpen}
        currency={currency}
        theme={theme}
        wishlist={wishlist}
        orders={orders}
        defaultSize={selectedSize}
        onClose={() => setProfileOpen(false)}
        onToggleWishlist={toggleWishlist}
        onTryOn={(idx) => {
          focusSpatialItem(idx);
          scrollToHero();
        }}
        onQuickAdd={(p, s) => addToBag(p, s, 0, 1)}
        onChangeDefaultSize={(s) => setSelectedSize(s)}
        onChangeTheme={(nextTheme) => setTheme(nextTheme)}
      />
    </>
  );
}
