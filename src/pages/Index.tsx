import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { users, skills } from "@/mock/data";
import { useEffect } from "react";

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card className="glass">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);

const Index = () => {
  useEffect(() => {
    document.title = "SkillSwap — Trade skills, not cash";
  }, []);

  return (
    <AppLayout>
      <section className="relative overflow-hidden rounded-xl p-8 md:p-12 bg-gradient-brand text-primary-foreground shadow-elev">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Trade skills, not cash.</h1>
          <p className="mt-3 text-lg opacity-90">Teach what you know. Learn what you want. Your time and talent are the currency.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/matches">Find a Match</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/sessions/create">Offer a Skill</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>AI Matching</Badge>
            <Badge variant="secondary">Credits Wallet</Badge>
            <Badge variant="secondary">Group Classes</Badge>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard title="Active Skills" value={`${skills.length}+`} />
        <StatCard title="Featured Mentors" value={`${users.length}`} />
        <StatCard title="Credits Exchanged" value={`1,200+`} />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Featured skills</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {skills.map((s) => (
            <Card key={s.id} className="hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.category}</p>
                  </div>
                  <Badge variant="secondary">Demand {s.demandScore}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppLayout>
  );
};

export default Index;
