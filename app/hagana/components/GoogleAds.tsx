"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const MOCK = {
  spend: 764.37,
  impressions: 1125,
  clicks: 64,
  ctr: 5.69,
  cpc: 11.94,
  conversoes: 3,
  custoConv: 254.79,
  keywords: [
    { termo: '"seg. privada curitiba"', cliques: 11 },
    { termo: "empresa portaria curitiba", cliques: 4 },
    { termo: "terc. portaria limpeza", cliques: 1 },
    { termo: "terc. porteiro", cliques: 4 },
    { termo: "emp. terceirizadas curitiba", cliques: 1 },
  ],
  conversoesList: [
    { termo: '"empresa de portaria curitiba"', tipo: "Frase", ctr: 50, cpc: 3.73, conv: 1 },
    { termo: "terceirização portaria e limpeza", tipo: "Ampla", ctr: 100, cpc: 18.75, conv: 1 },
  ],
  termosExcluidos: ["up terceirização", "singular empresa", "empresa costa oeste", "adservi curitiba", "higiserv", "via serviços"],
  topTermos: [
    { termo: "facilities", cliques: 2, custo: 19.34, tipo: "Ampla" },
    { termo: "deuseg empresa de limpeza", cliques: 2, custo: 11.08, tipo: "Frase" },
    { termo: "base facilities curitiba", cliques: 2, custo: 14.93, tipo: "Frase" },
    { termo: "portaria limpeza e conservação", cliques: 2, custo: 53.68, tipo: "Ampla" },
    { termo: "jr segurança", cliques: 1, custo: 0.95, tipo: "Frase" },
    { termo: "via facilities", cliques: 1, custo: 2.01, tipo: "Frase" },
    { termo: "empresas terceirizadas em curitiba", cliques: 1, custo: 9.74, tipo: "Frase" },
    { termo: "empresa deuseg curitiba", cliques: 1, custo: 4.52, tipo: "Frase" },
    { termo: "empresas de serviços terceirizados", cliques: 1, custo: 9.24, tipo: "Ampla" },
    { termo: "atual limpeza e conservação", cliques: 1, custo: 8.51, tipo: "Frase" },
  ],
};

function brl(n: number) {
  return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function GoogleAds() {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">Google Ads</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>[Pesquisa] Intenção — Markseg</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-3 mb-5">
        {[
          { label: "Investimento", value: brl(MOCK.spend), color: "#f5c518" },
          { label: "Impressões", value: MOCK.impressions.toLocaleString("pt-BR"), color: "#ffffff", sub: "pesquisa" },
          { label: "Cliques", value: String(MOCK.clicks), color: "#22c55e", sub: `CTR ${MOCK.ctr}%` },
          { label: "CPC Médio", value: brl(MOCK.cpc), color: "#ffffff" },
          { label: "Conversões", value: String(MOCK.conversoes), color: "#22c55e", sub: "rastreadas" },
          { label: "Custo/Conv.", value: brl(MOCK.custoConv), color: "#f5c518" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4">
            <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-2">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
            {k.sub && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Bar chart keywords */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <p className="text-sm font-semibold text-white">Top Palavras-chave — Cliques</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK.keywords} margin={{ left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="termo" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="cliques" radius={[4, 4, 0, 0]}>
                {MOCK.keywords.map((_, i) => (
                  <Cell key={i} fill={["#ef4444","#22c55e","#22c55e","#f5c518","#a78bfa"][i % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversões */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-sm font-semibold text-white">Palavras com Conversão</p>
          </div>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }} className="uppercase mb-3">Conversões confirmadas</p>
          {MOCK.conversoesList.map((c, i) => (
            <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{c.termo}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {c.tipo} · CTR {c.ctr}% · CPC R${c.cpc}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                  {c.conv} conv.
                </span>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }} className="uppercase mt-4 mb-2">Termos excluídos esta semana</p>
          <div className="flex flex-wrap gap-1.5">
            {MOCK.termosExcluidos.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Termos */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <p className="text-sm font-semibold text-white">Top 10 Termos de Pesquisa</p>
        </div>
        <table className="w-full" style={{ fontSize: 12 }}>
          <thead>
            <tr style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th className="text-left pb-3 font-medium uppercase">Termo</th>
              <th className="pb-3 text-right font-medium uppercase">Cliques</th>
              <th className="pb-3 text-right font-medium uppercase">Custo</th>
              <th className="pb-3 text-right font-medium uppercase">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {MOCK.topTermos.map((t, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5" style={{ color: "#3A7BFF" }}>{t.termo}</td>
                <td className="py-2.5 text-right font-semibold" style={{ color: t.cliques >= 2 ? "#22c55e" : "rgba(255,255,255,0.6)" }}>{t.cliques}</td>
                <td className="py-2.5 text-right" style={{ color: t.custo > 30 ? "#ef4444" : "rgba(255,255,255,0.6)" }}>R$ {t.custo.toFixed(2)}</td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded text-xs" style={{
                    background: t.tipo === "Ampla" ? "rgba(58,123,255,0.15)" : "rgba(245,197,24,0.15)",
                    color: t.tipo === "Ampla" ? "#3A7BFF" : "#f5c518",
                    border: `1px solid ${t.tipo === "Ampla" ? "rgba(58,123,255,0.3)" : "rgba(245,197,24,0.3)"}`,
                  }}>
                    {t.tipo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
