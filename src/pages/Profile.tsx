import { users } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const u = users[0];
  return (
    <div className="page-container section-spacing">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1 glass">
          <CardContent className="p-4">
            <h1 className="text-xl font-semibold">{u.name}</h1>
            <p className="text-sm text-muted-foreground">{u.location.city}, {u.location.country}</p>
            <p className="mt-3 text-sm">{u.bio}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <h2 className="font-medium">Skills & Availability</h2>
            <p className="text-sm text-muted-foreground mt-2">More details coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
