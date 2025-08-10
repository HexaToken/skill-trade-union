import AppLayout from "@/components/layout/AppLayout";

export default function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{desc}</p>
      </div>
    </AppLayout>
  );
}
