import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./NewsDetailPage.css";
import { VirtualData } from "../data/VirtualData";

let _cacheVD = null;
function readVirtualData() {
  if (_cacheVD) return _cacheVD;
  _cacheVD = VirtualData || {};
  return _cacheVD;
}

function normalizePool(vd = {}) {
  const pool = [];

  // hero 规范化为单条
  if (vd.hero) {
    const h = vd.hero;
    pool.push({
      id: h.id || "hero",
      category: h.category,
      title: h.title,
      subtitle: h.subtitle,
      image: h.image,
      url: h.url || "/article/hero",
      content: h.content,
      __from: "hero",
    });
  }

  // 其余分区：headlines/latest/mostRead/features
  ["headlines", "latest", "mostRead", "features"].forEach((k) => {
    if (Array.isArray(vd[k])) {
      vd[k].forEach((it) => pool.push({ ...it, __from: k }));
    }
  });

  return pool;
}

// 极简 Markdown -> HTML（可换成 react-markdown）
function mdToHTML(md = "") {
  md = md.replace(/```([\w-]*)\n([\s\S]*?)```/g, (m, lang, code) => {
    return `<pre class="ndp-code"><code>${escapeHtml(code)}</code></pre>`;
  });
  md = md.replace(/`([^`]+)`/g, '<code class="ndp-inline-code">$1</code>');
  md = md.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  md = md.replace(/(^|\s)\*([^*]+)\*(?=\s|$)/g, "$1<em>$2</em>");
  md = md
    .replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");
  md = md.replace(/^(?:- |\* )(.*)$/gm, "<li>$1</li>");
  md = md.replace(
    /(<li>.*<\/li>)(\n<li>.*<\/li>)+/g,
    (m) => `<ul class="ndp-list">${m.replace(/\n/g, "")}</ul>`
  );
  const blocks = md.trim().split(/\n{2,}/).map((b) => b.trim());
  return blocks
    .map((b) => {
      if (/^<h[1-3]>/.test(b) || /^<ul /.test(b) || /^<pre /.test(b)) return b;
      return `<p>${b.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pickItem(pool, id) {
  return pool.find((n) => String(n.id) === String(id)) || null;
}

export default function NewsDetailPage({ data }) {
  const { id } = useParams();

  // data 可传整个 VirtualData；未传则自动读取
  const vdata = useMemo(
    () => (data && !Array.isArray(data) ? data : readVirtualData()),
    [data]
  );
  const pool = useMemo(() => normalizePool(vdata), [vdata]);
  const item = useMemo(() => pickItem(pool, id), [pool, id]);

  if (!item) {
    return (
      <div className="news-detail container-980">
        <Link to="/" className="ndp-back">
          ← 返回首页
        </Link>
        <h1 className="ndp-notfound">未找到该新闻</h1>
        <p className="ndp-muted">链接可能已过期，或该新闻尚未发布。</p>
      </div>
    );
  }

  const hasContent =
    typeof item.content === "string" && item.content.trim().length > 0;
  const html = hasContent ? mdToHTML(item.content) : "";

  return (
    <div className="news-detail container-980">
      <Link to="/" className="ndp-back">
        ← 返回首页
      </Link>

      <header className="news-header">
        {item.category && <span className="ndp-badge">{item.category}</span>}
        <h1 className="news-title">{item.title}</h1>
        {item.subtitle && <p className="news-subtitle">{item.subtitle}</p>}
      </header>

      {item.image && (
        <figure className="news-hero">
          <img src={item.image} alt={item.title} />
        </figure>
      )}

      {hasContent ? (
        <main
          className="news-body prose-like"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <main className="news-body prose-like">
          <h2>404</h2>
          <p>这条新闻尚未提供正文内容。</p>
          <p className="ndp-muted">请返回首页或选择其他文章阅读。</p>
        </main>
      )}
    </div>
  );
}
