"use client";

import { useState, useEffect, useMemo } from "react";
import VisaoGeral from "./components/VisaoGeral";
import MetaAds from "./components/MetaAds";
import GoogleAds from "./components/GoogleAds";
import CRM from "./components/CRM";
import Criativos from "./components/Criativos";
import Clarity from "./components/Clarity";

const TABS = [
  { key: "geral", label: "Visão Geral" },
  { key: "crm", label: "CRM · Resultados" },
  { key: "meta", label: "Meta Ads" },
  { key: "google", label: "Google Ads" },
  { key: "criativos", label: "Criativos" },
  { key: "clarity", label: "Clarity" },
];

const PERIODOS = [
  { label: "Hoje", value: "1" },
  { label: "7D", value: "7" },
  { label: "14D", value: "14" },
  { label: "30D", value: "30" },
  { label: "60D", value: "60" },
];

function toYMD(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function Home() {
  const [tab, setTab] = useState("geral");
  const [periodo, setPeriodo] = useState("7");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [metaData, setMetaData] = useState<any>(null);
  const [googleData, setGoogleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Compute since/until once — used everywhere
  const { since, until } = useMemo(() => {
    if (periodo) {
      const hoje = new Date();
      const inicio = new Date();
      inicio.setDate(hoje.getDate() - Number(periodo));
      return { since: toYMD(inicio), until: toYMD(hoje) };
    }
    return { since: dataInicio, until: dataFim };
  }, [periodo, dataInicio, dataFim]);

  useEffect(() => {
    if (!since || !until) return;

    let cancelled = false;
    setLoading(true);

    Promise.all([
      fetch(`/api/meta?since=${since}&until=${until}`).then((r) => r.json()),
      fetch(`/api/google/ads?since=${since}&until=${until}`).then((r) => r.json()),
    ])
      .then(([metaJson, googleJson]) => {
        if (cancelled) return;
        setMetaData(metaJson);
        setGoogleData(googleJson);
      })
      .catch((e) => console.error("Erro APIs:", e))
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [since, until]);

  return (
    <div className="min-h-screen text-white" style={{ background: "#060d1e", fontFamily: "var(--font-montserrat), Inter, sans-serif" }}>

      {/* BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden" style={{ pointerEvents: "none", zIndex: 0 }}>
        <div className="orb" style={{ top: "-18%", left: "3%", width: 700, height: 700, background: "radial-gradient(circle, rgba(58,123,255,0.12) 0%, transparent 65%)" }} />
        <div className="orb" style={{ top: "35%", right: "-8%", width: 580, height: 580, background: "radial-gradient(circle, rgba(0,85,204,0.09) 0%, transparent 65%)" }} />
        <div className="orb" style={{ bottom: "-12%", left: "38%", width: 700, height: 500, background: "radial-gradient(circle, rgba(58,123,255,0.07) 0%, transparent 65%)" }} />
        <span style={{ position: "absolute", top: "14%", left: "22%", width: 4, height: 4, borderRadius: "50%", background: "rgba(58,123,255,0.55)", boxShadow: "0 0 10px 4px rgba(58,123,255,0.35)" }} />
        <span style={{ position: "absolute", top: "38%", left: "62%", width: 3, height: 3, borderRadius: "50%", background: "rgba(58,123,255,0.45)", boxShadow: "0 0 8px 3px rgba(58,123,255,0.3)" }} />
        <span style={{ position: "absolute", top: "68%", left: "82%", width: 5, height: 5, borderRadius: "50%", background: "rgba(80,140,255,0.35)", boxShadow: "0 0 14px 5px rgba(58,123,255,0.28)" }} />
        <span style={{ position: "absolute", top: "52%", left: "12%", width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)", boxShadow: "0 0 8px 3px rgba(255,255,255,0.15)" }} />
        <span style={{ position: "absolute", top: "22%", right: "18%", width: 4, height: 4, borderRadius: "50%", background: "rgba(58,123,255,0.4)", boxShadow: "0 0 12px 5px rgba(58,123,255,0.25)" }} />
        <span style={{ position: "absolute", top: "80%", left: "45%", width: 3, height: 3, borderRadius: "50%", background: "rgba(0,166,81,0.45)", boxShadow: "0 0 10px 4px rgba(0,166,81,0.25)" }} />
      </div>

      {/* TOP BAR */}
      <header className="sticky top-0 z-50" style={{ background: "rgba(6,13,30,0.82)", backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)", borderBottom: "1px solid rgba(58,123,255,0.12)" }}>
        <div className="flex items-center justify-between px-6 h-13 py-2">

          <img src="/haganaa-logo.png" className="h-7 object-contain" />

          <nav className="flex items-center gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative"
                style={tab === t.key
                  ? { color: "#ffffff", background: "rgba(58,123,255,0.15)", border: "1px solid rgba(58,123,255,0.35)" }
                  : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }
                }
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px w-6 h-0.5 rounded-full" style={{ background: "#3A7BFF" }} />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {PERIODOS.map((p) => (
              <button
                key={p.value}
                onClick={() => { setPeriodo(p.value); setDataInicio(""); setDataFim(""); }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={periodo === p.value
                  ? { background: "rgba(58,123,255,0.15)", color: "#3A7BFF", border: "1px solid rgba(58,123,255,0.35)" }
                  : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {p.label}
              </button>
            ))}
            <div className="flex items-center gap-1 ml-2 pl-2" style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => { setDataInicio(e.target.value); setPeriodo(""); }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                className="px-2 py-1 rounded-lg text-xs text-white"
              />
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => { setDataFim(e.target.value); setPeriodo(""); }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                className="px-2 py-1 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-6 max-w-[1600px] mx-auto" style={{ position: "relative", zIndex: 1 }}>
        {tab === "geral" && <VisaoGeral metaData={metaData} googleData={googleData} loading={loading} since={since} until={until} />}
        {tab === "meta" && <MetaAds data={metaData} loading={loading} />}
        {tab === "google" && <GoogleAds since={since} until={until} />}
        {tab === "crm" && <CRM since={since} until={until} />}
        {tab === "criativos" && <Criativos metaData={metaData} />}
        {tab === "clarity" && <Clarity since={since} until={until} />}
      </main>
    </div>
  );
}
