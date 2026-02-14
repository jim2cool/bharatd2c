"use client";

import Image from "next/image";

type ThemeImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
};

export default function ThemeImage({
  src,
  alt,
  fill = true,
  className = "",
  priority = false,
}: ThemeImageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        className={`object-cover ${className}`}
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  );
}
