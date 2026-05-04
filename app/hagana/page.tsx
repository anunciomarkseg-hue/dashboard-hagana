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
    <div className="glass px-3 py-2 rounded-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-[#3A7BFF] font-semibold">{payload[0].value} leads</p>
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

        const totalLeads = formatado.reduce((acc: number, i: any) => acc + i.leads, 0);
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

      const { data: campanhasData } = await supabase.from("campanhas").select("*");
      setCampanhas(campanhasData || []);
      setLoading(false);
    }

    fetchData();
  }, [periodo, dataInicio, dataFim]);

  return (
    <div className="min-h-screen bg-[#070d1a] text-white" style={{ fontFamily: "var(--font-montserrat), Inter, sans-serif" }}>

      {/* TOP BAR */}
      <header
        className="sticky top-0 z-50 border-b border-white/5"
        style={{ background: "rgba(7, 13, 26, 0.85)", backdropFilter: "blur(20px)" }}
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-[#3A7BFF] text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={tab === t.key ? { boxShadow: "0 0 20px rgba(58,123,255,0.35)" } : {}}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                onClick={() => { setPeriodo(p.value); setDataInicio(""); setDataFim(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  periodo === p.value
                    ? "bg-[#3A7BFF]/20 text-[#3A7BFF] border border-[#3A7BFF]/40"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-white/10">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => { setDataInicio(e.target.value); setPeriodo(""); }}
                className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-xs text-white"
                style={{ colorScheme: "dark" }}
              />
              <span className="text-gray-600 text-xs">—</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => { setDataFim(e.target.value); setPeriodo(""); }}
                className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-xs text-white"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

        </div>
      </header>

      {/* CONTENT */}
      <main className="p-6 max-w-[1600px] mx-auto">

        {tab === "meta" && (
          <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-4 gap-4 mb-5">

              <div className="glass rounded-2xl p-5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Leads</p>
                <p className="text-3xl font-bold text-[#00A651]">
                  {loading ? "—" : (metrics?.leads ?? "—")}
                </p>
                <p className="text-xs text-gray-600 mt-2">captados no período</p>
              </div>

              <div className="glass rounded-2xl p-5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Investimento</p>
                <p className="text-3xl font-bold text-[#3A7BFF]">
                  {loading ? "—" : `R$ ${metrics?.investimento?.toFixed(2) ?? "—"}`}
                </p>
                <p className="text-xs text-gray-600 mt-2">gasto total</p>
              </div>

              <div className="glass rounded-2xl p-5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">CPL</p>
                <p className="text-3xl font-bold text-white">
                  {loading
                    ? "—"
                    : `R$ ${metrics?.cpl?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "—"}`}
                </p>
                <p className="text-xs text-gray-600 mt-2">custo por lead</p>
              </div>

              <div className="glass rounded-2xl p-5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Conversões</p>
                <p className="text-3xl font-bold text-purple-400">
                  {loading ? "—" : (metrics?.conversoes ?? "—")}
                </p>
                <p className="text-xs text-gray-600 mt-2">total no período</p>
              </div>

            </div>

            {/* CHART + CAMPAIGNS */}
            <div className="grid grid-cols-5 gap-4 mb-5">

              {/* AREA CHART */}
              <div className="col-span-3 glass rounded-2xl p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-white text-sm">Leads por dia</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Volume de captação</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#3A7BFF]">
                      {loading ? "—" : (metrics?.leads ?? "—")}
                    </p>
                    <p className="text-xs text-gray-500">total</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3A7BFF" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3A7BFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis
                      dataKey="dia"
                      tick={{ fill: "#4a5878", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#4a5878", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(58,123,255,0.2)", strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#3A7BFF"
                      strokeWidth={2}
                      fill="url(#leadsGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#3A7BFF", stroke: "#070d1a", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* CAMPAIGNS TABLE */}
              <div className="col-span-2 glass rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-4">Campanhas</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-600 border-b border-white/5 text-[10px] uppercase tracking-wider">
                      <th className="text-left pb-3 font-medium">Campanha</th>
                      <th className="pb-3 font-medium text-right">Leads</th>
                      <th className="pb-3 font-medium text-right">CPL</th>
                      <th className="pb-3 font-medium text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...campanhas]
                      .sort((a, b) => b.leads - a.leads)
                      .map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 text-gray-300 max-w-[120px] truncate pr-2">{c.nome}</td>
                          <td className="py-3 text-right font-semibold text-[#00A651]">{c.leads}</td>
                          <td className="py-3 text-right text-gray-400">
                            {c.leads > 0 ? `R$${(c.investimento / c.leads).toFixed(0)}` : "—"}
                          </td>
                          <td className="py-3 text-right text-[#3A7BFF]">{c.ctr}%</td>
                        </tr>
                      ))}
                    {campanhas.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-gray-600">
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
              <h3 className="font-semibold text-white text-sm mb-4">Criativos em destaque</h3>
              <div className="flex gap-4 overflow-x-auto pb-1">

                {[
                  { src: "/ART MANUAL 01.png", ctr: "2.3", type: "img" },
                  { src: "/ART SIND 03.png", ctr: "1.8", type: "img" },
                  { src: "/VID SIND 03 (1).mp4", ctr: "3.1", type: "video" },
                ].map((item) => (
                  <div
                    key={item.src}
                    onClick={() => setSelectedMedia(item.src)}
                    className="glass-hover flex-shrink-0 w-[155px] rounded-xl overflow-hidden cursor-pointer transition-all border border-white/5"
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        className="w-full aspect-[4/5] object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={item.src}
                        className="w-full aspect-[4/5] object-cover"
                      />
                    )}
                    <div className="px-3 py-2.5 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">CTR</p>
                      <p className="text-sm font-semibold text-[#3A7BFF]">{item.ctr}%</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </>
        )}

        {tab === "google" && (
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-sm text-gray-500">Google Ads — em breve</p>
          </div>
        )}

        {tab === "crm" && (
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-sm text-gray-500">CRM — em breve</p>
          </div>
        )}

      </main>

      {/* MEDIA MODAL */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="max-w-md w-full glass rounded-2xl overflow-hidden"
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
