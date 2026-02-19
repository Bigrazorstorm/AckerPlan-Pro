import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>
          Analyze costs, contribution margins, and overall performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
          <BarChart3 className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Analytics & Reports Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            Dashboards and reports for transparent insights into full costs, contribution margins, labor hours, and machinery costs will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
