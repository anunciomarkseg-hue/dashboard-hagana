"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const CORES = ["#3A7BFF", "#f5c518", "#ec4899", "#f97316", "#22c55e", "#a78bfa", "#6b7280"];

export default function Clarity() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clarity")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErro(d.error);
        else setData(d);
        setLoading(false);
      })
      .catch((e) => { setErro(String(e)); setLoading(false); });
  }, []);

  const sessoes = data?.Traffic?.totalSessionCount ?? 0;
  const usuarios = data?.Traffic?.totalUserCount ?? 0;
  const rolagem = data?.ScrollDepth?.averageScrollDepth ?? 0;
  const clquesMortos = data?.DeadClickCount?.percentage ?? 0;

  const navegadores: any[] = (data?.Browser || []).map((b: any, i: number) => ({
    nome: b.name || b.browserName || b.browser || "Outro",
    pct: Number((b.percentage ?? b.pct ?? 0).toFixed(2)),
    sessoes: b.sessions ?? 0,
    cor: CORES[i % CORES.length],
  }));

  const origens: any[] = (data?.ReferrerUrl || []).slice(0, 8).map((r: any, i: number) => ({
    origem: r.url || r.referrerUrl || r.referrer || "Direto",
    sessoes: r.sessions ?? r.sessionCount ?? 0,
    cor: CORES[i % CORES.length],
  }));

  const paginas: any[] = (data?.PopularPages || []).slice(0, 8).map((p: any) => ({
    url: p.url || p.page || "/",
    sessoes: p.sessions ?? p.sessionCount ?? 0,
    rola: Number((p.scrollDepth ?? p.averageScrollDepth ?? 0).toFixed(1)),
  }));

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">Microsoft Clarity</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>dados em tempo real</span>
        {erro && <span style={{ fontSize: 11, color: "#ef4444" }}>Erro: {erro}</span>}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Sessões", value: loading ? "—" : String(sessoes), sub: `${usuarios} usuários únicos`, color: "#f5c518" },
          { label: "Rolagem Média", value: loading ? "—" : `${rolagem.toFixed(1)}%`, sub: rolagem >= 50 ? "bom engajamento" : "pode melhorar", color: rolagem >= 50 ? "#22c55e" : "#f5c518" },
          { label: "Cliques Mortos", value: loading ? "—" : `${clquesMortos.toFixed(1)}%`, sub: "sem resposta visual", color: clquesMortos > 20 ? "#ef4444" : "#f5c518" },
          { label: "Navegadores", value: loading ? "—" : String(navegadores.length), sub: "tipos distintos", color: "#ffffff" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4">
            <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-2">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Navegadores + Origens */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <p className="text-sm font-semibold text-white">Navegadores</p>
          </div>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Carregando...</p>
          ) : navegadores.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Sem dados de navegadores</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={navegadores} dataKey="pct" innerRadius={40} outerRadius={64} stroke="none">
                    {navegadores.map((n, i) => <Cell key={i} fill={n.cor} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {navegadores.map((n) => (
                  <div key={n.nome} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.cor }} />
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{n.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(n.pct, 100)}%`, background: n.cor }} />
                      </div>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", width: 38, textAlign: "right" }}>{n.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-sm font-semibold text-white">Origem das Sessões</p>
          </div>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Carregando...</p>
          ) : origens.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Sem dados de origem</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={origens} margin={{ left: -20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="origem" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="sessoes" radius={[4, 4, 0, 0]}>
                  {origens.map((o, i) => <Cell key={i} fill={o.cor} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Páginas Populares */}
      {paginas.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <p className="text-sm font-semibold text-white">Páginas Populares</p>
          </div>
          <table className="w-full" style={{ fontSize: 12 }}>
            <thead>
              <tr style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left pb-3 font-medium uppercase">URL</th>
                <th className="pb-3 text-right font-medium uppercase">Sessões</th>
                <th className="pb-3 text-right font-medium uppercase">Rolagem Média</th>
              </tr>
            </thead>
            <tbody>
              {paginas.map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5" style={{ color: "#3A7BFF" }}>{p.url}</td>
                  <td className="py-2.5 text-right font-semibold" style={{ color: "#22c55e" }}>{p.sessoes}</td>
                  <td className="py-2.5 text-right" style={{ color: p.rola >= 50 ? "#22c55e" : "#f5c518" }}>{p.rola > 0 ? `${p.rola}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
