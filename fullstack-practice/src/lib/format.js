const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "short",
  day: "numeric",
});

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}