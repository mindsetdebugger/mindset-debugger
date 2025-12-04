"use client";

import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSaveToNotes } from "@/app/hooks/useSaveToNotes";

export function SaveToNotesButton({
  title,
  content,
  tags = [],
}: {
  title: string;
  content: string | string[];
  tags?: string[];
}) {
  const { saveToNotes, loading } = useSaveToNotes();

  async function handleClick() {
    const cleaned = Array.isArray(content)
      ? content.join("\n")
      : content;

    await saveToNotes({
      title,
      content: cleaned,
      tags,
    });
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex items-center gap-1"
      onClick={handleClick}
      disabled={loading}
    >
      <NotebookPen className="w-4 h-4" />
      {loading ? "Saving..." : "Save"}
    </Button>
  );
}
