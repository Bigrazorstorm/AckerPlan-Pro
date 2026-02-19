import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Siren } from 'lucide-react';

export default function ObservationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observations</CardTitle>
        <CardDescription>
          Document crop growth, damages, and other field observations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
          <Siren className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Observation Logging Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            The tool for geo-referenced documentation of field observations, including attaching photos and notes, will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
