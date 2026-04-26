"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/dashboard-shell.module.css";
import Sidebar from "@/components/sidebar";
import { useSettings } from "@/components/settings-provider";

export default function DashboardShell({
  title,
  eyebrow,
  description = "",
  children,
  headerContent = null,
  sidebarBalance = 0,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useSettings();

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
            <div className={styles.headerText}>
              <p className={styles.eyebrow}>{t(eyebrow)}</p>
              <h1 className={styles.title}>{t(title)}</h1>
              {description ? <p className={styles.description}>{t(description)}</p> : null}
            </div>
            {headerContent ? <div className={styles.headerContent}>{headerContent}</div> : null}
          </header>

          <div className={styles.body}>{children}</div>
        </div>
      </section>
    </main>
  );
}
