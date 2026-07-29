import { NavGuard } from "@/components/layout/NavGuard";
import { RequestsHome } from "@/components/requests/RequestsHome";

export default function RequestsPage() {
  return (
    <NavGuard navKey="requests">
      <RequestsHome />
    </NavGuard>
  );
}
