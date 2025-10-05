"use client";

import React, { JSX, useMemo } from "react";
// Make sure your Info type also uses the translated property names (history, index, etc.)
import type { Info, BloomSample } from "@/types/info"; 

interface BloomHistoryPanelProps {
  open: boolean;
  onClose: () => void;
  info: Info;
}

export default function BloomHistoryPanel({
  open,
  onClose,
  info,
}: BloomHistoryPanelProps): JSX.Element | null {
  const firstDate = useMemo(
    () => firstBloomDate(info.history),
    [info.history]
  );
  const lastDate = useMemo(
    () => lastBloomDate(info.history),
    [info.history]
  );
  const peaksCount = useMemo(
    () => info.history.filter((d) => d.is_peak).length,
    [info.history]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] p-6 overflow-auto"
      style={{
        background:
          "linear-gradient(45deg, var(--sa-electric), var(--sa-deep-blue))",
      }}
    >
      {/* Top bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blooming History</h1>
          <p className="text-sm" style={{ color: "var(--sa-muted)" }}>
            {info.city ? `${info.city}, ` : ""}
            {info.state ? `${info.state}, ` : ""}
            {info.country ?? ""}
          </p>
        </div>
        <button onClick={onClose} className="btn-accent">
          Exit
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card label="Status" value={labelStatus(info.status)} />
          <Card label="Index (bloom)" value={fmtPctOr1(info.index)} />
          <Card label="Variation" value={info.variation.toString()} />
          <Card label="Trend" value={labelTrend(info.trend)} />
        </div>

        {/* Time series */}
        <section
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="mb-2 text-sm" style={{ color: "var(--sa-muted)" }}>
            Time Series (bloom)
          </div>

          {info.history.length > 1 ? (
            <Sparkline data={info.history} height={160} width={960} />
          ) : (
            <div className="text-xs" style={{ color: "var(--sa-muted)" }}>
              Not enough data for chart.
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Card subtle label="First Bloom" value={firstDate ?? "-"} />
            <Card subtle label="Last Bloom" value={lastDate ?? "-"} />
            <Card subtle label="Detected Peaks" value={String(peaksCount)} />
          </div>
        </section>

        {/* Insight */}
        {info.insight && (
          <section
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-sm mb-1" style={{ color: "var(--sa-muted)" }}>
              Insight
            </div>
            <p className="text-sm">{info.insight}</p>
          </section>
        )}
      </div>
    </div>
  );
}

/* ======= Subcomponents ======= */

interface CardProps {
  label: string;
  value: string;
  subtle?: boolean;
}

function Card({ label, value, subtle = false }: CardProps): JSX.Element {
  return (
    <div
      className={`rounded-xl p-3 border ${
        subtle ? "bg-white/5 border-white/10" : "bg-white/10 border-white/15"
      }`}
    >
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}

interface SparklineProps {
  data: BloomSample[];
  height?: number;
  width?: number;
}

function Sparkline({
  data,
  height = 120,
  width = 960,
}: SparklineProps): JSX.Element {
  const PAD = 10;

  const x = (i: number): number =>
    PAD + (i * (width - 2 * PAD)) / Math.max(1, data.length - 1);

  const y = (v: number): number => height - PAD - v * (height - 2 * PAD);

  const d = useMemo(() => {
    if (!data.length) return "";

    const PAD = 10;
    const x = (i: number): number =>
      PAD + (i * (width - 2 * PAD)) / Math.max(1, data.length - 1);
    const y = (v: number): number => height - PAD - v * (height - 2 * PAD);

    return data
      .map((p, i) => `${i ? "L" : "M"} ${x(i)} ${y(clamp01(p.bloom))}`)
      .join(" ");
  }, [data, height, width]);
  return (
    <svg
      className="w-full rounded-lg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Blooming time series"
    >
      <line
        x1={PAD}
        y1={y(0)}
        x2={width - PAD}
        y2={y(0)}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
      <path
        d={d}
        fill="none"
        stroke="white"
        strokeOpacity={0.9}
        strokeWidth={1.8}
      />
      {data.map(
        (p, i) =>
          p.is_peak && (
            <circle
              key={i}
              cx={x(i)}
              cy={y(clamp01(p.bloom))}
              r={4}
              fill="#ffcc00"
              stroke="black"
              strokeOpacity={0.35}
            />
          )
      )}
    </svg>
  );
}

/* ======= Helpers ======= */

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function firstBloomDate(series: BloomSample[]): string | null {
  const s = series.find((d) => d.bloom > 0);
  return s ? new Date(s.date).toLocaleDateString() : null;
}

function lastBloomDate(series: BloomSample[]): string | null {
  const s = [...series].reverse().find((d) => d.bloom > 0);
  return s ? new Date(s.date).toLocaleDateString() : null;
}

function labelStatus(s: Info["status"]): string {
  switch (s) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    default:
      return "Low";
  }
}

function labelTrend(t: Info["trend"]): string {
  switch (t) {
    case "rising":
      return "Rising";
    case "stable":
      return "Stable";
    default:
      return "Falling";
  }
}

function fmtPctOr1(v: number): string {
  if (v > 1) return `${v.toFixed(0)}%`;
  if (v >= 0 && v <= 1) return `${(v * 100).toFixed(0)}%`;
  return String(v);
}