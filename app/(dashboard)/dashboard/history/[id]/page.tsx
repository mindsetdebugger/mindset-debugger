import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  params: { id: string };
}

export default function HistoryDetailPage({ params }: Props) {
  const data = {
    date: "05 Mar 2025",
    originalText:
      "Osjećao sam se loše jer sam opet imao osjećaj da sam zeznuo stvar...",
    emotions: {
      sadness: "40%",
      anxiety: "30%",
      frustration: "20%",
      calm: "10%",
    },
    summary:
      "Danas si osjećao pritisak i strah od greške zbog visokih očekivanja...",
    biases: ["Overthinking", "Catastrophizing"],
    recommendation:
      "Odvoji što je tvoja odgovornost, a što nije. Pogreška te ne definira.",
  };

  return (
    <div className="space-y-8 px-4 md:px-8">

      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Entry Details</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Reflection from {data.date}
        </p>
      </div>

      {/* USER TEXT */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base text-muted-foreground whitespace-pre-line">
            {data.originalText}
          </p>
        </CardContent>
      </Card>

      {/* EMOTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Emotional Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">

          <div className="p-4 border rounded-lg">
            <p className="text-2xl">😞</p>
            <p className="font-medium">Sadness</p>
            <p className="text-muted-foreground">{data.emotions.sadness}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-2xl">😟</p>
            <p className="font-medium">Anxiety</p>
            <p className="text-muted-foreground">{data.emotions.anxiety}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-2xl">😠</p>
            <p className="font-medium">Frustration</p>
            <p className="text-muted-foreground">{data.emotions.frustration}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-2xl">😊</p>
            <p className="font-medium">Calm</p>
            <p className="text-muted-foreground">{data.emotions.calm}</p>
          </div>

        </CardContent>
      </Card>

      {/* SUMMARY */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base text-muted-foreground">
            {data.summary}
          </p>
        </CardContent>
      </Card>

      {/* BIASES */}
      <Card>
        <CardHeader>
          <CardTitle>Thinking Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground">
            {data.biases.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* RECOMMENDATION */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base text-muted-foreground">
            {data.recommendation}
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
