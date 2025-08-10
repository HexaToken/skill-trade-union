import AppLayout from "@/components/layout/AppLayout";
import { users, skills } from "@/mock/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function fitPercent(userId: string) {
  // simple mock: average demand of offered skills
  const u = users.find((u) => u.id === userId)!;
  const offered = u.skillsOffered.map((o) => skills.find((s) => s.id === o.skillId)?.demandScore || 50);
  const avg = offered.reduce((a, b) => a + b, 0) / offered.length;
  return Math.round(avg);
}

export default function MatchesPage() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">AI Match Results</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {users.map((u) => (
          <Card key={u.id} className="glass hover-scale">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.location.city}, {u.location.country} • {u.languages.join(', ')}</p>
                </div>
                <Badge>Fit {fitPercent(u.id)}%</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {u.skillsOffered.map((o) => {
                  const s = skills.find((s) => s.id === o.skillId)!;
                  return <Badge variant="secondary" key={s.id}>{s.name} • L{o.level}</Badge>;
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <Button>Request Session</Button>
                <Button variant="secondary">View Profile</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
