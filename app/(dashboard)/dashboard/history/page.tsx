import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function HistoryPage() {
  const entries = [
    {
      id: 1,
      date: "05 Mar",
      emotion: "😞",
      title: "Feeling overwhelmed",
      preview: "Osjećao sam se loše jer sam opet imao osjećaj...",
    },
    {
      id: 2,
      date: "04 Mar",
      emotion: "😐",
      title: "Neutral day",
      preview: "Danas sam razmišljao o tome kako sve stići...",
    },
  ];

  return (
    <div className="space-y-8 px-4 md:px-8">

      <div>
        <h1 className="text-xl md:text-2xl font-semibold">History</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          All your past reflections and AI analyses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Entries</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">

          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/dashboard/history/${entry.id}`}
              className="block py-4 px-2 hover:bg-accent rounded transition"
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm md:text-base">
                    <span className="text-xl md:text-2xl">{entry.emotion}</span>
                    {entry.title}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {entry.preview}
                  </p>
                </div>

                <div className="text-xs md:text-sm text-muted-foreground">
                  {entry.date}
                </div>
              </div>
            </Link>
          ))}

        </CardContent>
      </Card>

    </div>
  );
}
