"use client";

import { useEffect, useRef, useState } from "react";
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
  SettingsIcon,
  XIcon,
} from "lucide-react";
import { useSettings } from "@/components/settings-provider";
import styles from "@/styles/sidebar.module.css";

let hasPlayedSidebarIntro = false;

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Budgets", href: "/budgets", icon: ChartPie },
  { label: "Pots", href: "/pots", icon: PiggyBank },
  { label: "Recurring Bills", href: "/recurring-bills", icon: ReceiptText },
];

function Sidebar({ collapsed = false, onToggleCollapse }) {
  const pathname = usePathname();
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { locale, setLocale, theme, setTheme, t } = useSettings();
  const asideRef = useRef(null);

  useEffect(() => {
    if (!hasPlayedSidebarIntro && asideRef.current) {
      hasPlayedSidebarIntro = true;
      asideRef.current.classList.add(styles.sidebarIntro);
    }
  }, []);

  return (
    <>
      <aside ref={asideRef} className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        <div className={styles.topBlock}>
          <div className={styles.brandBlock}>
            <p className={styles.eyebrow}>{collapsed ? "PF" : t("Personal Finance")}</p>
            <h2 className={styles.brand}>{collapsed ? "FD" : "Finance"}</h2>
            {!collapsed ? <p className={styles.caption}>{t("Overview Dashboard")}</p> : null}
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
                  {!collapsed ? <span>{t(item.label)}</span> : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.bottomActions}>
          <button type="button" className={styles.minimizeButton} onClick={() => setSettingsOpen(true)}>
            <SettingsIcon className={styles.icon} strokeWidth={2} aria-hidden="true" />
            {!collapsed ? <span>{t("Settings")}</span> : null}
          </button>

          <button type="button" className={styles.minimizeButton} onClick={onToggleCollapse}>
            <ToggleIcon className={styles.icon} strokeWidth={2} aria-hidden="true" />
            {!collapsed ? <span>{t("Minimize Menu")}</span> : null}
          </button>
        </div>
      </aside>

      {settingsOpen ? (
        <div className={styles.modalOverlay} role="presentation" onClick={() => setSettingsOpen(false)}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={t("Settings")}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>{t("Settings")}</p>
                <h3 className={styles.modalTitle}>{t("Appearance")}</h3>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                <XIcon className={styles.icon} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.settingRow}>
                <div>
                  <p className={styles.settingLabel}>{t("Night Mode")}</p>
                  <p className={styles.settingHint}>{theme === "dark" ? "On" : "Off"}</p>
                </div>
                <button
                  type="button"
                  className={`${styles.toggle} ${theme === "dark" ? styles.toggleActive : ""}`}
                  aria-pressed={theme === "dark"}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <span className={styles.toggleThumb} />
                </button>
              </div>

              <div className={styles.settingStack}>
                <label htmlFor="language-select" className={styles.settingLabel}>
                  {t("Language")}
                </label>
                <select
                  id="language-select"
                  className={styles.select}
                  value={locale}
                  onChange={(event) => setLocale(event.target.value)}
                >
                  <option value="en">English</option>
                  <option value="zh-CN">中文</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

export { Sidebar };
export default Sidebar;
