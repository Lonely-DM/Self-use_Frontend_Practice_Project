import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./NewsDetailPage.css";
import { VirtualData } from "../data/VirtualData";

// 可选：从 VirtualData 读取（若未通过 props 传入 data）
let cachedVData = null;
function getVirtualHeadlines() {
  if (cachedVData) return cachedVData;
  try {
    const data = VirtualData?.default || VirtualData;
    cachedVData = Array.isArray(data?.headlines) ? data.headlines : [];
  } catch {
    cachedVData = [];
  }
  return cachedVData;
}

// --- 极简 Markdown 转 HTML（满足常见标题/粗体/斜体/行内代码/代码块/列表/段落）---
function mdToHTML(md = "") {
  // 代码块（```lang\n...```）
  md = md.replace(/```([\w-]*)\n([\s\S]*?)```/g, (m, lang, code) => {
    return `<pre class="ndp-code"><code>${escapeHtml(code)}</code></pre>`;
  });
  // 行内代码 `code`
  md = md.replace(/`([^`]+)`/g, '<code class="ndp-inline-code">$1</code>');
  // 粗体 **text**
  md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // 斜体 *text*
  md = md.replace(/(^|\s)\*([^*]+)\*(?=\s|$)/g, '$1<em>$2</em>');
  // 三级/二级/一级标题
  md = md.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
         .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
         .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  // 无序列表
  md = md.replace(/^(?:- |\* )(.*)$/gm, '<li>$1</li>');
  md = md.replace(/(<li>.*<\/li>)(\n<li>.*<\/li>)+/g, (m) => `<ul class="ndp-list">${m.replace(/\n/g, "")}</ul>`);
  // 段落（保留空行分段）
  const blocks = md.trim().split(/\n{2,}/).map(b => b.trim());
  const html = blocks.map(b => {
    if (/^<h[1-3]>/.test(b) || /^<ul /.test(b) || /^<pre /.test(b)) return b; // 已格式化的块
    return `<p>${b.replace(/\n/g, '<br/>')}</p>`;
  }).join("\n");
  return html;
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pickItem(headlines, id) {
  // 你的 url 形如 "/article/h1"，路由为 /article/:id，这里直接用 id 匹配
  return headlines.find((n) => String(n.id) === String(id)) || null;
}

function pickRelated(headlines, item, limit = 6) {
  if (!item) return [];
  const pool = headlines.filter((n) => n.id !== item.id && n.category === item.category);
  // 可进一步按标签打分：你的结构未给 tags，这里仅按同分类返回
  return pool.slice(0, limit);
}

export default function NewsDetailPage({ data }) {
  const { id } = useParams();
  const headlines = useMemo(() => (Array.isArray(data) ? data : getVirtualHeadlines()), [data]);
  const item = useMemo(() => pickItem(headlines, id), [headlines, id]);
  const related = useMemo(() => pickRelated(headlines, item), [headlines, item]);

  if (!item) {
    return (
      <div className="news-detail container-980">
        <Link to="/" className="ndp-back">← 返回首页</Link>
        <h1 className="ndp-notfound">未找到该新闻</h1>
        <p className="ndp-muted">链接可能已过期，或该新闻尚未发布。</p>
      </div>
    );
  }

  const html = mdToHTML(String(item.content || ""));

  return (
    <div className="news-detail container-980">
      <Link to="/" className="ndp-back">← 返回首页</Link>

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

      <main className="news-body prose-like" dangerouslySetInnerHTML={{ __html: html }} />

      {!!related.length && (
        <section className="news-related">
          <h3 className="nr-title">相关内容</h3>
          <div className="nr-grid">
            {related.map((r) => (
              <Link key={r.id} to={r.url || `/article/${r.id}`} className="nr-card">
                {r.image ? <img src={r.image} alt={r.title} /> : <div className="nr-img-placeholder" />}
                <div className="nr-meta">
                  <div className="nr-cat">{r.category}</div>
                  <div className="nr-ttl">{r.title}</div>
                  {r.subtitle && <div className="nr-sub">{r.subtitle}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}