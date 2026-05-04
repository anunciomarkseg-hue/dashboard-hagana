"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const CONJUNTOS = [
  {
    nome: "Conjunto Tráfego",
    ads: [
      { id: "ad3", nome: "ad3-estático", tipo: "Estático", top: true, src: "/ART MANUAL 01.png", alcance: 7247, impressoes: 10509, resultado: 332, custoRes: 0.21, cliques: 439, gasto: 76.46 },
      { id: "ad4", nome: "ad4-estático", tipo: "Estático", top: false, src: "/ART SIND 03.png", alcance: 4516, impressoes: 6199, resultado: 109, custoRes: 0.19, cliques: 207, gasto: 42.97 },
      { id: "ad5", nome: "ad5-motion 2", tipo: "Motion", top: false, src: null, video: "/VID SIND 03 (1).mp4", alcance: null, impressoes: 11504, resultado: 15, custoRes: 0.40, cliques: 384, gasto: 5.99 },
      { id: "ad7", nome: "ad7-vídeo (Mauro)", tipo: "Vídeo", custo: "alto", top: false, src: null, video: "/VID SIND 03 (1).mp4", alcance: 551, impressoes: 640, resultado: 15, custoRes: 0.40, cliques: 21, gasto: 5.99 },
    ],
  },
];

const comparativo = [
  { nome: "ad3-estático", resultados: 332, custo: 0.21 },
  { nome: "ad4-estático", resultados: 109, custo: 0.19 },
  { nome: "ad5-motion 2", resultados: 15, custo: 0.40 },
  { nome: "ad7-vídeo", resultados: 15, custo: 0.40 },
];

export default function Criativos({ metaData }: { metaData: any }) {
  const ads = metaData?.ads || [];

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">Criativos</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Mesmos criativos ativos · Meta Ads</span>
      </div>

      {/* Comparativo chart */}
      <div className="glass rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <p className="text-sm font-semibold text-white">Comparativo — Custo por Resultado vs Volume</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={comparativo} margin={{ left: -10 }}>
            <XAxis dataKey="nome" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
            <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} />
            <Bar yAxisId="left" dataKey="resultados" name="Resultados" fill="#22c55e" radius={[4,4,0,0]} />
            <Bar yAxisId="right" dataKey="custo" name="Custo/Res. (R$)" fill="#f5c518" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ad sets */}
      {CONJUNTOS.map((conjunto) => (
        <div key={conjunto.nome} className="mb-6">
          <p className="text-sm font-semibold text-white mb-3">{conjunto.nome}</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {conjunto.ads.map((ad) => (
              <div key={ad.id} className="glass glass-hover rounded-2xl flex-shrink-0 overflow-hidden cursor-pointer transition-all" style={{ width: 200 }}>
                {/* Thumbnail */}
                <div className="relative" style={{ height: 200 }}>
                  {ad.video ? (
                    <video src={ad.video} className="w-full h-full object-cover" muted />
                  ) : ad.src ? (
                    <img src={ad.src} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>sem preview</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {ad.top && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "#22c55e", color: "#000" }}>TOP</span>
                    )}
                    <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.8)" }}>{ad.tipo}</span>
                    {ad.custo === "alto" && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(239,68,68,0.8)", color: "#fff" }}>Custo Alto</span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs font-semibold text-white mb-2">{ad.nome}</p>
                  <div className="grid grid-cols-3 gap-1.5 text-center mb-2">
                    {[
                      { l: "Alcance", v: ad.alcance?.toLocaleString("pt-BR") ?? "—" },
                      { l: "Impressões", v: ad.impressoes.toLocaleString("pt-BR") },
                      { l: "Resultado", v: String(ad.resultado) },
                    ].map((m) => (
                      <div key={m.l} className="rounded-lg p-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }} className="uppercase">{m.l}</p>
                        <p className="text-xs font-semibold text-white">{m.v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    {[
                      { l: "Custo/Res.", v: `R$${ad.custoRes.toFixed(2)}`, color: ad.custoRes > 0.35 ? "#ef4444" : "#22c55e" },
                      { l: "Cliques", v: String(ad.cliques), color: "rgba(255,255,255,0.7)" },
                      { l: "Gasto", v: `R$${ad.gasto.toFixed(2)}`, color: "rgba(255,255,255,0.7)" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-lg p-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }} className="uppercase">{m.l}</p>
                        <p className="text-xs font-semibold" style={{ color: m.color }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
