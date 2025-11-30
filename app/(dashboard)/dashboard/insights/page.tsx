import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <div className="space-y-8 px-4 md:px-8">

      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Insights</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Deep analysis of your mindset based on all your reflections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Mindset Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs md:text-sm text-muted-foreground">
            <div><span className="font-medium text-foreground">Stability:</span> Medium</div>
            <div><span className="font-medium text-foreground">Self-talk:</span> Often negative</div>
            <div><span className="font-medium text-foreground">Triggers:</span> Work, guilt</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Cognitive Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs md:text-sm text-muted-foreground">
            <div>🔁 Overthinking — 32%</div>
            <div>⚠️ Catastrophizing — 22%</div>
            <div>👤 Personalization — 12%</div>
            <div>🏷️ Labeling — 8%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs md:text-sm text-muted-foreground">
          <p>• Najčešća tema je osjećaj da nisi “dovoljno dobar”.</p>
          <p>• Visoka introspekcija, ali i visoka odgovornost prema drugima.</p>
          <p>• Emocionalna nestabilnost kada imaš previše obaveza.</p>
        </CardContent>
      </Card>

    </div>
  );
}
