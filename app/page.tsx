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

  const [periodo, setPeriodo] = useState("7");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    async function fetchData() {

      // 🔥 SIMULAÇÃO (AGORA FUNCIONA)
      let dados = {
        leads: 187,
        investimento: 6420,
        cpl: 34,
        conversoes: 29,
      };

      if (periodo === "1") {
        dados = { leads: 20, investimento: 800, cpl: 40, conversoes: 5 };
      }

      if (periodo === "14") {
        dados = { leads: 260, investimento: 9000, cpl: 34, conversoes: 40 };
      }

      if (periodo === "30") {
        dados = { leads: 520, investimento: 18000, cpl: 34, conversoes: 80 };
      }

      if (periodo === "60") {
        dados = { leads: 900, investimento: 30000, cpl: 33, conversoes: 140 };
      }

      setMetrics(dados);

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
                <h2 className="text-2xl font-bold text-yellow-400">R$ {metrics?.investimento}</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">CPL</p>
                <h2 className="text-2xl font-bold text-blue-400">R$ {metrics?.cpl}</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">Conversões</p>
                <h2 className="text-2xl font-bold text-purple-400">{metrics?.conversoes}</h2>
              </div>

            </div>

            {/* GRÁFICO */}
            <div className="bg-[#0f1c34] p-6 rounded-xl mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid stroke="#1f2a44" />
                  <XAxis dataKey="dia" stroke="#6b7fa8" />
                  <YAxis stroke="#6b7fa8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#f5c518" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </>
        )}

      </main>
    </div>
  );
}