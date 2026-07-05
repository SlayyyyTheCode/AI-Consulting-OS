"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/engagements", label: "Engagements", icon: "◆" },
  { href: "/knowledge", label: "Knowledge", icon: "❖" },
];

const adminLinks = [{ href: "/team", label: "Team", icon: "◉" }];

export function NavLinks({
  isAdmin,
  compact = false,
}: {
  isAdmin: boolean;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const all = isAdmin ? [...links, ...adminLinks] : links;

  return (
    <ul className={compact ? "flex gap-1" : "flex flex-col gap-1"}>
      {all.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[44px] items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-100 ${
                active
                  ? "bg-primary text-primary-fg"
                  : "text-text-secondary hover:bg-bg hover:text-text"
              } ${compact ? "px-2" : ""}`}
            >
              <span aria-hidden className="text-xs">
                {link.icon}
              </span>
              {compact ? <span className="sr-only sm:not-sr-only">{link.label}</span> : link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
