import { NavGuard } from "@/components/layout/NavGuard";
import { AuditLogs } from "@/components/audit/AuditLogs";

export default function AuditPage() {
  return (
    <NavGuard navKey="audit">
      <AuditLogs />
    </NavGuard>
  );
}
