"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HomeIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

const ArchiveIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="5" rx="1" />
    <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
    <path d="M10 13h4" />
  </svg>
);

const StatsIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20H2" />
  </svg>
);

const PenIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.2 3.8a2.3 2.3 0 0 1 3 3.4L8 19.4l-4.5 1.1 1.1-4.5Z" />
    <path d="m14.5 6.5 3 3" />
  </svg>
);

const tabs = [
  { href: "/", label: "홈", icon: HomeIcon },
  { href: "/archive", label: "보관함", icon: ArchiveIcon },
  { href: "/stats", label: "통계", icon: StatsIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-[max(env(safe-area-inset-bottom),0.75rem)] z-10 mx-auto max-w-md rounded-[1.75rem] border border-edge bg-surface/90 shadow-xl shadow-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2">
        {tabs.slice(0, 2).map((tab) => (
          <NavTab key={tab.href} {...tab} active={pathname === tab.href} />
        ))}
        <Link
          href="/write"
          aria-label="오늘 기록하기"
          className="press -mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#7da2d9] to-[#4e73ad] text-white shadow-lg shadow-accent/30 ring-[3px] ring-background"
        >
          {PenIcon}
        </Link>
        <NavTab {...tabs[2]} active={pathname === tabs[2].href} />
        <NavTab
          href="/hooks"
          label="후렴 후보"
          active={pathname === "/hooks"}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3v10.5a3.5 3.5 0 1 1-2-3.2V6l-6 1.5v8a3.5 3.5 0 1 1-2-3.2V5l10-2Z" />
            </svg>
          }
        />
      </div>
    </nav>
  );
}

function NavTab({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors duration-200 ${
        active ? "font-medium text-accent" : "text-muted active:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
