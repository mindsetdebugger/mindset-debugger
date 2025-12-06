"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

type Props = {
  input: string;
  setInput: (v: string) => void;
  analyze: () => void;
  loading: boolean;
  errorMsg: string;
  loadingSummary: boolean;
};

export default function CheckInHero({
  input,
  setInput,
  analyze,
  loading,
  errorMsg,
  loadingSummary,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E2E9FF] via-[#D8E7FF] to-[#F8ECFF] px-6 py-10 md:px-10 md:py-12 shadow-[0_24px_60px_rgba(148,163,184,0.35)] border border-white">

      {/* Soft colored blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#B8C7FF]/50 blur-3xl" />
        <div className="absolute -left-16 bottom-[-80px] h-72 w-72 rounded-full bg-[#FBCFE8]/40 blur-3xl" />
      </div>

      <div className="relative max-w-2xl space-y-6">

        {/* Tag */}
        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] tracking-[0.16em] uppercase text-indigo-600 border border-indigo-100 shadow-sm">
          Daily check-in
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900">
          Kako si danas? Napiši i analizirat ću za tebe.
        </h1>

        {/* Subtitle */}
        <p className="text-slate-700 text-base md:text-lg max-w-xl">
          Napiši par iskrenih rečenica o tome što ti se vrti po glavi — AI će ih pretvoriti u jasne uvide, emocije i konkretne mikro-korake.
        </p>

        {/* Textarea */}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Primjer kako bi tvoj unos mogao izgledati:\n\nDanas sam se osjećao pod stresom jer kasnim s obavezama. Primijetio sam da odmah ujutro krenem razmišljati najgore. Tijekom dana sam bio preopterećen, ali nisam znao odakle krenuti. Brine me što ponavljam iste obrasce. Volio bih shvatiti što trebam promijeniti da se osjećam stabilnije.`}
          className="bg-white border-slate-200 rounded-2xl p-5 min-h-[220px] md:min-h-[260px] text-base md:text-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-300"
        />

        {errorMsg && (
          <p className="text-rose-500 text-sm">{errorMsg}</p>
        )}

        {/* Footer buttons */}
        <div className="flex justify-between items-center">
          {loadingSummary && (
            <p className="text-[11px] text-slate-500 animate-pulse">
              Ažuriram tvoje dugoročne uvide…
            </p>
          )}

          <Button
            onClick={analyze}
            disabled={loading}
            className="ml-auto bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-300/60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analiziram…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Pokreni analizu
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
