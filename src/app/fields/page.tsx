import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';

export default function FieldsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fields</CardTitle>
        <CardDescription>
          Manage your field boundaries and view GIS data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
          <Map className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">GIS Map View Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            An interactive map to view and select your fields, import GIS data, and overlay observation information will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
