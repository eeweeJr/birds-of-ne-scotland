"use client";

import { useState } from "react";
import Image from "next/image";
import { getBirdImagePath, PLACEHOLDER_IMAGE } from "@/lib/images";

interface BirdImageProps {
  slug: string;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function BirdImage({ slug, name, className = "", sizes, priority }: BirdImageProps) {
  const [src, setSrc] = useState(getBirdImagePath(slug));

  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      className={`object-cover ${className}`}
      priority={priority}
      onError={() => setSrc(PLACEHOLDER_IMAGE)}
    />
  );
}
