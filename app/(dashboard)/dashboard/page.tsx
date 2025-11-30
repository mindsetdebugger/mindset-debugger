import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 px-4 md:px-8">

      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Overview of your mindset and emotional trends.
        </p>
      </div>

      {/* TOP WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Today&apos;s Mindset Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl md:text-5xl font-bold">72</div>
            <p className="text-xs md:text-sm mt-2 text-muted-foreground">
              Improving this week. Keep going.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Emotional Tone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs md:text-sm">
            <div>😊 Calm — <span className="font-semibold">40%</span></div>
            <div>😟 Anxious — <span className="font-semibold">30%</span></div>
            <div>🔥 Motivated — <span className="font-semibold">20%</span></div>
            <div>😞 Sadness — <span className="font-semibold">10%</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Common Biases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs md:text-sm">
            <div>🔁 Overthinking — <span className="font-semibold">32%</span></div>
            <div>⚠️ Catastrophizing — <span className="font-semibold">22%</span></div>
            <div>👤 Personalization — <span className="font-semibold">12%</span></div>
            <div>🏷️ Labeling — <span className="font-semibold">8%</span></div>
          </CardContent>
        </Card>

      </div>

      {/* RECENT ENTRIES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">

          <Link href="/dashboard/history/1" className="block py-3 hover:bg-accent rounded px-2 transition">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <span className="text-xl md:text-2xl">😞</span>
                  Feeling overwhelmed
                </div>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  “Osjećao sam se loše jer…”
                </p>
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">05 Mar</div>
            </div>
          </Link>

        </CardContent>
      </Card>

      {/* GRAPH */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Weekly Emotional Trend</CardTitle>
        </CardHeader>
        <CardContent className="text-xs md:text-sm text-muted-foreground">
          (Graph placeholder — Recharts will be used)
          <pre className="text-[10px] md:text-xs leading-4 mt-3">
{`
100 |          ╭────╮
 80 |    ╭────╯    ╰───╮
 60 |  ╭─╯             ╰─╮
 40 | ╭╯                 ╰─╮
 20 |╯                     ╰
     Mon Tue Wed Thu Fri Sat Sun
`}
          </pre>
        </CardContent>
      </Card>

    </div>
  );
}
