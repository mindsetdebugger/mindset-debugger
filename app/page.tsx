import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="p-6">
        <CardTitle className="mb-4">Shadcn radi!</CardTitle>
        <CardContent>
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </main>
  );
}
