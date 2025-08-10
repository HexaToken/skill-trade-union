import Home from './Home';
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

  return <Home />;
};

export default Index;
