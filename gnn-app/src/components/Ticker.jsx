import { useEffect, useMemo, useRef, useState } from "react";
import "./Ticker.css";

export default function Ticker({
  items = [],
  pauseMs = 2000,
  jumpMs = 250,
  rowHeight = 36,
}) {
  // 无缝循环：复制首条到尾部
  const track = useMemo(() => {
    if (!items?.length) return [];
    if (items.length === 1) return [items[0]];
    return [...items, items[0]];
  }, [items]);

  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(false);
  const timerRef = useRef(null);
  const idxRef = useRef(0);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimers();
    idxRef.current = 0;
    setIndex(0);
    setWithTransition(false);

    // 无数据或仅一条：不动
    if (items.length <= 1) return;

    const tick = () => {
      // 开启过渡，滚到下一条
      setWithTransition(true);
      setIndex((prev) => {
        const next = prev + 1;
        idxRef.current = next;
        return next;
      });

      // 等过渡完成后，判断是否到达克隆项，若到达则“无过渡复位”为 0
      timerRef.current = setTimeout(() => {
        if (idxRef.current >= items.length) {
          // 到达 track 的“克隆”行（最后一行）
          // 先关闭过渡 → 立即把 index 设为 0，避免任何可见位移
          setWithTransition(false);
          requestAnimationFrame(() => {
            setIndex(0);
            idxRef.current = 0;
          });
        }
        // 进入下一轮停顿
        timerRef.current = setTimeout(tick, pauseMs);
      }, jumpMs);
    };

    // 先停顿，再滚动
    timerRef.current = setTimeout(tick, pauseMs);

    return clearTimers;
  }, [items, pauseMs, jumpMs]);

  // 计算位移
  const translateY = -(index * rowHeight);

  return (
    <div className="vticker">
      <div className="container vticker-inner" style={{ paddingRight: 0 }}>
        <span className="vticker-badge">快讯</span>

        <div className="vticker-viewport" style={{ ["--row-h"]: `${rowHeight}px` }}>
          <div
            className="vticker-track"
            style={{
              transform: `translateY(${translateY}px)`,
              transition: withTransition ? `transform ${jumpMs}ms linear` : "none",
            }}
            onMouseEnter={clearTimers}
            onMouseLeave={() => {
              // 鼠标移出后恢复节拍：从当前 index 继续
              if (items.length <= 1) return;
              clearTimers();
              timerRef.current = setTimeout(() => {
                // 立刻触发一次 tick（与 useEffect 的逻辑一致）
                setWithTransition(true);
                setIndex((prev) => {
                  const next = prev + 1;
                  idxRef.current = next;
                  return next;
                });
                timerRef.current = setTimeout(() => {
                  if (idxRef.current >= items.length) {
                    setWithTransition(false);
                    requestAnimationFrame(() => {
                      setIndex(0);
                      idxRef.current = 0;
                    });
                  }
                  timerRef.current = setTimeout(() => {
                    // 后续循环交回给主 useEffect 里的逻辑
                  }, pauseMs);
                }, jumpMs);
              }, pauseMs);
            }}
          >
            {(track.length ? track : ["暂无快讯"]).map((t, i) => (
              <div className="vticker-item" key={`${i}-${t}`} title={t}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
