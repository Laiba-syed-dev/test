"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Eye,
  HeartPulse,
  LayoutDashboard,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Doctors", href: "/doctors", icon: Stethoscope },
  { label: "Patients", href: "/patients", icon: UsersRound },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [previewRole, setPreviewRole] = useState<"Admin" | "Doctor">("Admin");
  const current = navigation.find((item) => item.href === pathname) ?? navigation[0];

  return (
    <div className="min-h-screen">
      <aside className="sidebar fixed inset-y-0 left-0 z-20 flex w-[250px] flex-col border-r border-line bg-white px-5 py-6">
        <Link href="/" className="mb-10 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-teal text-white"><HeartPulse size={20} /></span>
          <span className="brand-copy"><span className="block font-display text-[17px] font-extrabold tracking-tight">carepoint<span className="text-teal">.</span></span><span className="block text-[11px] font-medium text-muted">HOSPITAL MANAGEMENT</span></span>
        </Link>

        <div className="sidebar-label mb-3 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#A2AFB3]">Workspace</div>
        <nav className="space-y-1" aria-label="Main navigation">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`nav-link flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${active ? "active" : "text-muted hover:bg-canvas"}`}>
                <Icon className="nav-icon h-[18px] w-[18px]" />
                <span className="nav-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-label mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-[#A2AFB3]">At a glance</div>
        <div className="sidebar-note rounded-xl border border-line bg-canvas p-3.5">
          <div className="mb-2 text-xs font-semibold">Today’s overview</div>
          <p className="text-[11px] leading-5 text-muted">Your clinic is ready for the day.</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E1E9E9]"><div className="h-full w-[72%] rounded-full bg-teal" /></div>
          <div className="mt-2 text-[10px] text-muted">18 of 25 daily slots filled</div>
        </div>

        <div className="mt-auto border-t border-line pt-4">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2.5">
            <span className="avatar bg-[#E7EEF9] text-blue">AM</span>
            <span className="profile-copy min-w-0 flex-1"><span className="block truncate text-xs font-bold">Alex Morgan</span><span className="block text-[11px] text-muted">Administrator</span></span>
            <ChevronsUpDown className="profile-copy h-4 w-4 text-muted" />
          </div>
        </div>
      </aside>

      <div className="main-area ml-[250px] min-h-screen">
        <header className="header sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-line bg-white/95 px-8 backdrop-blur">
          <div className="flex items-center gap-3"><span className="hidden text-xs text-muted sm:inline">Carepoint</span><ChevronRight className="hidden h-3.5 w-3.5 text-[#AAB6B9] sm:block" /><span className="text-sm font-semibold">{current.label}</span></div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Visual preview only; this does not change permissions or data access."
              onClick={() => setPreviewRole((role) => role === "Admin" ? "Doctor" : "Admin")}
              className="mobile-hide hidden items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-1.5 md:flex"
              aria-label={`Switch visual preview role. Current view: ${previewRole}. This does not change permissions.`}
            >
              <Eye className="h-3.5 w-3.5 text-muted" /><span className="text-[11px] text-muted">Preview as</span><span className="rounded-md bg-mint px-2 py-1 text-[11px] font-semibold text-teal">{previewRole}</span><ChevronDown className="h-3 w-3 text-muted" />
            </button>
            <button type="button" aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted"><Bell className="h-4 w-4" /></button>
            <span className="avatar h-9 w-9 rounded-full bg-[#E7EEF9] text-blue">AM</span>
          </div>
        </header>
        <main className="content mx-auto max-w-[1440px] p-8">{children}<footer className="mt-7 flex justify-between text-[10px] text-[#9AA8AC]"><span>Carepoint HMS · MVP</span><span>Secure care, thoughtfully managed.</span></footer></main>
      </div>
    </div>
  );
}
