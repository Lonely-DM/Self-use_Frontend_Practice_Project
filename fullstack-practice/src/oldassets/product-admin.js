/*
================ ORIGINAL FILE (ARCHIVED) ================

"use client";

import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = {
  name: "",
  category: "featured",
  description: "",
  price: "",
  image: "",
  status: "active",
};

const categoryLabels = {
  featured: "主推单球",
  blizzard: "暴风雪",
  sundae: "圣代",
};

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "加载失败");
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const groupedCounts = useMemo(() => {
    return products.reduce(
      (acc, item) => {
        acc.total += 1;
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      { total: 0, featured: 0, blizzard: 0, sundae: 0 }
    );
  }, [products]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "featured",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
      status: product.status || "active",
    });
    setMessage("");
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/products/${editingId}` : "/api/products";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "保存失败");
      }

      setMessage(editingId ? "产品已更新" : "产品已创建");
      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("确认删除这个产品吗？");
    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "删除失败");
      }

      setMessage("产品已删除");
      if (editingId === id) {
        resetForm();
      }
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="surface-warm rounded-[2rem] p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
              Product Editor
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-stone-900">
              产品管理
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              这是最基础的 CRUD 面板，支持新增、编辑、删除和查看数据库里的产品记录。
            </p>
          </div>
          <span className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">
            SQL Ready
          </span>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span>名称</span>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="例如：海盐焦糖脆筒"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span>价格</span>
              <input
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="例如：¥32"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span>分类</span>
              <select
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
              >
                <option value="featured">主推单球</option>
                <option value="blizzard">暴风雪</option>
                <option value="sundae">圣代</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-stone-700">
              <span>状态</span>
              <select
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                <option value="active">上架中</option>
                <option value="draft">草稿</option>
                <option value="archived">归档</option>
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-stone-700">
            <span>图片地址</span>
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
              value={form.image}
              onChange={(event) => updateField("image", event.target.value)}
              placeholder="例如：/blizzard.png"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-stone-700">
            <span>描述</span>
            <textarea
              className="min-h-32 w-full rounded-3xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-400"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="输入口味描述"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "保存中..." : editingId ? "更新产品" : "新增产品"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              重置
            </button>
          </div>

          {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        </form>
      </section>

      <section className="surface-soft rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-[1.6rem] bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">总数</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{groupedCounts.total}</p>
          </div>
          <div className="rounded-[1.6rem] bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">主推</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{groupedCounts.featured}</p>
          </div>
          <div className="rounded-[1.6rem] bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">暴风雪</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{groupedCounts.blizzard}</p>
          </div>
          <div className="rounded-[1.6rem] bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">圣代</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{groupedCounts.sundae}</p>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              SQL Records
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-stone-900">
              产品列表
            </h2>
          </div>
          <button
            type="button"
            onClick={loadProducts}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white"
          >
            刷新
          </button>
        </div>

        {loading ? (
          <div className="mt-6 rounded-[1.75rem] bg-white p-6 text-sm text-stone-500">
            正在读取数据库...
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-stone-900">{product.name}</h3>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                        {categoryLabels[product.category] || product.category}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {product.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-stone-600">{product.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-500">
                      <span>价格：{product.price}</span>
                      <span>图片：{product.image || "未设置"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {!products.length ? (
              <div className="rounded-[1.75rem] bg-white p-6 text-sm text-stone-500">
                当前数据库里还没有产品记录。
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

=========================================================
*/