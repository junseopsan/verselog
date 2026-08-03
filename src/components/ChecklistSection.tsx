"use client";

import { CHECKLIST_ITEMS } from "@/lib/constants";
import CheckRow from "./CheckRow";

export default function ChecklistSection({
  checked,
  onChange,
}: {
  checked: boolean[];
  onChange: (next: boolean[]) => void;
}) {
  return (
    <ul className="space-y-2">
      {CHECKLIST_ITEMS.map((item, i) => (
        <li key={item}>
          <CheckRow
            checked={checked[i] ?? false}
            onChange={(value) => {
              const next = [...checked];
              next[i] = value;
              onChange(next);
            }}
          >
            {item}
          </CheckRow>
        </li>
      ))}
    </ul>
  );
}
