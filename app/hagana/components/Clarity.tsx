"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const MOCK = {
  sessoes: 106, unicos: 102,
  rolagem: 41, rolagemAnterior: 28,
  tempoAtivo: 25,
  performance: 81.6,
  formularios: 3, formPct: 2.83,
  clquesMortos: 14.15,
  navegadores: [
    { nome: "Chrome Mobile", pct: 36.79, cor: "#3A7BFF" },
    { nome: "Facebook App", pct: 34.91, cor: "#f5c518" },
    { nome: "Instagram App", pct: 14.15, cor: "#ec4899" },
    { nome: "Safari Mobile", pct: 6.60, cor: "#f97316" },
    { nome: "Chrome Desktop", pct: 6.60, cor: "#22c55e" },
  ],
  origens: [
    { origem: "www.google.com", sessoes: 35, cor: "#3A7BFF" },
    { origem: "m.facebook.com", sessoes: 25, cor: "#f5c518" },
    { origem: "curitiba.hagana.com.br", sessoes: 12, cor: "#6b7280" },
    { origem: "instagram.com", sessoes: 8, cor: "#ec4899" },
    { origem: "l.facebook.com", sessoes: 5, cor: "#a78bfa" },
  ],
};

export default function Clarity() {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">Microsoft Clarity</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>4–10 abr 2026 · /sindicos-page-mads</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-3 mb-5">
        {[
          { label: "Sessões", value: String(MOCK.sessoes), sub: `${MOCK.unicos} únicos`, color: "#f5c518" },
          { label: "Rolagem Média", value: `${MOCK.rolagem}%`, sub: `↑ era ${MOCK.rolagemAnterior}% na semana ant.`, color: "#f5c518" },
          { label: "Tempo Ativo", value: `${MOCK.tempoAtivo}s`, sub: "↑ melhorou", color: "#22c55e" },
          { label: "Performance", value: String(MOCK.performance), sub: "LCP 3,4s", color: "#22c55e" },
          { label: "Formulários", value: String(MOCK.formularios), sub: `${MOCK.formPct}% das sessões`, color: "#ffffff" },
          { label: "Cliques Mortos", value: `${MOCK.clquesMortos}%`, sub: "atenção", color: "#ef4444" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4">
            <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-2">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Heatmap + Navegadores */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="relative">
            <img src="/ART SIND 03.png" className="w-full opacity-40" style={{ filter: "blur(1px)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white font-semibold mb-1">Mapa de Toque — Celular</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Clarity · concentração de interação por área</p>
              </div>
            </div>
          </div>
          <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Clarity · 4–10 abr 2026 · Concentração de interação por área</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <p className="text-sm font-semibold text-white">Navegadores — Mudança de perfil</p>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={MOCK.navegadores} dataKey="pct" innerRadius={40} outerRadius={64} stroke="none">
                  {MOCK.navegadores.map((n, i) => <Cell key={i} fill={n.cor} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {MOCK.navegadores.map((n) => (
                <div key={n.nome} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.cor }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{n.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${n.pct}%`, background: n.cor }} />
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", width: 40, textAlign: "right" }}>{n.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Origem das sessões */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <p className="text-sm font-semibold text-white">Origem das Sessões</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={MOCK.origens} margin={{ left: -20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="origem" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="sessoes" radius={[4,4,0,0]}>
              {MOCK.origens.map((o, i) => <Cell key={i} fill={o.cor} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
