import { CalendarDays } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function AppointmentsPage() {
  return <PagePlaceholder eyebrow="Schedule" title="Appointments" description="A clear view of every visit, all in one place." icon={CalendarDays} />;
}
