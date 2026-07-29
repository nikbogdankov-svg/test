import { AskPanel } from "@/components/ask/AskPanel";
import { NavGuard } from "@/components/layout/NavGuard";

export default function AskPage() {
  return (
    <NavGuard navKey="ask">
      <AskPanel />
    </NavGuard>
  );
}
