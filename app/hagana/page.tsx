"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass rounded-xl px-3 py-2 text-xs"
      style={{ minWidth: 100 }}
    >
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="font-semibold" style={{ color: "#3A7BFF" }}>
        {payload[0].value} leads
      </p>
    </div>
  );
}

const PERIODOS = [
  { label: "Hoje", value: "1" },
  { label: "7D", value: "7" },
  { label: "14D", value: "14" },
  { label: "30D", value: "30" },
  { label: "60D", value: "60" },
];

export default function Home() {
  const [tab, setTab] = useState("meta");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("7");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    if (!periodo && (!dataInicio || !dataFim)) return;

    async function fetchData() {
      setLoading(true);
      const hoje = new Date();
      let since = "";
      let until = "";

      if (periodo) {
        const inicio = new Date();
        inicio.setDate(hoje.getDate() - Number(periodo));
        since = inicio.toISOString().split("T")[0];
        until = hoje.toISOString().split("T")[0];
      } else {
        since = dataInicio;
        until = dataFim;
      }

      try {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/act_1181570894013658/insights?fields=spend,actions,date_start&time_increment=1&time_range={"since":"${since}","until":"${until}"}&access_token=SEU_TOKEN`
        );
        const json = await res.json();
        const lista = json.data || [];

        const formatado = lista.map((item: any) => {
          const leads =
            item.actions?.find((a: any) => a.action_type === "lead")?.value || 0;
          return { dia: item.date_start.slice(5), leads: Number(leads) };
        });

        setChartData(formatado);

        const totalLeads = formatado.reduce(
          (acc: number, i: any) => acc + i.leads,
          0
        );
        const totalInvest = lista.reduce(
          (acc: number, i: any) => acc + Number(i.spend),
          0
        );

        setMetrics({
          leads: totalLeads,
          investimento: totalInvest,
          cpl: totalLeads > 0 ? totalInvest / totalLeads : 0,
          conversoes: totalLeads,
        });
      } catch (e) {
        console.error("Meta API error:", e);
      }

      const { data: campanhasData } = await supabase
        .from("campanhas")
        .select("*");
      setCampanhas(campanhasData || []);
      setLoading(false);
    }

    fetchData();
  }, [periodo, dataInicio, dataFim]);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#060d1e", fontFamily: "var(--font-montserrat), Inter, sans-serif" }}
    >

      {/* ═══════════════════════════════════════
          PONTOS DE LUZ — background atmosphere
      ═══════════════════════════════════════ */}
      <div className="fixed inset-0 overflow-hidden" style={{ pointerEvents: "none", zIndex: 0 }}>

        {/* Orbs grandes */}
        <div className="orb" style={{
          top: "-18%", left: "3%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(58,123,255,0.13) 0%, transparent 65%)",
        }} />
        <div className="orb" style={{
          top: "35%", right: "-8%",
          width: 580, height: 580,
          background: "radial-gradient(circle, rgba(0,85,204,0.10) 0%, transparent 65%)",
        }} />
        <div className="orb" style={{
          bottom: "-12%", left: "38%",
          width: 700, height: 500,
          background: "radial-gradient(circle, rgba(58,123,255,0.08) 0%, transparent 65%)",
        }} />

        {/* Pontos de luz — pequenos */}
        <span style={{
          position: "absolute", top: "14%", left: "22%",
          width: 4, height: 4, borderRadius: "50%",
          background: "rgba(58,123,255,0.55)",
          boxShadow: "0 0 10px 4px rgba(58,123,255,0.35)",
        }} />
        <span style={{
          position: "absolute", top: "38%", left: "62%",
          width: 3, height: 3, borderRadius: "50%",
          background: "rgba(58,123,255,0.45)",
          boxShadow: "0 0 8px 3px rgba(58,123,255,0.3)",
        }} />
        <span style={{
          position: "absolute", top: "68%", left: "82%",
          width: 5, height: 5, borderRadius: "50%",
          background: "rgba(80,140,255,0.35)",
          boxShadow: "0 0 14px 5px rgba(58,123,255,0.28)",
        }} />
        <span style={{
          position: "absolute", top: "52%", left: "12%",
          width: 3, height: 3, borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          boxShadow: "0 0 8px 3px rgba(255,255,255,0.15)",
        }} />
        <span style={{
          position: "absolute", top: "22%", right: "18%",
          width: 4, height: 4, borderRadius: "50%",
          background: "rgba(58,123,255,0.4)",
          boxShadow: "0 0 12px 5px rgba(58,123,255,0.25)",
        }} />
        <span style={{
          position: "absolute", top: "80%", left: "45%",
          width: 3, height: 3, borderRadius: "50%",
          background: "rgba(0,166,81,0.45)",
          boxShadow: "0 0 10px 4px rgba(0,166,81,0.25)",
        }} />
      </div>

      {/* ═══════════════════════════════════════
          TOP BAR
      ═══════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(6,13,30,0.80)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid rgba(58,123,255,0.12)",
          boxShadow: "0 1px 0 rgba(58,123,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between px-6 h-14">

          <img src="/haganaa-logo.png" className="h-7 object-contain" />

          <nav className="flex items-center gap-1">
            {[
              { key: "meta", label: "Meta Ads" },
              { key: "google", label: "Google Ads" },
              { key: "crm", label: "CRM" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  tab === t.key
                    ? {
                        background: "rgba(58,123,255,0.18)",
                        color: "#3A7BFF",
                        border: "1px solid rgba(58,123,255,0.38)",
                        boxShadow: "0 0 16px rgba(58,123,255,0.2)",
                      }
                    : {
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid transparent",
                      }
                }
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setPeriodo(p.value);
                  setDataInicio("");
                  setDataFim("");
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={
                  periodo === p.value
                    ? {
                        background: "rgba(58,123,255,0.15)",
                        color: "#3A7BFF",
                        border: "1px solid rgba(58,123,255,0.35)",
                      }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {p.label}
              </button>
            ))}
            <div
              className="flex items-center gap-1.5 ml-2 pl-3"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
            >
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => { setDataInicio(e.target.value); setPeriodo(""); }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  colorScheme: "dark",
                }}
                className="px-2 py-1 rounded-lg text-xs text-white"
              />
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => { setDataFim(e.target.value); setPeriodo(""); }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  colorScheme: "dark",
                }}
                className="px-2 py-1 rounded-lg text-xs text-white"
              />
            </div>
          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <main
        className="p-6 max-w-[1600px] mx-auto"
        style={{ position: "relative", zIndex: 1 }}
      >
        {tab === "meta" && (
          <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-4 gap-4 mb-5">

              <div className="glass rounded-2xl p-5">
                <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-3">
                  Leads
                </p>
                <p className="text-3xl font-bold" style={{ color: "#00A651" }}>
                  {loading ? "—" : (metrics?.leads ?? "—")}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
                  captados no período
                </p>
              </div>

              <div className="glass rounded-2xl p-5">
                <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-3">
                  Investimento
                </p>
                <p className="text-3xl font-bold" style={{ color: "#3A7BFF" }}>
                  {loading ? "—" : `R$ ${metrics?.investimento?.toFixed(2) ?? "—"}`}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
                  gasto total
                </p>
              </div>

              <div className="glass rounded-2xl p-5">
                <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-3">
                  CPL
                </p>
                <p className="text-3xl font-bold text-white">
                  {loading
                    ? "—"
                    : `R$ ${metrics?.cpl?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "—"}`}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
                  custo por lead
                </p>
              </div>

              <div className="glass rounded-2xl p-5">
                <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-3">
                  Conversões
                </p>
                <p className="text-3xl font-bold" style={{ color: "#a78bfa" }}>
                  {loading ? "—" : (metrics?.conversoes ?? "—")}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
                  total no período
                </p>
              </div>

            </div>

            {/* CHART + CAMPAIGNS */}
            <div className="grid grid-cols-5 gap-4 mb-5">

              {/* AREA CHART */}
              <div className="col-span-3 glass rounded-2xl p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="font-semibold text-sm text-white">Leads por dia</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                      Volume de captação
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: "#3A7BFF" }}>
                      {loading ? "—" : (metrics?.leads ?? "—")}
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>total</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                    <defs>
                      <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3A7BFF" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3A7BFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis
                      dataKey="dia"
                      tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ stroke: "rgba(58,123,255,0.18)", strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#3A7BFF"
                      strokeWidth={2}
                      fill="url(#leadsGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#3A7BFF", stroke: "#060d1e", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* CAMPAIGNS TABLE */}
              <div className="col-span-2 glass rounded-2xl p-5">
                <p className="font-semibold text-sm text-white mb-4">Campanhas</p>
                <table className="w-full" style={{ fontSize: 12 }}>
                  <thead>
                    <tr
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: 10,
                        letterSpacing: "0.1em",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <th className="text-left pb-3 font-medium uppercase">Campanha</th>
                      <th className="pb-3 font-medium text-right uppercase">Leads</th>
                      <th className="pb-3 font-medium text-right uppercase">CPL</th>
                      <th className="pb-3 font-medium text-right uppercase">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...campanhas]
                      .sort((a, b) => b.leads - a.leads)
                      .map((c) => (
                        <tr
                          key={c.id}
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          className="transition-colors hover:bg-white/5"
                        >
                          <td
                            className="py-3 pr-2 truncate max-w-[110px]"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            {c.nome}
                          </td>
                          <td className="py-3 text-right font-semibold" style={{ color: "#00A651" }}>
                            {c.leads}
                          </td>
                          <td className="py-3 text-right" style={{ color: "rgba(255,255,255,0.5)" }}>
                            {c.leads > 0
                              ? `R$${(c.investimento / c.leads).toFixed(0)}`
                              : "—"}
                          </td>
                          <td className="py-3 text-right" style={{ color: "#3A7BFF" }}>
                            {c.ctr}%
                          </td>
                        </tr>
                      ))}
                    {campanhas.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-10 text-center"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                        >
                          Sem dados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* CREATIVES */}
            <div className="glass rounded-2xl p-5">
              <p className="font-semibold text-sm text-white mb-4">Criativos em destaque</p>
              <div className="flex gap-4 overflow-x-auto pb-1">
                {[
                  { src: "/ART MANUAL 01.png", ctr: "2.3", type: "img" },
                  { src: "/ART SIND 03.png", ctr: "1.8", type: "img" },
                  { src: "/VID SIND 03 (1).mp4", ctr: "3.1", type: "video" },
                ].map((item) => (
                  <div
                    key={item.src}
                    onClick={() => setSelectedMedia(item.src)}
                    className="glass glass-hover flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all"
                    style={{ width: 155 }}
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        className="w-full object-cover"
                        style={{ aspectRatio: "4/5" }}
                        muted
                      />
                    ) : (
                      <img
                        src={item.src}
                        className="w-full object-cover"
                        style={{ aspectRatio: "4/5" }}
                      />
                    )}
                    <div
                      className="px-3 py-2.5"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }} className="uppercase">
                        CTR
                      </p>
                      <p className="text-sm font-semibold" style={{ color: "#3A7BFF" }}>
                        {item.ctr}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "google" && (
          <div className="glass rounded-2xl p-16 text-center">
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
              Google Ads — em breve
            </p>
          </div>
        )}

        {tab === "crm" && (
          <div className="glass rounded-2xl p-16 text-center">
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
              CRM — em breve
            </p>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════
          MEDIA MODAL
      ═══════════════════════════════════════ */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="glass rounded-2xl overflow-hidden max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.endsWith(".mp4") ? (
              <video src={selectedMedia} controls autoPlay className="w-full" />
            ) : (
              <img src={selectedMedia} className="w-full" />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
