"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEntries } from "@/lib/useEntries";
import EntryForm from "@/components/EntryForm";

export default function WritePage() {
  return (
    <Suspense>
      <WriteInner />
    </Suspense>
  );
}

function WriteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { entries, addEntry, updateEntry } = useEntries();

  if (entries === null) {
    return <div className="h-96 animate-pulse rounded-2xl bg-surface" />;
  }

  const editing = editId ? entries.find((e) => e.id === editId) : undefined;

  if (editId && !editing) {
    return (
      <p className="pt-10 text-center text-sm text-muted">
        기록을 찾을 수 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">
          {editing ? "기록 수정" : "오늘의 기록"}
        </h1>
        <div aria-hidden className="mt-3 h-px w-10 bg-accent/70" />
      </header>
      <EntryForm
        key={editing?.id ?? "new"}
        initial={editing}
        submitLabel={editing ? "수정 저장" : "저장하기"}
        onSubmit={(input) => {
          if (editing) {
            updateEntry(editing.id, input);
            router.push(`/entry?id=${editing.id}`);
          } else {
            const entry = addEntry(input);
            router.push(`/entry?id=${entry.id}&saved=1`);
          }
        }}
      />
    </div>
  );
}
