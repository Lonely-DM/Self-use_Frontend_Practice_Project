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
  "Track every income and expense across your account activity": "追踪账户中的每一笔收入与支出",
  "Manage your repeating payments and keep due bills in view": "管理你的周期付款，并随时掌握到期账单",
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
  "Plan your spending and track category performance": "规划支出并跟踪各分类表现",
  "New Pot": "新建储蓄罐",
  "New Budget": "新建预算",
  "New Bill": "新建账单",
  "New Transaction": "新建交易",
  "Total Saved": "已存总额",
  "Total Targets": "目标总额",
  "Total Transactions": "交易总数",
  "Total Budgeted": "预算总额",
  "Total Spent": "总支出",
  "Remaining Budget": "剩余预算",
  "Total Bills": "账单总数",
  "Monthly Total": "月度总额",
  "Loading pots...": "正在加载储蓄罐...",
  "Loading budgets...": "正在加载预算...",
  "Loading recurring bills...": "正在加载周期账单...",
  "Loading transactions...": "正在加载交易...",
  "Search pots": "搜索储蓄罐",
  "Search budgets": "搜索预算",
  "Search transactions": "搜索交易",
  "No saving pots yet.": "还没有储蓄目标。",
  "Start your first goal today.": "今天就开始你的第一个目标吧。",
  "No budgets yet.": "还没有预算。",
  "Start your first spending plan today.": "今天就开始你的第一个预算计划吧。",
  "No transactions yet.": "还没有交易记录。",
  "Add your first income or expense today.": "今天就添加你的第一笔收入或支出吧。",
  "No matching pots.": "没有匹配的储蓄罐。",
  "No matching budgets.": "没有匹配的预算。",
  "No matching transactions.": "没有匹配的交易。",
  "No matching recurring bills.": "没有匹配的周期账单。",
  "Try a different keyword.": "试试其他关键词。",
  "Create your first recurring bill today.": "今天就创建你的第一笔周期账单吧。",
  "Actions": "操作",
  "View All": "查看全部",
  "More": "更多",
  "Edit": "编辑",
  "Edit Budget": "编辑预算",
  "Edit Transaction": "编辑交易",
  "Add Funds": "存入资金",
  "Add Spend": "新增支出",
  "Reduce Spend": "减少支出",
  "Withdraw": "取出资金",
  "Delete": "删除",
  "Remaining": "剩余",
  "Over Budget": "超预算",
  "Almost spent": "快花完了",
  "Updated": "更新于",
  "Almost there 🎯": "快完成了 🎯",
  "Completed": "已完成",
  "Edit Pot": "编辑储蓄罐",
  "Create a new savings goal": "创建新的储蓄目标",
  "Create a new budget": "创建新的预算计划",
  "Create a recurring bill": "创建新的周期账单",
  "Create a new transaction": "创建新的交易记录",
  "Name": "名称",
  "Bill Name": "账单名称",
  "Transaction Name": "交易名称",
  "Category": "分类",
  "Budget Amount": "预算金额",
  "Bill Amount": "账单金额",
  "Saved": "已存",
  "Color": "颜色",
  "Date": "日期",
  "Type": "类型",
  "Pick a pot accent color": "选择储蓄罐强调色",
  "Pick a budget accent color": "选择预算强调色",
  "Cancel": "取消",
  "Saving...": "保存中...",
  "Save Changes": "保存更改",
  "Create Pot": "创建储蓄罐",
  "Create Budget": "创建预算",
  "Create Transaction": "创建交易",
  "Current saved": "当前已存",
  "Current spent": "当前已支出",
  "Available to move": "当前可转入金额",
  "Amount": "金额",
  "Status": "状态",
  "Search recurring bills": "搜索周期账单",
  "This action cannot be undone.": "此操作无法撤销。",
  "Deleting...": "删除中...",
  "Failed to load pots.": "加载储蓄罐失败。",
  "Failed to load budgets.": "加载预算失败。",
  "Failed to load transactions.": "加载交易失败。",
  "Unable to save pot.": "无法保存储蓄罐。",
  "Unable to save budget.": "无法保存预算。",
  "Unable to save recurring bill.": "无法保存周期账单。",
  "Unable to save transaction.": "无法保存交易。",
  "Unable to update funds.": "无法更新资金。",
  "Unable to update budget spend.": "无法更新预算支出。",
  "Insufficient funds.": "资金不足。",
  "Unable to delete pot.": "无法删除储蓄罐。",
  "Unable to delete budget.": "无法删除预算。",
  "Unable to delete recurring bill.": "无法删除周期账单。",
  "Unable to delete transaction.": "无法删除交易。",
  "Insufficient saved balance.": "储蓄金额不足。",
  "Spent amount cannot be negative.": "已支出金额不能为负。",
  "Pot not found.": "未找到该储蓄罐。",
  "Budget not found.": "未找到该预算。",
  "Recurring bill not found.": "未找到该周期账单。",
  "Transaction not found.": "未找到该交易。",
  "Category is required.": "分类为必填项。",
  "Transaction name is required.": "交易名称为必填项。",
  "Transaction amount must be greater than 0.": "交易金额必须大于 0。",
  "Transaction date is required.": "交易日期为必填项。",
  "Budget amount must be greater than 0.": "预算金额必须大于 0。",
  "Spent amount must be 0 or greater.": "已支出金额必须大于或等于 0。",
  "Bill name is required.": "账单名称为必填项。",
  "Bill amount must be greater than 0.": "账单金额必须大于 0。",
  "Create Bill": "创建账单",
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
