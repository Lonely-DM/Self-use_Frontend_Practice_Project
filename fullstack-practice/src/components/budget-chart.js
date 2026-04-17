"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/budget-chart.module.css";
import { formatCurrency } from "@/lib/format";
import { useSettings } from "@/components/settings-provider";

/* archived old version omitted for brevity */

const colors = ["#277C78", "#82C9D7", "#F2CDAC", "#626070"];
const maxAnimationWindow = 1000;

function getChartData(budgets) {
  const totalSpent = budgets.reduce((sum, item) => sum + Number(item.spent || 0), 0);
  const totalBudget = budgets.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const activeBudgets = budgets
    .map((item) => ({
      id: item.id,
      category: item.category,
      amount: Number(item.amount || 0),
      spent: Number(item.spent || 0),
      color: item.color,
    }))
    .filter((item) => item.spent > 0);

  const segments = [];
  let consumedPercent = 0;

  for (const [index, item] of activeBudgets.entries()) {
    const ratio = totalSpent ? item.spent / totalSpent : 0;
    const rawPercent = ratio * 100;

    segments.push({
      id: item.id,
      category: item.category,
      amount: item.amount,
      spent: item.spent,
      color: item.color || colors[index % colors.length],
      startPercent: consumedPercent,
      visiblePercent: rawPercent,
    });

    consumedPercent += rawPercent;
  }

  return { totalSpent, totalBudget, segments };
}

function getAnimationTiming(count) {
  if (count <= 1) {
    return { totalDuration: 800 };
  }

  return { totalDuration: maxAnimationWindow };
}

function wait(ms, timeoutsRef) {
  return new Promise((resolve) => {
    const id = window.setTimeout(resolve, ms);
    timeoutsRef.current.push(id);
  });
}

function nextPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

export default function BudgetChart({ budgets = [], delay = 0 }) {
  const circleRefs = useRef([]);
  const timeoutsRef = useRef([]);
  const numberFrameRef = useRef(0);
  const sectionRef = useRef(null);
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const [displayAmount, setDisplayAmount] = useState(0);
  const { t } = useSettings();

  const { totalSpent, totalBudget, segments } = useMemo(() => getChartData(budgets), [budgets]);
  const visibleLegendSegments = useMemo(() => segments.slice(0, 4), [segments]);
  const timing = useMemo(() => getAnimationTiming(segments.length), [segments.length]);
  const entranceDelay = delay * 1000 + 700;
  const activeSegment = useMemo(
    () => segments.find((segment) => segment.id === activeSegmentId) || null,
    [activeSegmentId, segments],
  );

  useEffect(() => {
    if (!segments.length) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sectionElement = sectionRef.current;
    let cancelled = false;

    if (sectionElement) {
      sectionElement.style.animationDelay = `${delay}s`;
    }

    const animateNumber = () => {
      if (prefersReducedMotion) {
        setDisplayAmount(totalSpent);
        return;
      }

      const startedAt = performance.now();

      const step = (now) => {
        if (cancelled) {
          return;
        }

        const progress = Math.min((now - startedAt) / timing.totalDuration, 1);
        setDisplayAmount(Math.round(totalSpent * progress));

        if (progress < 1) {
          numberFrameRef.current = window.requestAnimationFrame(step);
        }
      };

      numberFrameRef.current = window.requestAnimationFrame(step);
    };

    const run = async () => {
      await wait(entranceDelay, timeoutsRef);

      if (cancelled) {
        return;
      }

      circleRefs.current.forEach((circle, index) => {
        const segment = segments[index];
        if (!circle || !segment) {
          return;
        }

        circle.style.transition = "none";
        circle.style.strokeDasharray = "0 100";
        circle.style.strokeDashoffset = "0";
      });

      setDisplayAmount(0);
      await nextPaint();

      if (cancelled) {
        return;
      }

      animateNumber();

      for (const [index, segment] of segments.entries()) {
        const circle = circleRefs.current[index];
        if (!circle) {
          continue;
        }

        const segmentDuration = Math.max(
          80,
          Math.round((timing.totalDuration * segment.visiblePercent) / 100),
        );

        circle.style.transition = prefersReducedMotion
          ? "none"
          : `stroke-dasharray ${segmentDuration}ms linear`;
        circle.style.strokeDasharray = `${segment.visiblePercent} 100`;

        if (!prefersReducedMotion) {
          await wait(segmentDuration, timeoutsRef);
        }

        if (cancelled) {
          return;
        }
      }

      setDisplayAmount(totalSpent);
    };

    run();

    return () => {
      cancelled = true;
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
      window.cancelAnimationFrame(numberFrameRef.current);
    };
  }, [delay, entranceDelay, segments, timing.totalDuration, totalSpent]);

  return (
    <section ref={sectionRef} className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t("Budget Status")}</p>
          <h2 className={styles.title}>{t("Budget Chart")}</h2>
        </div>
        <Link href="/budgets" className={styles.viewAll}>
          {t("View All")}
        </Link>
      </div>

      <div className={styles.chartLayout}>
        <div className={styles.chartWrap}>
          <svg viewBox="0 0 140 140" className={styles.chartV2} aria-label="Budget allocation chart">
            <circle cx="70" cy="70" r="54" className={styles.track} pathLength="100" />
            {segments.map((segment, index) => (
              <circle
                key={segment.id}
                ref={(node) => {
                  circleRefs.current[index] = node;
                }}
                cx="70"
                cy="70"
                r="54"
                pathLength="100"
                className={`${styles.segmentV2} ${activeSegmentId === segment.id ? styles.segmentV2Active : ""}`}
                transform={`rotate(${segment.startPercent * 3.6 - 90} 70 70)`}
                style={{ stroke: segment.color }}
                onMouseEnter={() => setActiveSegmentId(segment.id)}
                onMouseLeave={() => setActiveSegmentId(null)}
              />
            ))}
          </svg>
          <div className={styles.chartCenter}>
            <span className={styles.centerLabel}>{t("Spent")}</span>
            <span className={styles.centerValue}>
              {formatCurrency(activeSegment ? activeSegment.spent : segments.length ? displayAmount : 0)}
            </span>
            <span className={styles.centerHint}>of {formatCurrency(totalBudget)}</span>
          </div>
        </div>

        <div className={styles.legend}>
          {visibleLegendSegments.map((segment) => (
            <article
              key={segment.id}
              className={`${styles.legendItem} ${activeSegmentId === segment.id ? styles.legendItemHover : ""}`}
              onMouseEnter={() => setActiveSegmentId(segment.id)}
              onMouseLeave={() => setActiveSegmentId(null)}
            >
              <span className={styles.swatch} style={{ backgroundColor: segment.color }} />
              <div>
                <p className={styles.legendName}>{segment.category}</p>
                <p className={styles.legendMeta}>
                  {formatCurrency(segment.spent)} / {formatCurrency(segment.amount)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
