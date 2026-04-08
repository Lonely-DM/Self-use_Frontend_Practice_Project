import Image from "next/image";
import menuData from "../data/mockdata.json";

function SparkIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2 13.9 8.1 20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z"
        className="fill-current"
      />
    </svg>
  );
}

function CupIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 4h10l-1.2 14.2A2 2 0 0 1 13.8 20h-3.6a2 2 0 0 1-1.99-1.8L7 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 4c0-1.1 1.34-2 3-2s3 .9 3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToppingIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="7.5" cy="9" r="2.5" className="fill-current opacity-70" />
      <circle cx="15.5" cy="7.5" r="2" className="fill-current opacity-80" />
      <circle cx="12.5" cy="14.5" r="3" className="fill-current opacity-60" />
      <circle cx="18" cy="15.5" r="1.5" className="fill-current opacity-80" />
    </svg>
  );
}

function ClockIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlaceholderImage({ tone = "warm", label, src }) {
  const toneClass =
    tone === "cool"
      ? "border-slate-300/80 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-600"
      : "border-stone-300/80 bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 text-stone-600";

  return (
    <div
      className={`relative h-44 overflow-hidden rounded-[1.5rem] border ${
        src ? "border-white/20 bg-slate-200" : toneClass
      } sm:h-48`}
      aria-label={`${label} 图片占位符`}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          style={{ objectPosition: "center" }}
          priority={label.includes("暴风雪")}
        />
      ) : null}
      <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.32)_35%,transparent_70%)]" />
      {src ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/28 via-black/8 to-transparent" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="rounded-full border border-white/50 bg-white/20 p-4 backdrop-blur-sm">
            <CupIcon className="h-8 w-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em]">
            Image Placeholder
          </p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const {
    brand,
    recommendation,
    featuredScoops,
    sundaes,
    toppings,
    blizzardSeries,
    hours,
  } = menuData;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff8ef_0%,#fff5f7_34%,#f7efe8_68%,#f1dfcf_100%)] text-stone-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_right,rgba(255,206,183,0.45),transparent_48%),radial-gradient(circle_at_top_left,rgba(255,244,199,0.5),transparent_42%)]" />
      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 md:gap-10 lg:px-12 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <div className="surface-warm reveal-up rounded-[2rem] p-6 md:p-8 lg:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-2 text-sm font-semibold text-amber-800">
              <SparkIcon className="h-4 w-4" />
              {brand.name}
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
              {brand.eyebrow}
            </p>
            <h1 className="max-w-xl font-[family-name:var(--font-display)] text-4xl leading-none tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
              风味像夏天一样松弛的冰淇淋菜单
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              {brand.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-stone-700">
              {brand.highlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm"
                >
                  <SparkIcon className="h-4 w-4 text-amber-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="surface-cool reveal-up-delay relative overflow-hidden rounded-[2rem] p-6 text-white md:p-8 lg:p-10">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ffc8dd]/30 blur-2xl" />
            <div className="absolute -bottom-8 left-8 h-28 w-28 rounded-full bg-[#d8f2ff]/25 blur-2xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/70">
                <SparkIcon className="h-4 w-4" />
                店长推荐
              </p>
              <h2 className="mt-4 max-w-sm font-[family-name:var(--font-display)] text-4xl leading-tight">
                {recommendation.title}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/80 sm:text-base">
                {recommendation.description}
              </p>
              <div className="mt-6">
                <PlaceholderImage tone="cool" label={recommendation.title} src="/blizzard.png" />
              </div>
              <div className="mt-7 rounded-[1.75rem] bg-white/10 p-5 backdrop-blur">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                      {recommendation.signatureLabel}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
                      {recommendation.signatureText}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#8d5b4c]">
                    {recommendation.price}
                  </span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-sm">
                {recommendation.stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white/10 px-3 py-4 backdrop-blur"
                  >
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-white/70">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="reveal-up rounded-[2.25rem] border border-[#f1ddc9] bg-[linear-gradient(180deg,rgba(255,251,246,0.96),rgba(255,245,235,0.92))] p-5 shadow-[0_26px_80px_rgba(180,126,83,0.16)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                <CupIcon className="h-4 w-4" />
                Featured Scoops
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-stone-900">
                主推单球区
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-stone-600 sm:text-right">
              用更轻盈、明亮的口味做前排展示，适合第一次点单或想配华夫筒的时候。
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredScoops.map((item) => (
              <article
                key={item.name}
                className="menu-card-warm group flex h-full flex-col rounded-[1.8rem] p-5"
              >
                <div className={`rounded-[1.6rem] bg-gradient-to-br p-2 ${item.accent}`}>
                  <PlaceholderImage
                    tone="warm"
                    label={item.name}
                    src={item.name.includes("暴风雪") ? "/blizzard.png" : undefined}
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] text-3xl leading-tight text-stone-900">
                      {item.name}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-stone-600">{item.note}</p>
                  </div>
                  <span className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">
                    {item.price}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  <SparkIcon className="h-4 w-4 text-amber-600" />
                  单球推荐
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <div className="surface-warm reveal-up rounded-[2rem] p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
                  <CupIcon className="h-4 w-4" />
                  Sundae Board
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-stone-900">
                  圣代与特调
                </h2>
              </div>
              <p className="text-sm text-stone-500">可做双人分享</p>
            </div>
            <div className="mt-8 space-y-5">
              {sundaes.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-[#f2e3d6] bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900">{item.name}</h3>
                    <p className="mt-1 text-sm leading-7 text-stone-600">{item.desc}</p>
                  </div>
                  <span className="text-lg font-bold text-rose-500">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-soft reveal-up-delay flex flex-col gap-6 rounded-[2rem] p-6 md:p-8">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                <ToppingIcon className="h-4 w-4" />
                Build Your Own
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-stone-900">
                自选加料
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {toppings.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="rounded-[1.75rem] bg-stone-900 p-6 text-stone-50">
              <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-stone-400">
                <ClockIcon className="h-4 w-4" />
                营业信息
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                {hours.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="surface-blizzard reveal-up rounded-[2.3rem] p-5 text-slate-50 shadow-[0_28px_90px_rgba(39,61,92,0.3)] sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">
                <SparkIcon className="h-4 w-4" />
                Blizzard Series
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-white">
                暴风雪系列
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                {blizzardSeries.description}
              </p>
            </div>
            <span className="rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-sky-50 shadow-sm backdrop-blur">
              {blizzardSeries.badge}
            </span>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {blizzardSeries.items.map((item) => (
              <article
                key={item.name}
                className="menu-card-cool group flex h-full flex-col rounded-[1.85rem] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-sky-100 px-3 py-2 text-xs font-bold tracking-[0.18em] text-sky-700">
                    {item.badge}
                  </span>
                  <span className="text-lg font-bold text-white">{item.price}</span>
                </div>
                <div className="mt-5">
                  <PlaceholderImage tone="cool" label={item.name} src="/blizzard.png" />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-3xl leading-tight text-white">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">{item.detail}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
                  <SparkIcon className="h-4 w-4" />
                  Blizzard Mix
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
