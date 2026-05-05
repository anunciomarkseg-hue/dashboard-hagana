"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ETAPA_CORES: Record<string, string> = {
  Lead: "#22c55e",
  "Qualified Lead": "#3A7BFF",
  Opportunity: "#f5c518",
  Client: "#a78bfa",
  Evangelist: "#ec4899",
  Perdido: "#ef4444",
};

function corEtapa(etapa: string) {
  return ETAPA_CORES[etapa] || "#6b7280";
}

export default function CRM() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rdstation/leads")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = data?.total ?? 0;
  const porOrigem: Record<string, number> = data?.porOrigem ?? {};
  const porEtapa: Record<string, number> = data?.porEtapa ?? {};

  const google = porOrigem["Google Ads"] ?? 0;
  const meta = porOrigem["Meta Ads"] ?? 0;
  const outros = total - google - meta;

  const canais = [
    { canal: "Google Ads", leads: google, fill: "#f5c518" },
    { canal: "Meta Ads", leads: meta, fill: "#3A7BFF" },
    ...(outros > 0 ? [{ canal: "Outros", leads: outros, fill: "#6b7280" }] : []),
  ].filter((c) => c.leads > 0);

  const etapas = Object.entries(porEtapa).sort((a, b) => b[1] - a[1]);

  const funilEtapas = etapas.map(([etapa, qtd]) => ({
    etapa: etapa || "Lead",
    qtd,
    pct: total > 0 ? Math.round((qtd / total) * 100) : 0,
    cor: corEtapa(etapa || "Lead"),
  }));

  const resumo = etapas.map(([status, qtd]) => ({
    status: status || "Lead",
    qtd,
    pct: total > 0 ? Math.round((qtd / total) * 100) : 0,
    cor: corEtapa(status || "Lead"),
  }));

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-1">
        <h2 className="text-xl font-bold text-white">CRM · Resultados Comerciais</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>RD Station · via webhook</span>
      </div>
      <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>leads recebidos via webhook em tempo real</p>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Leads Recebidos", value: loading ? "—" : total, sub: `${google} Google · ${meta} Meta`, color: "#22c55e", bg: "rgba(34,197,94,0.06)" },
          { label: "Google Ads", value: loading ? "—" : google, sub: total > 0 ? `${Math.round(google / total * 100)}% dos leads` : "—", color: "#f5c518", bg: "rgba(245,197,24,0.06)" },
          { label: "Meta Ads", value: loading ? "—" : meta, sub: total > 0 ? `${Math.round(meta / total * 100)}% dos leads` : "—", color: "#3A7BFF", bg: "rgba(58,123,255,0.06)" },
          { label: "Outras Origens", value: loading ? "—" : outros, sub: "orgânico / direto", color: "#6b7280", bg: "rgba(107,114,128,0.06)" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-2xl p-5 text-center" style={{ background: k.bg }}>
            <p className="text-5xl font-bold mb-2" style={{ color: k.color }}>{k.value}</p>
            <p style={{ fontSize: 10, letterSpacing: "0.1em", color: k.color, opacity: 0.8 }} className="uppercase font-semibold mb-1">{k.label}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Funil + Canal */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Funil */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <p className="text-sm font-semibold text-white">Funil de Leads</p>
          </div>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Carregando...</p>
          ) : funilEtapas.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Nenhum lead recebido ainda</p>
          ) : (
            <div className="space-y-2">
              {funilEtapas.map((f, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1.5 pl-4">
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>↓</span>
                    </div>
                  )}
                  <div
                    className="rounded-xl p-4 flex items-center justify-between"
                    style={{
                      background: `${f.cor}14`,
                      border: `1px solid ${f.cor}22`,
                      marginLeft: Math.min(i * 12, 36),
                    }}
                  >
                    <div>
                      <p className="font-semibold text-white text-sm">{f.etapa}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: f.cor }}>{f.qtd}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{f.pct}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Leads por Canal */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <p className="text-sm font-semibold text-white">Leads por Canal</p>
            </div>
            {loading ? (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Carregando...</p>
            ) : canais.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Sem dados de canal</p>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={canais} margin={{ left: -20 }}>
                  <XAxis dataKey="canal" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                    {canais.map((c, i) => <Cell key={i} fill={c.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Resumo CRM */}
          <div className="glass rounded-2xl p-5 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <p className="text-sm font-semibold text-white">Resumo por Etapa</p>
            </div>
            <table className="w-full" style={{ fontSize: 12 }}>
              <thead>
                <tr style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left pb-2 font-medium uppercase">Etapa</th>
                  <th className="pb-2 text-right font-medium uppercase">Qtd</th>
                  <th className="pb-2 text-right font-medium uppercase">%</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="py-4 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>Carregando...</td></tr>
                ) : resumo.length === 0 ? (
                  <tr><td colSpan={3} className="py-4 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>Sem leads</td></tr>
                ) : (
                  <>
                    {resumo.map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td className="py-2">
                          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${r.cor}18`, color: r.cor, border: `1px solid ${r.cor}33` }}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 text-right font-semibold" style={{ color: r.cor }}>{r.qtd}</td>
                        <td className="py-2 text-right" style={{ color: r.cor }}>{r.pct}%</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      <td className="py-2 font-semibold text-white">Total</td>
                      <td className="py-2 text-right font-semibold text-white">{total}</td>
                      <td className="py-2 text-right text-white">100%</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
