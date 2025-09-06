import { useEffect, useMemo, useRef, useState } from "react";
import "./Ticker.css";

export default function Ticker({
  items = [],
  pauseMs = 3000,
  jumpMs = 250,
  rowHeight = 36,
}) {

  const trackItems = useMemo(
    () => (items.length ? [...items, items[0]] : []),
    [items]
  );

  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(false);
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!items.length) return;

    clearTimers();

    setWithTransition(false);
    setIndex(0);


    const cycle = () => {
      setWithTransition(true);
      setIndex((prev) => prev + 1);

      timerRef.current = setTimeout(() => {
        setWithTransition((t) => {
          if (index + 1 >= items.length) {
            requestAnimationFrame(() => {
              setWithTransition(false);
              setIndex(0);
            });
          }
          return t;
        });

        timerRef.current = setTimeout(cycle, pauseMs);
      }, jumpMs);
    };

    timerRef.current = setTimeout(cycle, pauseMs);

    return clearTimers;

  }, [items, pauseMs, jumpMs]);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 计算 transform
  const translateY = -(index * rowHeight);

  return (
    <div className="vticker">
      <div className="container vticker-inner" style={{ paddingRight: 0 }}>
        <span className="vticker-badge">快讯</span>

        <div
          className="vticker-viewport"
          style={{ ["--row-h"]: `${rowHeight}px` }}
        >
          <div
            ref={trackRef}
            className="vticker-track"
            style={{
              transform: `translateY(${translateY}px)`,
              transition: withTransition ? `transform ${jumpMs}ms linear` : "none",
            }}
            // 防止用户选中文本导致的卡顿
            onMouseEnter={clearTimers}
            onMouseLeave={() => {
              // 鼠标移出后，重新开始节拍（从当前 index 起）
              if (!items.length) return;
              clearTimers();
              timerRef.current = setTimeout(function tick() {
                setWithTransition(true);
                setIndex((prev) => {
                  const next = prev + 1;
                  return next;
                });
                timerRef.current = setTimeout(() => {
                  if (index + 1 >= items.length) {
                    requestAnimationFrame(() => {
                      setWithTransition(false);
                      setIndex(0);
                    });
                  }
                  timerRef.current = setTimeout(tick, pauseMs);
                }, jumpMs);
              }, pauseMs);
            }}
          >
            {trackItems.map((t, i) => (
              <div className="vticker-item" key={i} title={t}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
