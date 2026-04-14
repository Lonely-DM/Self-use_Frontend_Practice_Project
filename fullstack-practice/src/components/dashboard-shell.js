"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/dashboard-shell.module.css";
import Sidebar from "@/components/sidebar";

export default function DashboardShell({
  title,
  eyebrow,
  children,
  headerContent = null,
  sidebarBalance = 0,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const shellClassName = useMemo(
    () => `${styles.shell} ${collapsed ? styles.collapsed : ""}`.trim(),
    [collapsed],
  );

  return (
    <main className={styles.page}>
      <section className={shellClassName}>
        <Sidebar
          balance={sidebarBalance}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((current) => !current)}
        />

        <div className={styles.content}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h1 className={styles.title}>{title}</h1>
            </div>
            {headerContent ? <div className={styles.headerContent}>{headerContent}</div> : null}
          </header>

          <div className={styles.body}>{children}</div>
        </div>
      </section>
    </main>
  );
}
