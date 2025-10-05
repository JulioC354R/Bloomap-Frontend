// src/components/panel/InfoModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/** Tipos usados pelo painel principal */
type Info = {
  status: "alta" | "media" | "baixa";
  indice: number;
  variacao: string;
  tendencia: "subindo" | "estavel" | "caindo";
  historico: number[];
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
  /** Coordenadas iniciais vindas do clique no mapa */
  initialCoords?: Partial<Coords>;
  /** Chamada quando o usuário quiser abrir a tela dedicada de histórico */
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

  // Preenche os campos de coordenadas quando o modal abre ou quando mudam as coords iniciais
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
              <h3 className="text-2xl font-bold">Indicadores da área</h3>
              <button onClick={onClose} className="btn-accent">
                Fechar
              </button>
            </div>

            {/* Body */}
            <div className="px-5 pb-5 space-y-5">
              {!info ? (
                <p style={{ color: "var(--sa-muted)" }}>Carregando…</p>
              ) : (
                <>
                  {/* Cards: status / índice / variação / tendência */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Status", info.status],
                      ["Índice", info.indice.toFixed(2)],
                      ["Variação", info.variacao],
                      ["Tendência", info.tendencia],
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

                  {/* Histórico (chips) + Coordenadas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Histórico (chips simples) */}
                    <div>
                      <div style={{ color: "var(--sa-muted)" }}>Histórico</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {info.historico.map((v, i) => (
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

                    {/* Coordenadas */}
                    <div>
                      <div
                        style={{ color: "var(--sa-muted)" }}
                        className="mb-2"
                      >
                        Coordenadas
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["Latitude mínima", "latMin"],
                          ["Latitude máxima", "latMax"],
                          ["Longitude mínima", "lonMin"],
                          ["Longitude máxima", "lonMax"],
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

                  {/* Localização */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {[
                      ["País", info.country ?? "-"],
                      ["Estado", info.state ?? "-"],
                      ["Cidade", info.city ?? "-"],
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

                  {/* Botão: abrir tela de histórico (mesmo design do painel) */}
                  <div className="pt-4">
                    <button
                      className="btn-accent w-full"
                      onClick={onOpenHistory}
                    >
                      Visualizar o histórico de floração
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
