import type { StoryContent } from "@/data/types";

export function StoryBody({ story }: { story: StoryContent }) {
  return (
    <div className="max-w-[68ch] space-y-3 font-head text-[19px] font-medium leading-[1.5] tracking-[-0.01em] text-text">
      {story.body.split("\n\n").map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
