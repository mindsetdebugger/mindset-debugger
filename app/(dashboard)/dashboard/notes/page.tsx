"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  X,
  CalendarClock,
  Tag,
} from "lucide-react";

import clsx from "clsx";

// ---------------------------------------
// TAG COLORS — pastel + soft text
// ---------------------------------------
const tagColors = [
  "bg-indigo-50 text-indigo-700 border border-indigo-100",
  "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "bg-rose-50 text-rose-700 border border-rose-100",
  "bg-amber-50 text-amber-700 border border-amber-100",
  "bg-sky-50 text-sky-700 border border-sky-100",
];

// ---------------------------------------
// NOTE TYPE
// ---------------------------------------
type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

// ---------------------------------------
// PAGE
// ---------------------------------------
export default function NotesPage() {
  const supabase = supabaseBrowser();

  const [notes, setNotes] = useState<Note[]>([]);
  const [filtered, setFiltered] = useState<Note[]>([]);
  const [search, setSearch] = useState("");

  // modal states
  const [newNote, setNewNote] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);

  // form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // ---------------------------------------
  // LOAD NOTES
  // ---------------------------------------
  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) return;

      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (data) {
        setNotes(data);
        setFiltered(data);
      }
    })();
  }, []);

  // ---------------------------------------
  // SEARCH
  // ---------------------------------------
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      notes.filter(
        (n) =>
          n.title.toLowerCase().includes(s) ||
          n.content.toLowerCase().includes(s) ||
          n.tags.some((t) => t.toLowerCase().includes(s))
      )
    );
  }, [search, notes]);

  // ---------------------------------------
  // FORMAT DATE
  // ---------------------------------------
  function fmt(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ---------------------------------------
  // SAVE NOTE (ADD / UPDATE)
  // ---------------------------------------
  async function saveNote() {
    const { data: session } = await supabase.auth.getUser();
    const user = session?.user;
    if (!user) return;

    if (editNote) {
      // UPDATE
      const { data } = await supabase
        .from("notes")
        .update({
          title,
          content,
          tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editNote.id)
        .select("*")
        .single();

      if (data) {
        setNotes((prev) => prev.map((n) => (n.id === data.id ? data : n)));
        setFiltered((prev) => prev.map((n) => (n.id === data.id ? data : n)));
      }

      resetForm();
      return;
    }

    // NEW
    const { data } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title,
        content,
        tags,
      })
      .select("*")
      .single();

    if (data) {
      setNotes((prev) => [data, ...prev]);
      setFiltered((prev) => [data, ...prev]);
    }

    resetForm();
  }

  // ---------------------------------------
  // DELETE
  // ---------------------------------------
  async function deleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setFiltered((prev) => prev.filter((n) => n.id !== id));
  }

  // ---------------------------------------
  // PIN
  // ---------------------------------------
  async function togglePin(note: Note) {
    const { data } = await supabase
      .from("notes")
      .update({ pinned: !note.pinned })
      .eq("id", note.id)
      .select("*")
      .single();

    if (data) {
      const updated = notes
        .map((n) => (n.id === data.id ? data : n))
        .sort((a, b) => Number(b.pinned) - Number(a.pinned));

      setNotes(updated);
      setFiltered(updated);
    }
  }

  // ---------------------------------------
  // HELPERS
  // ---------------------------------------
  function resetForm() {
    setNewNote(false);
    setEditNote(null);
    setTitle("");
    setContent("");
    setTags([]);
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // ---------------------------------------
  // RENDER
  // ---------------------------------------
  return (
    <div className="px-6 md:px-12 py-10 space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📝 Notes</h1>
          <p className="text-slate-500">Čuvaj uvide, misli, ideje i refleksije.</p>
        </div>

        <Button
          onClick={() => setNewNote(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-200">
        <Search className="w-5 h-5 text-slate-500" />
        <Input
          placeholder="Search notes..."
          className="border-0 shadow-none focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID — MASONRY */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filtered.map((note) => (
          <Card
            key={note.id}
            className="break-inside-avoid p-5 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 relative hover:shadow-md transition"
          >
            {/* PIN ICON */}
            <button
              onClick={() => togglePin(note)}
              className={clsx(
                "absolute top-4 right-4 transition",
                note.pinned
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-700"
              )}
            >
              <Pin className="w-5 h-5" />
            </button>

            {/* TITLE */}
            <h3 className="text-lg font-semibold text-slate-900">{note.title}</h3>

            {/* DATE */}
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <CalendarClock className="w-3 h-3" />
              {fmt(note.created_at)}
            </p>

            {/* CONTENT */}
            <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">
              {note.content}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-4">
              {note.tags.map((tag, i) => (
                <span
                  key={i}
                  className={
                    "px-2 py-1 rounded-xl text-xs font-medium " +
                    tagColors[i % tagColors.length]
                  }
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <button
                className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
                onClick={() => {
                  setEditNote(note);
                  setTitle(note.title);
                  setContent(note.content);
                  setTags(note.tags);
                }}
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>

              <button
                className="text-slate-400 hover:text-rose-600 flex items-center gap-1"
                onClick={() => deleteNote(note.id)}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      {(newNote || editNote) && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-5">

            {/* TOP */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {editNote ? "Edit Note" : "New Note"}
              </h2>
              <button onClick={resetForm}>
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* TITLE */}
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
            />

            {/* CONTENT */}
            <textarea
              placeholder="Your note..."
              className="w-full min-h-[150px] p-3 rounded-xl border border-slate-300 text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* TAG SELECT */}
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Tags</p>

              <div className="flex flex-wrap gap-2">
                {["mindset", "emotion", "goal", "idea", "reflection"].map(
                  (tag, i) => (
                    <button
                      key={i}
                      onClick={() => toggleTag(tag)}
                      className={clsx(
                        "px-3 py-1 rounded-xl text-xs font-medium ring-1",

                        tags.includes(tag)
                          ? "bg-indigo-600 text-white ring-indigo-600"
                          : "bg-slate-100 text-slate-600 ring-slate-300"
                      )}
                    >
                      #{tag}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <Button onClick={saveNote} className="w-full rounded-xl">
              {editNote ? "Save Changes" : "Add Note"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
