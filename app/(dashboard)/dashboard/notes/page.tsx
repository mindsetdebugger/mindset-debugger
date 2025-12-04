"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Tag,
  Pin,
  Trash2,
  Edit3,
  X,
  CalendarClock,
} from "lucide-react";
import clsx from "clsx";

// ---------------------------------------
// TAG COLORS
// ---------------------------------------
const tagColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
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
// PAGE COMPONENT
// ---------------------------------------
export default function NotesPage() {
  const supabase = supabaseBrowser();

  const [notes, setNotes] = useState<Note[]>([]);
  const [filtered, setFiltered] = useState<Note[]>([]);
  const [search, setSearch] = useState("");

  // modal states
  const [newNote, setNewNote] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);

  // form states
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

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setNotes(data);
        setFiltered(data);
      }
    })();
  }, []);

  // ---------------------------------------
  // SEARCH FILTER
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
  // SAVE NOTE
  // ---------------------------------------
  async function saveNote() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editNote) {
      // UPDATE
      const { data, error } = await supabase
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

      if (!error && data) {
        setNotes((prev) =>
          prev.map((n) => (n.id === data.id ? data : n))
        );
        setFiltered((prev) =>
          prev.map((n) => (n.id === data.id ? data : n))
        );
      }

      resetForm();
      return;
    }

    // NEW NOTE
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        title,
        content,
        tags,
      })
      .select("*")
      .single();

    if (!error && data) {
      setNotes((prev) => [data, ...prev]);
      setFiltered((prev) => [data, ...prev]);
    }

    resetForm();
  }

  // ---------------------------------------
  // DELETE NOTE
  // ---------------------------------------
  async function deleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);

    setNotes((prev) => prev.filter((n) => n.id !== id));
    setFiltered((prev) => prev.filter((n) => n.id !== id));
  }

  // ---------------------------------------
  // PIN NOTE
  // ---------------------------------------
  async function togglePin(note: Note) {
    const { data, error } = await supabase
      .from("notes")
      .update({ pinned: !note.pinned })
      .eq("id", note.id)
      .select("*")
      .single();

    if (!error && data) {
      const updated = notes
        .map((n) => (n.id === data.id ? data : n))
        .sort((a, b) => Number(b.pinned) - Number(a.pinned));

      setNotes(updated);
      setFiltered(updated);
    }
  }

  // ---------------------------------------
  // RESET FORM
  // ---------------------------------------
  function resetForm() {
    setNewNote(false);
    setEditNote(null);
    setTitle("");
    setContent("");
    setTags([]);
  }

  function toggleTag(tag: string) {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <div className="px-6 md:px-12 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📝 Notes</h1>
          <p className="text-slate-500">Čuvaj ideje, uvide, misli i refleksije.</p>
        </div>

        <Button onClick={() => setNewNote(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm ring-1 ring-slate-200">
        <Search className="w-5 h-5 text-slate-500" />
        <Input
          placeholder="Search notes..."
          className="border-0 shadow-none focus-visible:ring-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Notes Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filtered.map((note) => (
          <Card
            key={note.id}
            className="break-inside-avoid p-5 rounded-3xl shadow-sm ring-1 ring-slate-200 bg-white relative transition hover:shadow-lg"
          >
            {/* PIN BUTTON */}
            <button
              onClick={() => togglePin(note)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <Pin className={clsx("w-5 h-5", note.pinned && "text-indigo-600")} />
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
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
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

      {/* CREATE / EDIT MODAL */}
      {(newNote || editNote) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editNote ? "Edit Note" : "New Note"}
              </h2>
              <button onClick={resetForm}>
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <Input
              placeholder="Title"
              className="w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Your note..."
              className="w-full min-h-[150px] p-3 border rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* TAG SELECTOR */}
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Tags</p>
              <div className="flex flex-wrap gap-2">
                {["mindset", "emotion", "goal", "idea", "reflection"].map(
                  (tag, i) => (
                    <button
                      key={i}
                      className={clsx(
                        "px-3 py-1 rounded-xl text-xs font-medium ring-1",
                        tags.includes(tag)
                          ? "bg-indigo-600 text-white ring-indigo-600"
                          : "bg-slate-100 text-slate-600 ring-slate-300"
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </button>
                  )
                )}
              </div>
            </div>

            <Button onClick={saveNote} className="w-full">
              {editNote ? "Save Changes" : "Add Note"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
