"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MOCK = {
  leads: 7, google: 3, meta: 4,
  propostas: 3, emContato: 2, perdido: 1,
  funil: [
    { etapa: "Leads Recebidos", sub: "3 Google · 4 Meta", qtd: 7, pct: 100, cor: "#22c55e" },
    { etapa: "Proposta Enviada", sub: "avançaram no funil", qtd: 3, pct: 43, cor: "#3A7BFF" },
    { etapa: "Em Contato", sub: "aguardando retorno", qtd: 2, pct: 29, cor: "#f5c518" },
    { etapa: "Perdido", sub: "", qtd: 1, pct: 14, cor: "#ef4444" },
  ],
  canais: [
    { canal: "Google Ads", leads: 3, fill: "#f5c518" },
    { canal: "Meta Ads", leads: 4, fill: "#3A7BFF" },
  ],
  resumo: [
    { status: "Proposta Enviada", qtd: 3, pct: 43, cor: "#3A7BFF" },
    { status: "Em Contato", qtd: 2, pct: 29, cor: "#f5c518" },
    { status: "Perdido", qtd: 1, pct: 14, cor: "#ef4444" },
    { status: "Novo / Sem etapa", qtd: 1, pct: 14, cor: "#6b7280" },
  ],
};

export default function CRM() {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-1">
        <h2 className="text-xl font-bold text-white">CRM · Resultados Comerciais</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>RD Station · semana atual</span>
      </div>
      <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>dados inseridos manualmente — Google Ads em breve</p>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Leads Recebidos", value: MOCK.leads, sub: `${MOCK.google} Google · ${MOCK.meta} Meta`, color: "#22c55e", bg: "rgba(34,197,94,0.06)" },
          { label: "Propostas Enviadas", value: MOCK.propostas, sub: `${Math.round(MOCK.propostas/MOCK.leads*100)}% dos leads`, color: "#3A7BFF", bg: "rgba(58,123,255,0.06)" },
          { label: "Em Contato", value: MOCK.emContato, sub: "aguardando retorno", color: "#f5c518", bg: "rgba(245,197,24,0.06)" },
          { label: "Perdido", value: MOCK.perdido, sub: `${Math.round(MOCK.perdido/MOCK.leads*100)}% dos leads`, color: "#ef4444", bg: "rgba(239,68,68,0.06)" },
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
            <p className="text-sm font-semibold text-white">Funil da Semana</p>
          </div>
          <div className="space-y-2">
            {MOCK.funil.map((f, i) => (
              <div key={i}>
                {i > 0 && (
                  <div className="flex items-center gap-2 py-1.5 pl-4">
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                      ↓ {i === 1 ? "qualificação" : i === 2 ? "follow-up" : ""}
                    </span>
                  </div>
                )}
                <div
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{
                    background: `rgba(${f.cor === "#22c55e" ? "34,197,94" : f.cor === "#3A7BFF" ? "58,123,255" : f.cor === "#f5c518" ? "245,197,24" : "239,68,68"},0.08)`,
                    border: `1px solid ${f.cor}22`,
                    marginLeft: i * 16,
                  }}
                >
                  <div>
                    <p className="font-semibold text-white text-sm">{f.etapa}</p>
                    {f.sub && <p style={{ fontSize: 11, color: f.cor, marginTop: 2 }}>{f.sub}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: f.cor }}>{f.qtd}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{f.pct}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Leads por Canal */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <p className="text-sm font-semibold text-white">Leads por Canal</p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={MOCK.canais} margin={{ left: -20 }}>
                <XAxis dataKey="canal" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
                  {MOCK.canais.map((c, i) => <Cell key={i} fill={c.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resumo CRM */}
          <div className="glass rounded-2xl p-5 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <p className="text-sm font-semibold text-white">Resumo CRM</p>
            </div>
            <table className="w-full" style={{ fontSize: 12 }}>
              <thead>
                <tr style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th className="text-left pb-2 font-medium uppercase">Status</th>
                  <th className="pb-2 text-right font-medium uppercase">Qtd</th>
                  <th className="pb-2 text-right font-medium uppercase">%</th>
                </tr>
              </thead>
              <tbody>
                {MOCK.resumo.map((r, i) => (
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
                  <td className="py-2 text-right font-semibold text-white">{MOCK.leads}</td>
                  <td className="py-2 text-right text-white">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
