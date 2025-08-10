import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tx, users } from "@/mock/data";

export default function WalletPage() {
  const user = users[0];
  const myTx = tx.filter((t) => t.userId === user.id);
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Credits Wallet</h1>
        <div className="flex gap-2">
          <Button variant="secondary">Earn Credits</Button>
          <Button>Donate</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass md:col-span-1">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="mt-1 text-3xl font-semibold">{user.wallet.credits} cr</p>
            <p className="text-xs text-muted-foreground mt-1">Pro users keep credits forever.</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {myTx.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3 capitalize">{row.type}</td>
                    <td className="p-3">{row.amount > 0 ? `+${row.amount}` : row.amount} cr</td>
                    <td className="p-3">{new Date(row.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
