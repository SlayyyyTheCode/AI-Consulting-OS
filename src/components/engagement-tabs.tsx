"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { slug: "discovery", label: "Discovery" },
  { slug: "classification", label: "Classification" },
  { slug: "recommendations", label: "Recommendations" },
  { slug: "architecture", label: "Architecture" },
  { slug: "lifecycle", label: "Lifecycle" },
  { slug: "deliverables", label: "Deliverables" },
  { slug: "governance", label: "Governance" },
];

export function EngagementTabs({ engagementId }: { engagementId: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Engagement sections" className="border-b border-border">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const href = `/engagements/${engagementId}/${tab.slug}`;
          const active = pathname === href;
          return (
            <li key={tab.slug} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center border-b-2 px-3 text-sm font-medium transition-colors duration-100 ${
                  active
                    ? "border-accent text-text"
                    : "border-transparent text-text-secondary hover:border-border-strong hover:text-text"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
