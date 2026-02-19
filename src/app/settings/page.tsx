import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage master data, user roles, and system configurations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center gap-4 py-24 border-2 border-dashed rounded-lg">
          <Settings className="w-16 h-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">System Settings Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            Configuration for master data (crops, materials, prices), user permissions, and other system-wide settings will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
