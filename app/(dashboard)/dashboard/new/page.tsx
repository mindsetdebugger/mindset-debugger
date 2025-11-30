"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewEntryPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState<any>(null);

  async function analyze() {
    setLoading(true);
    setAnalysis(null);

    setTimeout(() => {
      setAnalysis({
        emotion: "Anxious (40%), Frustrated (30%), Hopeful (20%)",
        summary:
          "Osjećao si se pod pritiskom zbog visokih očekivanja i straha od greške.",
        biases: ["Overthinking", "Catastrophizing"],
        recommendation:
          "Vježbaj razdvajanje kontrole: što je tvoja odgovornost, a što nije.",
      });
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="space-y-8 px-4 md:px-8">

      <div>
        <h1 className="text-xl md:text-2xl font-semibold">New Entry</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Write about your day — AI će napraviti detaljnu analizu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Your Reflection</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napiši kako si se osjećao danas..."
            className="min-h-[200px] md:min-h-[160px]"
          />

          <Button
            onClick={analyze}
            disabled={loading || !input.trim()}
            className="w-full md:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze with AI"}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="border-green-300 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm md:text-base">

            <div>
              <h3 className="font-medium">Emotional Tone</h3>
              <p className="text-muted-foreground">{analysis.emotion}</p>
            </div>

            <div>
              <h3 className="font-medium">Summary</h3>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>

            <div>
              <h3 className="font-medium">Patterns</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {analysis.biases.map((b: string, i: number) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Recommendation</h3>
              <p className="text-muted-foreground">{analysis.recommendation}</p>
            </div>

          </CardContent>
        </Card>
      )}

    </div>
  );
}
