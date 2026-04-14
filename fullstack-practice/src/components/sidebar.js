"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  ChartPie,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PiggyBank,
  ReceiptText,
} from "lucide-react";
import styles from "@/styles/sidebar.module.css";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Budgets", href: "/budgets", icon: ChartPie },
  { label: "Pots", href: "/pots", icon: PiggyBank },
  { label: "Recurring Bills", href: "/recurring-bills", icon: ReceiptText },
];

export default function Sidebar({ collapsed = false, onToggleCollapse }) {
  const pathname = usePathname();
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.topBlock}>
        <div className={styles.brandBlock}>
          <p className={styles.eyebrow}>{collapsed ? "PF" : "Personal Finance"}</p>
          <h2 className={styles.brand}>{collapsed ? "FD" : "Finance"}</h2>
          {!collapsed ? <p className={styles.caption}>Overview Dashboard</p> : null}
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={styles.icon} strokeWidth={2} aria-hidden="true" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <button type="button" className={styles.minimizeButton} onClick={onToggleCollapse}>
        <ToggleIcon className={styles.icon} strokeWidth={2} aria-hidden="true" />
        {!collapsed ? <span>Minimize Menu</span> : null}
      </button>
    </aside>
  );
}
