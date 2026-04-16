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
  "Current Available": "当前可用资金",
  "Available Balance": "可支配余额",
  "Free Funds": "自由资金",
  "In Pots": "储蓄罐内",
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
  "No recurring bills yet.": "暂无周期账单。",
  "Track your savings goals and progress": "追踪你的储蓄目标与完成进度",
  "New Pot": "新建储蓄罐",
  "Total Saved": "已存总额",
  "Total Targets": "目标总额",
  "Loading pots...": "正在加载储蓄罐...",
  "No saving pots yet.": "还没有储蓄目标。",
  "Start your first goal today.": "今天就开始你的第一个目标吧。",
  "Actions": "操作",
  "Edit": "编辑",
  "Add Funds": "存入资金",
  "Withdraw": "取出资金",
  "Delete": "删除",
  "Remaining": "剩余",
  "Updated": "更新于",
  "Almost there 🎯": "快完成了 🎯",
  "Completed": "已完成",
  "Edit Pot": "编辑储蓄罐",
  "Create a new savings goal": "创建新的储蓄目标",
  "Name": "名称",
  "Saved": "已存",
  "Color": "颜色",
  "Pick a pot accent color": "选择储蓄罐强调色",
  "Cancel": "取消",
  "Saving...": "保存中...",
  "Save Changes": "保存更改",
  "Create Pot": "创建储蓄罐",
  "Current saved": "当前已存",
  "Available to move": "当前可转入金额",
  "Amount": "金额",
  "This action cannot be undone.": "此操作无法撤销。",
  "Deleting...": "删除中...",
  "Failed to load pots.": "加载储蓄罐失败。",
  "Unable to save pot.": "无法保存储蓄罐。",
  "Unable to update funds.": "无法更新资金。",
  "Insufficient funds.": "资金不足。",
  "Unable to delete pot.": "无法删除储蓄罐。",
  "Insufficient saved balance.": "储蓄金额不足。",
  "Pot not found.": "未找到该储蓄罐。",
};

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("finance-theme");
    const savedLocale = window.localStorage.getItem("finance-locale");

    const timeoutId = window.setTimeout(() => {
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }

      if (savedLocale === "en" || savedLocale === "zh-CN") {
        setLocale(savedLocale);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

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
