import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combine } from 'lucide-react';

export default function OperationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operations</CardTitle>
        <CardDescription>
          Log all production measures and resource usage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
          <Combine className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Activity Logging Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            The mobile-first interface to efficiently capture all production measures (e.g., tillage, seeding, harvesting) will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
