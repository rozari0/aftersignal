import type { StoryContent } from "@/data/types";

export function StoryBody({ story }: { story: StoryContent }) {
  return (
    <div className="space-y-3 font-serif text-[19px] leading-[1.5] text-text">
      {story.body.split("\n\n").map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
