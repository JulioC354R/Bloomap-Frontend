// src/components/panel/InfoModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/** Types used by the main panel */
type Info = {
  status: "high" | "medium" | "low";
  index: number;
  variation: string;
  trend: "rising" | "stable" | "falling";
  history: number[];
  insight: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
};

type Coords = {
  latMin: string;
  latMax: string;
  lonMin: string;
  lonMax: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  info: Info | null;
  /** Initial coordinates from the map click */
  initialCoords?: Partial<Coords>;
  /** Called when the user wants to open the dedicated history screen */
  onOpenHistory?: () => void;
};

export default function InfoModal({
  open,
  onClose,
  info,
  initialCoords,
  onOpenHistory,
}: Props) {
  const [coords, setCoords] = useState<Coords>({
    latMin: "",
    latMax: "",
    lonMin: "",
    lonMax: "",
  });

  // Fills the coordinate fields when the modal opens or when the initial coords change
  useEffect(() => {
    if (!open) return;
    setCoords((prev) => ({
      latMin: initialCoords?.latMin ?? prev.latMin ?? "",
      latMax: initialCoords?.latMax ?? prev.latMax ?? "",
      lonMin: initialCoords?.lonMin ?? prev.lonMin ?? "",
      lonMax: initialCoords?.lonMax ?? prev.lonMax ?? "",
    }));
  }, [open, initialCoords]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoords((c) => ({ ...c, [name]: value }));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2000] grid place-items-center p-4"
          style={{ backgroundColor: "rgba(7, 23, 63, 0.65)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl rounded-2xl shadow-2xl"
            style={{
              background:
                "linear-gradient(45deg, var(--sa-electric), var(--sa-deep-blue))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5">
              <h3 className="text-2xl font-bold">Area Bloom Indicators</h3>
              <button onClick={onClose} className="btn-accent">
                Exit
              </button>
            </div>

            {/* Body */}
            <div className="px-5 pb-5 space-y-5">
              {!info ? (
                <p style={{ color: "var(--sa-muted)" }}>Loading…</p>
              ) : (
                <>
                  {/* Cards: status / index / variation / trend */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Status", info.status],
                      ["Index", info.index.toFixed(2)],
                      ["Variation", info.variation],
                      ["Trend", info.trend],
                    ].map(([label, val]) => (
                      <div
                        key={label}
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div style={{ color: "var(--sa-muted)" }}>{label}</div>
                        <div className="font-semibold capitalize">
                          {val as string}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* History (chips) + Coordinates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* History (simple chips) */}
                    <div>
                      <div style={{ color: "var(--sa-muted)" }}>History</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {info.history.map((v, i) => (
                          <span
                            key={i}
                            className="rounded-full border px-2 py-0.5 text-xs"
                            style={{ borderColor: "rgba(255,255,255,0.2)" }}
                          >
                            {v.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Coordinates */}
                    <div>
                      <div
                        style={{ color: "var(--sa-muted)" }}
                        className="mb-2"
                      >
                        Coordinates
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["Minimum Latitude", "latMin"],
                          ["Maximum Latitude", "latMax"],
                          ["Minimum Longitude", "lonMin"],
                          ["Maximum Longitude", "lonMax"],
                        ].map(([label, name]) => (
                          <div key={name} className="space-y-1">
                            <label
                              className="text-xs"
                              style={{ color: "var(--sa-muted)" }}
                            >
                              {label}
                            </label>
                            <input
                              type="text"
                              name={name}
                              value={coords[name as keyof Coords]}
                              onChange={handleChange}
                              className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Insight */}
                  {info.insight && (
                    <div
                      className="rounded-xl p-3"
                      style={{
                        backgroundColor: "rgba(234,254,7,0.1)",
                        border: "1px solid rgba(234,254,7,0.35)",
                      }}
                    >
                      <div
                        className="text-sm"
                        style={{ color: "var(--sa-neon-yellow)" }}
                      >
                        {info.insight}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      ["Country", info.country ?? "-"],
                      ["State", info.state ?? "-"],
                      ["City", info.city ?? "-"],
                    ].map(([label, val]) => (
                      <div
                        key={label}
                        className="rounded-xl p-3"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div
                          className="text-xs"
                          style={{ color: "var(--sa-muted)" }}
                        >
                          {label}
                        </div>
                        <div className="font-medium">{val as string}</div>
                      </div>
                    ))}
                  </div>

                  {/* Button: open history panel */}
                  <div className="pt-4">
                    <button
                      className="btn-accent w-full"
                      onClick={onOpenHistory}
                    >
                      View Blooming History
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}