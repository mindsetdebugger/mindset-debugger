// lib/trends-helpers.ts

export type EntryRow = {
  created_at: string;
  analysis: any;
};

/* ------------------------- UTIL: week key ------------------------- */

function getWeekKey(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth(); // 0-based
  const d = date.getDate();  // 1–31
  const weekInMonth = Math.floor((d - 1) / 7) + 1;
  return `${y}-${String(m + 1).padStart(2, "0")}-W${weekInMonth}`;
}

/* ---------------------- MINDSET SCORE SERIES ---------------------- */

export function buildMindsetSeries(entries: EntryRow[]) {
  return entries
    .map((e) => {
      const score = e.analysis?.mindset_score;
      if (typeof score !== "number") return null;

      const date = new Date(e.created_at);
      return {
        dateLabel: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        }),
        score,
      };
    })
    .filter(Boolean) as { dateLabel: string; score: number }[];
}

/* ----------------- EMOTIONAL INTENSITY TREND SERIES ---------------- */

export function buildEmotionIntensitySeries(entries: EntryRow[]) {
  return entries
    .map((e) => {
      const primary = e.analysis?.emotions?.primary || [];
      if (!Array.isArray(primary) || primary.length === 0) return null;

      const avgIntensity =
        primary.reduce(
          (sum: number, emo: any) => sum + (emo.intensity ?? 0),
          0
        ) / primary.length;

      const date = new Date(e.created_at);
      return {
        dateLabel: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        }),
        intensity: Math.round(avgIntensity),
      };
    })
    .filter(Boolean) as { dateLabel: string; intensity: number }[];
}

/* ------------------------- EMOTION DISTRIBUTION -------------------- */

export function buildEmotionDistribution(entries: EntryRow[]) {
  const counts = new Map<string, number>();

  for (const e of entries) {
    const primary = e.analysis?.emotions?.primary || [];
    if (!Array.isArray(primary)) continue;

    for (const emo of primary) {
      const name = (emo.emotion || "other").toString().toLowerCase();
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;

  return Array.from(counts.entries())
    .map(([emotion, count]) => ({
      emotion,
      value: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);
}

/* ---------------------- COGNITIVE PATTERN FREQUENCY ---------------- */

export function buildPatternFrequency(entries: EntryRow[]) {
  const counts = new Map<string, number>();

  for (const e of entries) {
    const patterns = e.analysis?.cognitive_patterns || [];
    if (!Array.isArray(patterns)) continue;

    for (const p of patterns) {
      const name = (p.name || "unknown").toString().toLowerCase();
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count);
}

/* --------------------------- WEEKLY SUMMARY ------------------------ */

export type WeeklySummary = {
  key: string;
  label: string;
  avgMindset: number | null;
  dominantEmotion: string | null;
  dominantPattern: string | null;
  entriesCount: number;
};

export function buildWeeklySummaries(entries: EntryRow[]): WeeklySummary[] {
  const bucket: Record<string, EntryRow[]> = {};

  for (const e of entries) {
    const date = new Date(e.created_at);
    const key = getWeekKey(date);
    if (!bucket[key]) bucket[key] = [];
    bucket[key].push(e);
  }

  const weeks: WeeklySummary[] = Object.entries(bucket).map(
    ([key, weekEntries]) => {
      // avg mindset
      const scores = weekEntries
        .map((e) => e.analysis?.mindset_score)
        .filter((n: any) => typeof n === "number");
      const avgMindset =
        scores.length > 0
          ? Math.round(
              scores.reduce((a: number, b: number) => a + b, 0) / scores.length
            )
          : null;

      // emotions
      const emoCounts = new Map<string, number>();
      for (const e of weekEntries) {
        const primary = e.analysis?.emotions?.primary || [];
        for (const emo of primary) {
          const name = (emo.emotion || "other").toString().toLowerCase();
          emoCounts.set(name, (emoCounts.get(name) ?? 0) + 1);
        }
      }
      const dominantEmotion =
        Array.from(emoCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        null;

      // patterns
      const patternCounts = new Map<string, number>();
      for (const e of weekEntries) {
        const patterns = e.analysis?.cognitive_patterns || [];
        for (const p of patterns) {
          const name = (p.name || "unknown").toString().toLowerCase();
          patternCounts.set(name, (patternCounts.get(name) ?? 0) + 1);
        }
      }
      const dominantPattern =
        Array.from(patternCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
        null;

      const [year, month, week] = key.split("-");
      const label = `Week ${week.replace("W", "")} • ${month}/${year}`;

      return {
        key,
        label,
        avgMindset,
        dominantEmotion,
        dominantPattern,
        entriesCount: weekEntries.length,
      };
    }
  );

  // posloži prema ključu (najnoviji zadnji u keyju, pa descending)
  return weeks.sort((a, b) => (a.key < b.key ? 1 : -1));
}

/* --------------------------- AI FORECAST TEXT ---------------------- */

export function deriveForecast(trendsPage: any | null): string {
  if (!trendsPage) {
    return "Nema još dovoljno podataka za pouzdanu prognozu. Nastavi unositi zapise nekoliko dana za redom.";
  }

  const parts: string[] = [];

  if (trendsPage.stress_trend === "down") {
    parts.push("Tvoj stres se postupno smanjuje, što znači da nalaziš načine kako ga regulirati.");
  } else if (trendsPage.stress_trend === "up") {
    parts.push("Razina stresa je u blagom porastu, pa je važno da ubaciš više pauza i mikro-odmora.");
  }

  if (trendsPage.resilience_trend === "up") {
    parts.push("Otpornost i kapacitet za povratak nakon teških dana raste.");
  } else if (trendsPage.resilience_trend === "down") {
    parts.push("Otpornost je osjetljivija nego prije – nježni tempo i podržavajuće okruženje su ti sada posebno važni.");
  }

  if (trendsPage.avg_mindset_score != null) {
    const s = trendsPage.avg_mindset_score;
    if (s >= 70) {
      parts.push("Općenito si u solidnoj zoni, s povremenim padovima koji su više signali umora nego neuspjeha.");
    } else if (s >= 40) {
      parts.push("Nalaziš se u prijelaznoj zoni — ima i težih i lakših dana, ali radiš na tome da se pomakneš prema zelenom području.");
    } else {
      parts.push("Prosječan mindset score je niži, što je poziv da smanjiš pritisak i fokusiraš se na male, izvedive korake.");
    }
  }

  if (parts.length === 0) {
    return "Tvoji obrasci su još u formiranju. Svaki novi unos pomaže da tvoja buduća prognoza bude jasnija i konkretnija.";
  }

  return parts.join(" ");
}
