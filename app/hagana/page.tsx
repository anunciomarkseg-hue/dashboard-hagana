"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { dia: "Seg", leads: 20 },
  { dia: "Ter", leads: 40 },
  { dia: "Qua", leads: 25 },
  { dia: "Qui", leads: 60 },
  { dia: "Sex", leads: 45 },
];

export default function Home() {
  const [tab, setTab] = useState("meta");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const [periodo, setPeriodo] = useState("7");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    async function fetchData() {
      let since = "";
let until = "";

const hoje = new Date();

if (periodo) {
  const dias = Number(periodo);

  const inicio = new Date();
  inicio.setDate(hoje.getDate() - dias);

  since = inicio.toISOString().split("T")[0];
  until = hoje.toISOString().split("T")[0];
}

     const res = await fetch(
  `https://graph.facebook.com/v19.0/act_1181570894013658/insights?fields=spend,actions,date_start&time_increment=1&time_range={"since":"${since}","until":"${until}"}&access_token=SEU_TOKEN`
);

const json = await res.json();

const lista = json.data || [];

// 🔥 pega leads
// 🔥 joga pro dashboard
// 🔥 gráfico
const formatado = lista.map((item: any) => {
  const leads =
    item.actions?.find((a: any) => a.action_type === "lead")?.value || 0;

  return {
    dia: item.date_start.slice(5),
    leads: Number(leads),
  };
});

setChartData(formatado);

// 🔥 totais
const totalLeads = formatado.reduce((acc: number, i: any) => acc + i.leads, 0);
const totalInvest = lista.reduce((acc: number, i: any) => acc + Number(i.spend), 0);

setMetrics({
  leads: totalLeads,
  investimento: totalInvest,
  cpl: totalLeads > 0 ? totalInvest / totalLeads : 0,
  conversoes: totalLeads,
});

      // campanhas continuam do banco
      const { data: campanhasData } = await supabase
        .from("campanhas")
        .select("*");

      setCampanhas(campanhasData || []);
    }

    fetchData();
  }, [periodo]);

  return (
    <div className="flex bg-[#080f1e] text-white min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0c1628] border-r border-white/5 p-5">
        <img src="/haganaa-logo.png" className="w-36 mb-8 object-contain" />

        <nav className="flex flex-col gap-3 text-sm">
          <div className="text-yellow-400">📊 Visão Geral</div>
          <div className="text-gray-400">📣 Meta Ads</div>
          <div className="text-gray-400">🔎 Google Ads</div>
          <div className="text-gray-400">📈 CRM</div>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">

        {/* ABAS */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("meta")} className={`px-4 py-2 rounded ${tab === "meta" ? "bg-yellow-500 text-black" : "bg-white/10"}`}>
            Meta Ads
          </button>
          <button onClick={() => setTab("google")} className={`px-4 py-2 rounded ${tab === "google" ? "bg-yellow-500 text-black" : "bg-white/10"}`}>
            Google Ads
          </button>
          <button onClick={() => setTab("crm")} className={`px-4 py-2 rounded ${tab === "crm" ? "bg-yellow-500 text-black" : "bg-white/10"}`}>
            CRM
          </button>
        </div>

        {/* 🔥 PERÍODO + CALENDÁRIO */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {["1", "7", "14", "30", "60"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriodo(p);
                setDataInicio("");
                setDataFim("");
              }}
              className={`px-3 py-1 rounded ${
                periodo === p ? "bg-yellow-500 text-black" : "bg-white/10"
              }`}
            >
              {p === "1" ? "Hoje" : `${p} dias`}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-4">
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => {
                setDataInicio(e.target.value);
                setPeriodo("");
              }}
              className="bg-[#0f1c34] px-2 py-1 rounded text-white"
            />

            <span className="text-gray-400">até</span>

            <input
              type="date"
              value={dataFim}
              onChange={(e) => {
                setDataFim(e.target.value);
                setPeriodo("");
              }}
              className="bg-[#0f1c34] px-2 py-1 rounded text-white"
            />
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Período selecionado: {periodo || "personalizado"}
        </p>

        {/* META */}
        {tab === "meta" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-6">

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">Leads</p>
                <h2 className="text-2xl font-bold text-green-400">{metrics?.leads}</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">Investimento</p>
                <h2 className="text-2xl font-bold text-yellow-400">R$ {metrics?.investimento?.toFixed(2)}</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">CPL</p>
                <h2 className="text-2xl font-bold text-blue-400">R$ {metrics?.cpl?.toLocaleString("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">Conversões</p>
                <h2 className="text-2xl font-bold text-purple-400">{metrics?.conversoes}</h2>
              </div>

            </div>

            {/* GRÁFICO */}
      


            <div className="bg-[#0f1c34] p-6 rounded-xl mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1f2a44" />
                  <XAxis dataKey="dia" stroke="#6b7fa8" />
                  <YAxis stroke="#6b7fa8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#f5c518" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* CRIATIVOS */}

            {/* TABELA DE CAMPANHAS */}
<div className="mt-8">
  <h3 className="text-sm mb-4 text-gray-300">
    Campanhas
  </h3>

  <div className="bg-[#0f1c34] rounded-xl overflow-hidden">

    <table className="w-full text-sm">
      <thead className="text-gray-400 border-b border-white/10">
        <tr>
          <th className="text-left p-3">Campanha</th>
          <th className="p-3">Leads</th>
          <th className="p-3">Investimento</th>
          <th className="p-3">CPL</th>
          <th className="p-3">CTR</th>
        </tr>
      </thead>

      <tbody>
  {[...campanhas]
    .sort((a, b) => b.leads - a.leads)
    .map((c) => (
      <tr
        key={c.id}
        className="border-b border-white/5 hover:bg-white/5"
      >
        <td className="p-3">{c.nome}</td>
        <td className="text-center">{c.leads}</td>
        <td className="text-center">R$ {c.investimento}</td>
        <td className="text-center">
          {c.leads > 0
            ? `R$ ${(c.investimento / c.leads).toFixed(2)}`
            : "—"}
        </td>
        <td className="text-center">{c.ctr}%</td>
      </tr>
    ))}
</tbody>

    </table>

  </div>
</div>

<div className="mt-6">
  <h3 className="text-sm mb-4 text-gray-300">
    Criativos em destaque
  </h3>

  <div className="flex gap-4 overflow-x-auto pb-2">

    {/* IMAGEM 1 */}
    <div className="bg-[#0f1c34] p-3 rounded-xl w-[180px] flex-shrink-0">
      <img
        src="/ART MANUAL 01.png"
        onClick={() => setSelectedMedia("/ART MANUAL 01.png")}
        className="rounded-lg mb-2 w-full aspect-[4/5] object-cover cursor-pointer"
      />
      <p className="text-xs text-gray-400">CTR: 2.3%</p>
    </div>

    {/* IMAGEM 2 */}
    <div className="bg-[#0f1c34] p-3 rounded-xl w-[180px] flex-shrink-0">
      <img
        src="/ART SIND 03.png"
        onClick={() => setSelectedMedia("/ART SIND 03.png")}
        className="rounded-lg mb-2 w-full aspect-[4/5] object-cover cursor-pointer"
      />
      <p className="text-xs text-gray-400">CTR: 1.8%</p>
    </div>

    {/* VÍDEO */}
    <div className="bg-[#0f1c34] p-3 rounded-xl w-[180px] flex-shrink-0">
      <video
        src="/VID SIND 03 (1).mp4"
        onClick={() => setSelectedMedia("/VID SIND 03 (1).mp4")}
        className="rounded-lg mb-2 w-full aspect-[4/5] object-cover cursor-pointer"
      />
      <p className="text-xs text-gray-400">CTR: 3.1%</p>
    </div>

  </div>
</div>

          </>
        )}

      </main>
    </div>
  );
}