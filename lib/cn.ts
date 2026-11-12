import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Custom font-size roles from globals.css; without this twMerge reads them as colors. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["micro", "label", "meta", "small", "body-sm", "body", "body-lg"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
