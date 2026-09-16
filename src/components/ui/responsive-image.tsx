import Image from "next/image";
import type { MediaAsset } from "@/types/content";
import { presentation } from "@/data/content/presentation";

export function ResponsiveImage({ asset, priority = false, sizes = "(max-width: 767px) 100vw, 50vw", className = "" }: {
  asset: MediaAsset; priority?: boolean; sizes?: string; className?: string;
}) {
  if (!asset.src) return <div className={`image-placeholder ${className}`} role="img" aria-label={presentation.photoMissing}>
    <span className="photo-outline" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><rect x="9" y="13" width="46" height="38" rx="6" /><circle cx="24" cy="26" r="5" /><path d="m11 45 15-13 10 9 8-8 10 10" /></svg></span>
    <span>{presentation.photoMissing}</span>
  </div>;
  return <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes={sizes} priority={priority} className={className} />;
}
