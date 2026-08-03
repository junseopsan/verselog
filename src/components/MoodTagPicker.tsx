"use client";

import { MOODS } from "@/lib/constants";

export default function MoodTagPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (moods: string[]) => void;
}) {
  const toggle = (mood: string) => {
    onChange(
      selected.includes(mood)
        ? selected.filter((m) => m !== mood)
        : [...selected, mood],
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((mood) => {
        const active = selected.includes(mood);
        return (
          <button
            key={mood}
            type="button"
            onClick={() => toggle(mood)}
            aria-pressed={active}
            className={`press min-h-11 rounded-full border px-4 text-sm ${
              active
                ? "border-accent bg-accent/15 text-accent"
                : "border-edge bg-surface text-muted"
            }`}
          >
            {mood}
          </button>
        );
      })}
    </div>
  );
}
