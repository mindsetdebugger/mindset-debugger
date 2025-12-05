"use client";
import { create } from "zustand";
import { supabaseBrowser } from "@/lib/supabase/client";

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

type NotesState = {
  loading: boolean;
  loadedOnce: boolean;

  notes: Note[];
  filtered: Note[];
  search: string;

  newNote: boolean;
  editNote: Note | null;

  title: string;
  content: string;
  tags: string[];

  loadNotes: () => Promise<void>;
  setSearch: (s: string) => void;

  openNew: () => void;
  openEdit: (n: Note) => void;
  closeModal: () => void;

  toggleTag: (tag: string) => void;

  addNote: () => Promise<void>;
  updateNote: () => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (n: Note) => Promise<void>;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  loading: false,
  loadedOnce: false,

  notes: [],
  filtered: [],
  search: "",

  newNote: false,
  editNote: null,

  title: "",
  content: "",
  tags: [],

  // =============================================
  async loadNotes() {
    const { loadedOnce, loading } = get();
    if (loadedOnce || loading) return;

    set({ loading: true });

    const supabase = supabaseBrowser();
    const { data: session } = await supabase.auth.getUser();
    const user = session?.user;
    if (!user) {
      set({ loading: false });
      return;
    }

    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    set({
      notes: data || [],
      filtered: data || [],
      loadedOnce: true,
      loading: false,
    });
  },

  // =============================================
  setSearch(s) {
    const term = s.toLowerCase();

    const { notes } = get();
    const filtered = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term) ||
        n.tags.some((t) => t.toLowerCase().includes(term))
    );

    set({ search: s, filtered });
  },

  // =============================================
  openNew() {
    set({
      newNote: true,
      editNote: null,
      title: "",
      content: "",
      tags: [],
    });
  },

  openEdit(note) {
    set({
      editNote: note,
      newNote: false,
      title: note.title,
      content: note.content,
      tags: note.tags,
    });
  },

  closeModal() {
    set({
      newNote: false,
      editNote: null,
      title: "",
      content: "",
      tags: [],
    });
  },

  toggleTag(tag) {
    const { tags } = get();
    if (tags.includes(tag)) {
      set({ tags: tags.filter((t) => t !== tag) });
    } else {
      set({ tags: [...tags, tag] });
    }
  },

  // =============================================
  async addNote() {
    const supabase = supabaseBrowser();
    const { title, content, tags, notes } = get();

    const { data: session } = await supabase.auth.getUser();
    const user = session?.user;
    if (!user) return;

    const { data } = await supabase
      .from("notes")
      .insert({ user_id: user.id, title, content, tags })
      .select("*")
      .single();

    if (data) {
      const list = [data, ...notes];
      set({
        notes: list,
        filtered: list,
      });
    }

    get().closeModal();
  },

  // =============================================
  async updateNote() {
    const supabase = supabaseBrowser();
    const { editNote, title, content, tags, notes } = get();
    if (!editNote) return;

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
      const updated = notes.map((n) => (n.id === data.id ? data : n));

      set({
        notes: updated,
        filtered: updated,
      });
    }

    get().closeModal();
  },

  // =============================================
  async deleteNote(id) {
    const supabase = supabaseBrowser();
    await supabase.from("notes").delete().eq("id", id);

    const { notes } = get();

    const updated = notes.filter((n) => n.id !== id);
    set({
      notes: updated,
      filtered: updated,
    });
  },

  // =============================================
  async togglePin(note) {
    const supabase = supabaseBrowser();
    const { notes } = get();

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

      set({ notes: updated, filtered: updated });
    }
  },
}));
