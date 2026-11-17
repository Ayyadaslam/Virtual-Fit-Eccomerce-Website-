import { useState } from "react";
import { Shirt } from "lucide-react";

interface ProductVisualProps {
  name: string;
  g?: [number, number];
  image?: string;
  className?: string;
  insetClass?: string;
}

export function ProductVisual({
  name,
  g,
  image,
  className = "",
  insetClass = "inset-2",
}: ProductVisualProps) {
  const [imgError, setImgError] = useState(false);

  if (g) {
    return (
      <div
        className={`relative overflow-hidden bg-stone-100/80 dark:bg-zinc-800/80 ${className}`}
        aria-label={name}
      >
        <div
          className={`absolute ${insetClass} bg-no-repeat drop-shadow-[0_10px_10px_rgba(40,30,20,0.18)]`}
          style={{
            backgroundImage: "var(--garm)",
            backgroundSize: "320% 212.5%",
            backgroundPosition: `${g[0]}% ${g[1]}%`,
          }}
        />
      </div>
    );
  }

  if (image && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#ece8e1] dark:bg-zinc-800 ${className}`}>
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-1.5 overflow-hidden bg-gradient-to-br from-stone-200 to-stone-300 text-stone-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-300 ${className}`}
    >
      <Shirt className="h-6 w-6 opacity-60" strokeWidth={1.6} />
      <span className="px-2 text-center text-[11px] font-medium leading-tight opacity-75">
        {name}
      </span>
    </div>
  );
}
