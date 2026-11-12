import Image from "next/image";
import type { ImageRef } from "@/data/types";
import { cn } from "@/lib/cn";

export function PostMedia({ media, muted = false }: { media: ImageRef; muted?: boolean }) {
  return (
    <figure className="overflow-hidden border-2 border-rule bg-panel">
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes="(min-width: 1024px) 640px, 100vw"
        className={cn(
          "h-auto w-full object-cover transition-[filter] duration-300",
          muted && "grayscale contrast-125",
        )}
        style={{ objectPosition: media.focus }}
      />
      <figcaption className="flex justify-between gap-3 border-t-2 border-rule bg-panel px-3 py-1.5 font-mono text-micro uppercase tracking-wider text-text">
        <span>{media.credit}</span>
        {media.nasaId ? (
          <a
            href={`https://images.nasa.gov/details/${media.nasaId}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold underline underline-offset-2 hover:bg-amber"
          >
            {media.nasaId} ↗
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}
