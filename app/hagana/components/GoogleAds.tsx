"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

function brl(n: number) {
  return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function GoogleAds({ since, until }: { since: string; until: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!since || !until) return;
    setLoading(true);
    fetch(`/api/google/ads?since=${since}&until=${until}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [since, until]);

  const m = data?.metrics;
  const campanhas = data?.campanhas || [];
  const keywords = data?.keywords || [];
  const termos = data?.termos || [];

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">Google Ads</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>dados em tempo real</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-3 mb-5">
        {[
          { label: "Investimento", value: loading ? "—" : brl(m?.spend ?? 0), color: "#f5c518" },
          { label: "Impressões", value: loading ? "—" : (m?.impressions ?? 0).toLocaleString("pt-BR"), color: "#ffffff", sub: "pesquisa" },
          { label: "Cliques", value: loading ? "—" : String(m?.clicks ?? 0), color: "#22c55e", sub: loading ? "" : `CTR ${(m?.ctr ?? 0).toFixed(2)}%` },
          { label: "CPC Médio", value: loading ? "—" : brl(m?.cpc ?? 0), color: "#ffffff" },
          { label: "Conversões", value: loading ? "—" : String(m?.conversoes ?? 0), color: "#22c55e", sub: "rastreadas" },
          { label: "Custo/Conv.", value: loading ? "—" : brl(m?.custoConv ?? 0), color: "#f5c518" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4">
            <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-2">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
            {k.sub && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-5">

        {/* Keywords chart */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <p className="text-sm font-semibold text-white">Top Palavras-chave — Cliques</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={keywords} margin={{ left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="termo" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                {keywords.map((_: any, i: number) => (
                  <Cell key={i} fill={["#ef4444","#22c55e","#22c55e","#f5c518","#a78bfa","#3A7BFF","#ef4444","#22c55e","#f5c518","#a78bfa"][i % 10]} />
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
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Carregando...</p>
          ) : (
            <>
              <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }} className="uppercase mb-3">Conversões confirmadas</p>
              {keywords.filter((k: any) => k.conversoes > 0).length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Nenhuma conversão no período</p>
              ) : (
                keywords.filter((k: any) => k.conversoes > 0).map((k: any, i: number) => (
                  <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-medium">"{k.termo}"</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                          {k.tipo} · CTR {k.ctr.toFixed(1)}% · CPC {brl(k.cpc)}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                        {k.conversoes} conv.
                      </span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Campanhas */}
      {campanhas.length > 0 && (
        <div className="glass rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <p className="text-sm font-semibold text-white">Campanhas</p>
          </div>
          <table className="w-full" style={{ fontSize: 12 }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left pb-3 font-medium uppercase">Campanha</th>
                <th className="pb-3 text-right font-medium uppercase">Impressões</th>
                <th className="pb-3 text-right font-medium uppercase">Cliques</th>
                <th className="pb-3 text-right font-medium uppercase">CTR</th>
                <th className="pb-3 text-right font-medium uppercase">CPC</th>
                <th className="pb-3 text-right font-medium uppercase">Conversões</th>
                <th className="pb-3 text-right font-medium uppercase">Gasto</th>
              </tr>
            </thead>
            <tbody>
              {campanhas.map((c: any, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/5 transition-colors">
                  <td className="py-3" style={{ color: "rgba(255,255,255,0.8)" }}>{c.nome}</td>
                  <td className="py-3 text-right" style={{ color: "rgba(255,255,255,0.6)" }}>{c.impressions.toLocaleString("pt-BR")}</td>
                  <td className="py-3 text-right font-semibold" style={{ color: "#22c55e" }}>{c.clicks}</td>
                  <td className="py-3 text-right" style={{ color: "rgba(255,255,255,0.6)" }}>{c.ctr.toFixed(2)}%</td>
                  <td className="py-3 text-right" style={{ color: "rgba(255,255,255,0.6)" }}>{brl(c.cpc)}</td>
                  <td className="py-3 text-right" style={{ color: c.conversoes > 0 ? "#22c55e" : "rgba(255,255,255,0.4)" }}>{c.conversoes}</td>
                  <td className="py-3 text-right" style={{ color: "#f5c518" }}>{brl(c.spend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              <th className="pb-3 text-right font-medium uppercase">Conv.</th>
              <th className="pb-3 text-right font-medium uppercase">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>Carregando...</td></tr>
            ) : termos.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>Sem dados no período</td></tr>
            ) : termos.map((t: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5" style={{ color: "#3A7BFF" }}>{t.termo}</td>
                <td className="py-2.5 text-right font-semibold" style={{ color: t.clicks >= 2 ? "#22c55e" : "rgba(255,255,255,0.6)" }}>{t.clicks}</td>
                <td className="py-2.5 text-right" style={{ color: t.custo > 30 ? "#ef4444" : "rgba(255,255,255,0.6)" }}>R$ {t.custo.toFixed(2)}</td>
                <td className="py-2.5 text-right" style={{ color: t.conversoes > 0 ? "#22c55e" : "rgba(255,255,255,0.4)" }}>{t.conversoes || "—"}</td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded text-xs" style={{
                    background: t.tipo === "BROAD" ? "rgba(58,123,255,0.15)" : "rgba(245,197,24,0.15)",
                    color: t.tipo === "BROAD" ? "#3A7BFF" : "#f5c518",
                    border: `1px solid ${t.tipo === "BROAD" ? "rgba(58,123,255,0.3)" : "rgba(245,197,24,0.3)"}`,
                  }}>
                    {t.tipo === "BROAD" ? "Ampla" : t.tipo === "PHRASE" ? "Frase" : t.tipo === "EXACT" ? "Exata" : t.tipo}
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
