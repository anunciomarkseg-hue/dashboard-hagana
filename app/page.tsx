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
  useEffect(() => {
  async function fetchData() {
    const { data, error } = await supabase
      .from("dashboard")
      .select("*")
      .single();

    if (error) {
      console.error(error);
    } else {
      setMetrics(data);
    }
  }

  fetchData();
}, []);

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
          <button
            onClick={() => setTab("meta")}
            className={`px-4 py-2 rounded ${
              tab === "meta" ? "bg-yellow-500 text-black" : "bg-white/10"
            }`}
          >
            Meta Ads
          </button>

          <button
            onClick={() => setTab("google")}
            className={`px-4 py-2 rounded ${
              tab === "google" ? "bg-yellow-500 text-black" : "bg-white/10"
            }`}
          >
            Google Ads
          </button>

          <button
            onClick={() => setTab("crm")}
            className={`px-4 py-2 rounded ${
              tab === "crm" ? "bg-yellow-500 text-black" : "bg-white/10"
            }`}
          >
            CRM
          </button>
        </div>

        {/* META ADS */}
        {tab === "meta" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-6">

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">Leads</p>
                <h2 className="text-2xl font-bold text-green-400">
  {metrics?.leads}
</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">Investimento</p>
                <h2 className="text-2xl font-bold text-yellow-400">
  R$ {metrics?.investimento}
</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">CPL</p>
                <h2 className="text-2xl font-bold text-blue-400">
  R$ {metrics?.cpl}
</h2>
              </div>

              <div className="bg-[#0f1c34] p-5 rounded-xl">
                <p className="text-gray-400 text-xs">Conversões</p>
                <h2 className="text-2xl font-bold text-purple-400">
  {metrics?.conversoes}
</h2>
              </div>

            </div>

            {/* GRÁFICO */}
            <div className="grid grid-cols-2 gap-4 mb-6">

              <div className="bg-[#0f1c34] p-6 rounded-xl">
                <h3 className="text-sm mb-4 text-gray-300">Meta Ads</h3>

                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data}>
                    <CartesianGrid stroke="#1f2a44" />
                    <XAxis dataKey="dia" stroke="#6b7fa8" />
                    <YAxis stroke="#6b7fa8" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="#f5c518"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>

              </div>

              <div className="bg-[#0f1c34] p-6 rounded-xl">
                <h3 className="text-sm mb-4 text-gray-300">Google Ads</h3>
                <div className="h-40 flex items-center justify-center text-gray-500">
                  (dados Google)
                </div>
              </div>

            </div>

            {/* CRIATIVOS - CARROSSEL */}
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

        {/* GOOGLE */}
        {tab === "google" && (
          <div className="bg-[#0f1c34] p-6 rounded-xl">
            Dados Google Ads
          </div>
        )}

        {/* CRM */}
        {tab === "crm" && (
          <div className="grid grid-cols-4 gap-4">

            <div className="bg-green-500/10 p-6 rounded-xl text-center">
              <p className="text-green-400 text-sm">Leads</p>
              <h2 className="text-3xl font-bold text-green-400">120</h2>
            </div>

            <div className="bg-blue-500/10 p-6 rounded-xl text-center">
              <p className="text-blue-400 text-sm">Propostas</p>
              <h2 className="text-3xl font-bold text-blue-400">80</h2>
            </div>

            <div className="bg-yellow-500/10 p-6 rounded-xl text-center">
              <p className="text-yellow-400 text-sm">Contratos</p>
              <h2 className="text-3xl font-bold text-yellow-400">45</h2>
            </div>

            <div className="bg-red-500/10 p-6 rounded-xl text-center">
              <p className="text-red-400 text-sm">Perdidos</p>
              <h2 className="text-3xl font-bold text-red-400">30</h2>
            </div>

          </div>
        )}

        {/* MODAL */}
        {selectedMedia && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setSelectedMedia(null)}
          >
            <div className="max-w-lg w-full p-4">

              {selectedMedia.endsWith(".mp4") ? (
                <video
                  src={selectedMedia}
                  controls
                  autoPlay
                  className="w-full rounded-lg"
                />
              ) : (
                <img
                  src={selectedMedia}
                  className="w-full rounded-lg"
                />
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}