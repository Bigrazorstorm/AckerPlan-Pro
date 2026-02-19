import dataService from "@/services";
import { MachineryClientContent } from "@/components/machinery/machinery-client-content";

export default async function MachineryPage() {
  // In a real app, tenantId and companyId would come from the user's session or context.
  // For now, we'll use dummy values.
  const tenantId = 'tenant-123';
  const companyId = 'company-456';
  
  const machinery = await dataService.getMachinery(tenantId, companyId);

  return (
    <MachineryClientContent machinery={machinery} />
  );
}
