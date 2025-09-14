export const pub = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta?.env?.BASE_URL ?? "/"); // Vite 会注入，比如 "/gnn/"
  const rel = String(path).replace(/^\/+/, "");     // 去掉多余的 '/'
  return `${base}${rel.split("/").map(encodeURIComponent).join("/")}`;
};
