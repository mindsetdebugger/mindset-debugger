"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

// -------------------------------
// TYPES
// -------------------------------

export interface SaveNotePayload {
  title: string;
  content: string;
  tags?: string[];
}

export interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[] | null;
  created_at: string;
}

export interface SaveNoteResult {
  data?: NoteRow;
  error?: any;
}

// -------------------------------
// HOOK
// -------------------------------

export function useSaveToNotes() {
  const supabase = supabaseBrowser();
  const [loading, setLoading] = useState(false);

  async function saveToNotes({
    title,
    content,
    tags = [],
  }: SaveNotePayload): Promise<SaveNoteResult> {
    setLoading(true);

    try {
      // get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user)
        return {
          error: "Not logged in",
        };

      // Insert note
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title,
          content,
          tags,
          created_at: new Date().toISOString(), // optional, supabase auto-fills
        })
        .select("*")
        .single();

      if (error) {
        console.error("SAVE NOTE ERROR:", error);
        return { error };
      }

      return { data: data as NoteRow };
    } catch (err: any) {
      console.error(err);
      return { error: err.message || err };
    } finally {
      setLoading(false);
    }
  }

  return { saveToNotes, loading };
}
