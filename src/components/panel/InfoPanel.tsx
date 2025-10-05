"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Info = {
  status: "alta" | "media" | "baixa";
  indice: number;
  variacao: string;
  tendencia: "subindo" | "estavel" | "caindo";
  historico: { date: string; bloom: number; is_peak?: boolean }[];
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
  initialCoords?: Partial<Coords>; // recebe do clique
};

const InfoPanel = ({ open, onClose, info, initialCoords }: Props) => {
  const [coords, setCoords] = useState<Coords>({
    latMin: "",
    latMax: "",
    lonMin: "",
    lonMax: "",
  });

  useEffect(() => {
    if (!open) return;
    setCoords((prev) => ({
      latMin: initialCoords?.latMin ?? prev.latMin ?? "",
      latMax: initialCoords?.latMax ?? prev.latMax ?? "",
      lonMin: initialCoords?.lonMin ?? prev.lonMin ?? "",
      lonMax: initialCoords?.lonMax ?? prev.lonMax ?? "",
    }));
  }, [
    open,
    initialCoords?.latMin,
    initialCoords?.latMax,
    initialCoords?.lonMin,
    initialCoords?.lonMax,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoords((c) => ({ ...c, [e.target.name]: e.target.value }));
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
            <div className="flex items-center justify-between p-5">
              <h3 className="text-2xl font-bold">Indicadores da área</h3>
              <button onClick={onClose} className="btn-accent">
                Fechar
              </button>
            </div>

            <div className="px-5 pb-5 space-y-5">
              {/* bloco de info existente */}
              {!info ? (
                <p style={{ color: "var(--sa-muted)" }}>Carregando…</p>
              ) : (
                <>
                  {/* ... seus cards de status/índice/variação/tendência/histórico/insight ... */}

                  {/* País/Estado/Cidade... (mantém como já tinha) */}
                </>
              )}

              {/* 🔹 NOVO: Campos de coordenadas */}
              <div className="mt-2">
                <div style={{ color: "var(--sa-muted)" }} className="mb-2">
                  Coordenadas (lat/lon)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      className="text-xs"
                      style={{ color: "var(--sa-muted)" }}
                    >
                      Latitude mínima
                    </label>
                    <input
                      type="text"
                      name="latMin"
                      value={coords.latMin}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
                      placeholder="-8.050000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-xs"
                      style={{ color: "var(--sa-muted)" }}
                    >
                      Latitude máxima
                    </label>
                    <input
                      type="text"
                      name="latMax"
                      value={coords.latMax}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
                      placeholder="-8.050000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-xs"
                      style={{ color: "var(--sa-muted)" }}
                    >
                      Longitude mínima
                    </label>
                    <input
                      type="text"
                      name="lonMin"
                      value={coords.lonMin}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
                      placeholder="-34.900000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      className="text-xs"
                      style={{ color: "var(--sa-muted)" }}
                    >
                      Longitude máxima
                    </label>
                    <input
                      type="text"
                      name="lonMax"
                      value={coords.lonMax}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
                      placeholder="-34.900000"
                    />
                  </div>
                </div>

                {/* Botões de ação (opcional) */}
                <div className="mt-3 flex gap-2">
                  <button className="btn-accent">Aplicar</button>
                  <button
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm"
                    onClick={() =>
                      setCoords({
                        latMin: "",
                        latMax: "",
                        lonMin: "",
                        lonMax: "",
                      })
                    }
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
