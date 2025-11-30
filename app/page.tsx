import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* TOP SECTION: SCORE + QUICK OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Mindset Score */}
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Today's Mindset Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">72</div>
            <p className="text-sm mt-2 text-muted-foreground">
              You’re improving this week. Keep going.
            </p>
          </CardContent>
        </Card>

        {/* Emotional Tone */}
        <Card>
          <CardHeader>
            <CardTitle>Emotional Tone</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>😊 Calm — <span className="font-semibold">40%</span></div>
            <div>😟 Anxious — <span className="font-semibold">30%</span></div>
            <div>🔥 Motivated — <span className="font-semibold">20%</span></div>
            <div>😞 Sadness — <span className="font-semibold">10%</span></div>
          </CardContent>
        </Card>

        {/* Cognitive Biases */}
        <Card>
          <CardHeader>
            <CardTitle>Common Biases</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div>🔁 Overthinking — <span className="font-semibold">32%</span></div>
            <div>⚠️ Catastrophizing — <span className="font-semibold">22%</span></div>
            <div>👤 Personalization — <span className="font-semibold">12%</span></div>
            <div>🏷️ Labeling — <span className="font-semibold">8%</span></div>
          </CardContent>
        </Card>

      </div>

      {/* RECENT ENTRIES SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            
            <Link href="/dashboard/history/entry/1" className="block py-3 hover:bg-accent transition rounded px-2">
              <div className="font-medium">05 March — Feeling overwhelmed</div>
              <div className="text-sm text-muted-foreground">
                “Osjećao sam se loše jer…”
              </div>
            </Link>

            <Link href="/dashboard/history/entry/2" className="block py-3 hover:bg-accent transition rounded px-2">
              <div className="font-medium">04 March — Reflecting on progress</div>
              <div className="text-sm text-muted-foreground">
                “Danas sam razmišljao o…”
              </div>
            </Link>

            <Link href="/dashboard/history/entry/3" className="block py-3 hover:bg-accent transition rounded px-2">
              <div className="font-medium">03 March — More energy today</div>
              <div className="text-sm text-muted-foreground">
                “Malo motiviraniji sam jer…”
              </div>
            </Link>

          </div>
        </CardContent>
      </Card>

      {/* GRAPH SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Emotional Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            (Graph placeholder — RECHARTS component will go here)
          </div>

          {/* Temporary simple ASCII graph */}
          <pre className="text-xs mt-3 leading-4">
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
