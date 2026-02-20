import { MachineryClientContent } from "@/components/machinery/machinery-client-content";

export default function MachineryPage() {
  // Data fetching is moved to the client component to use the session context.
  return (
    <MachineryClientContent />
  );
}
