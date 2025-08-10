import AppLayout from "@/components/layout/AppLayout";
import { users, skills } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const user = users[0];
  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold">Welcome, {user.name.split(' ')[0]}</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="glass">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Suggested match</p>
            <p className="mt-1 font-medium">{users[1].name}</p>
            <div className="mt-2 flex gap-2">
              {users[1].skillsOffered.map((o) => (
                <Badge key={o.skillId} variant="secondary">{skills.find(s=>s.id===o.skillId)?.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Upcoming sessions</p>
            <p className="mt-1 text-2xl font-semibold">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Wallet</p>
            <p className="mt-1 text-2xl font-semibold">{user.wallet.credits} cr</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
