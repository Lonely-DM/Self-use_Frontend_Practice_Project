"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsContext = createContext(null);

const translations = {
  "Overview": "总览",
  "Personal Finance Dashboard": "个人财务看板",
  "Loading finance overview...": "正在加载财务总览...",
  "Failed to load finance overview.": "加载财务总览失败。",
  "Personal Finance": "个人财务",
  "Overview Dashboard": "总览看板",
  "Transactions": "交易",
  "Budgets": "预算",
  "Pots": "储蓄罐",
  "Recurring Bills": "周期账单",
  "Minimize Menu": "收起菜单",
  "Settings": "设置",
  "Appearance": "外观",
  "Night Mode": "夜间模式",
  "Language": "语言",
  "English": "英文",
  "Chinese": "中文",
  "Current Balance": "当前余额",
  "Income": "收入",
  "Expenses": "支出",
  "Latest Activity": "最近活动",
  "Monthly Schedule": "每月计划",
  "Savings": "储蓄",
  "Budget Status": "预算状态",
  "Budget Chart": "预算图表",
  "Spent": "已支出",
  "Paid": "已支付",
  "Upcoming": "即将到期",
  "Due Soon": "临近到期",
  "Target": "目标",
  "Section": "页面",
  "Page scaffold ready": "页面骨架已准备好",
};

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const savedTheme = window.localStorage.getItem("finance-theme");
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  });
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const savedLocale = window.localStorage.getItem("finance-locale");
    return savedLocale === "en" || savedLocale === "zh-CN" ? savedLocale : "en";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("finance-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("finance-locale", locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      locale,
      setLocale,
      t: (text) => (locale === "zh-CN" ? translations[text] || text : text),
    }),
    [locale, theme],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}
