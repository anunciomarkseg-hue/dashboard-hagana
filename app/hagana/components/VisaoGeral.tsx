"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function brl(n: number) {
  return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Gauge({ value, max, color, label, display }: any) {
  const pct = Math.min(value / max, 1);
  const r = 52;
  const stroke = 10;
  const circ = Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg width={130} height={80} viewBox="0 0 130 80">
        <path d="M 15 75 A 52 52 0 0 1 115 75" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} strokeLinecap="round" />
        <path
          d="M 15 75 A 52 52 0 0 1 115 75"
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <p className="text-2xl font-bold -mt-6" style={{ color }}>{display}</p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{label}</p>
    </div>
  );
}

export default function VisaoGeral({ metaData, googleData, loading }: { metaData: any; googleData: any; loading: boolean }) {
  const insights = metaData?.insights || [];
  const meta = insights.reduce(
    (acc: any, d: any) => {
      acc.spend += Number(d.spend || 0);
      acc.reach = Math.max(acc.reach, Number(d.reach || 0));
      acc.impressions += Number(d.impressions || 0);
      const leads = d.actions?.find((a: any) => a.action_type === "lead");
      const lp = d.actions?.find((a: any) => a.action_type === "landing_page_view");
      acc.leads += Number(leads?.value || 0);
      acc.landingPage += Number(lp?.value || 0);
      return acc;
    },
    { spend: 0, reach: 0, impressions: 0, leads: 0, landingPage: 0 }
  );

  const gm = googleData?.metrics;
  const google = {
    spend: gm?.spend ?? 0,
    impressions: gm?.impressions ?? 0,
    clicks: gm?.clicks ?? 0,
    ctr: gm?.ctr ?? 0,
    leads: gm?.conversoes ?? 0,
    landingPage: gm?.clicks ?? 0,
    cpc: gm?.cpc ?? 0,
    conv: gm?.conversoes ?? 0,
    custoConv: gm?.custoConv ?? 0,
  };

  const totalSpend = meta.spend + google.spend;
  const totalLeads = meta.leads + google.leads;
  const cplMedio = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const totalImpressions = meta.impressions + google.impressions;

  const pieData = [
    { name: "Meta Ads", value: meta.spend, color: "#3A7BFF" },
    { name: "Google Ads", value: google.spend, color: "#f5c518" },
  ];

  return (
    <div>
      {/* 8 KPI cards */}
      <div className="grid grid-cols-8 gap-3 mb-5">
        {[
          { label: "Investimento Total", value: loading ? "—" : brl(totalSpend), sub: "Google + Meta", color: "#f5c518" },
          { label: "Alcance Meta", value: loading ? "—" : meta.reach.toLocaleString("pt-BR"), sub: "pessoas únicas", color: "#22c55e" },
          { label: "Impressões Totais", value: loading ? "—" : totalImpressions.toLocaleString("pt-BR"), sub: "Meta + Google", color: "#ffffff" },
          { label: "Entr. Página Meta", value: loading ? "—" : meta.landingPage.toLocaleString("pt-BR"), sub: "visualizações", color: "#f5c518" },
          { label: "Cliques Google", value: loading ? "—" : String(google.clicks), sub: loading ? "" : `CTR ${google.ctr.toFixed(2)}%`, color: "#22c55e" },
          { label: "Conversões Google", value: loading ? "—" : String(google.conv), sub: "via Google", color: "#22c55e" },
          { label: "Leads Meta", value: loading ? "—" : String(meta.leads), sub: "via Meta", color: "#22c55e" },
          { label: "CPL Médio", value: loading ? "—" : brl(cplMedio), sub: `R$${totalSpend.toFixed(0)} ÷ ${totalLeads} leads`, color: "#3A7BFF" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4">
            <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-2">{k.label}</p>
            <p className="text-xl font-bold leading-tight" style={{ color: k.color }}>{k.value}</p>
            {k.sub && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* Meta + Google panels */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(58,123,255,0.2)" }}>
                <span style={{ fontSize: 14 }}>📱</span>
              </div>
              <p className="font-semibold text-white">Meta Ads</p>
            </div>
            <p className="font-bold" style={{ color: "#f5c518" }}>{loading ? "—" : brl(meta.spend)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Alcance", v: loading ? "—" : meta.reach.toLocaleString("pt-BR"), s: "pessoas únicas", c: "#22c55e" },
              { l: "Impressões", v: loading ? "—" : meta.impressions.toLocaleString("pt-BR"), s: "", c: "#ffffff" },
              { l: "Leads CRM", v: loading ? "—" : String(meta.leads), s: "via Meta Ads", c: "#22c55e" },
              { l: "Entr. Página", v: loading ? "—" : meta.landingPage.toLocaleString("pt-BR"), s: "visualizações", c: "#f5c518" },
              { l: "Campanhas", v: String(metaData?.campanhas?.filter((c: any) => c.status === "ACTIVE").length || 4), s: "ativas", c: "#ffffff" },
              { l: "Novidade", v: "Geo", s: "geofencing ativo", c: "#a78bfa" },
            ].map((k) => (
              <div key={k.l}>
                <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }} className="uppercase mb-1">{k.l}</p>
                <p className="text-xl font-bold" style={{ color: k.c }}>{k.v}</p>
                {k.s && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{k.s}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,197,24,0.2)" }}>
                <span style={{ fontSize: 14 }}>🔎</span>
              </div>
              <p className="font-semibold text-white">Google Ads</p>
            </div>
            <p className="font-bold" style={{ color: "#f5c518" }}>{loading ? "—" : brl(google.spend)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Impressões", v: loading ? "—" : google.impressions.toLocaleString("pt-BR"), s: "pesquisa", c: "#ffffff" },
              { l: "Cliques", v: loading ? "—" : String(google.clicks), s: loading ? "" : `CTR ${google.ctr.toFixed(2)}%`, c: "#22c55e" },
              { l: "CPC Médio", v: loading ? "—" : brl(google.cpc), s: "", c: "#ffffff" },
              { l: "Conversões", v: loading ? "—" : String(google.conv), s: "via Google", c: "#22c55e" },
              { l: "Custo/Conv.", v: loading ? "—" : brl(google.custoConv), s: "", c: "#f5c518" },
              { l: "Custo Total", v: loading ? "—" : brl(google.spend), s: "no período", c: "#f5c518" },
            ].map((k) => (
              <div key={k.l}>
                <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }} className="uppercase mb-1">{k.l}</p>
                <p className="text-xl font-bold" style={{ color: k.c }}>{k.v}</p>
                {k.s && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{k.s}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donut + Gauges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <p className="text-sm font-semibold text-white">Distribuição de Investimento</p>
            <span className="ml-auto font-bold" style={{ color: "#f5c518" }}>{brl(totalSpend)} total</span>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} innerRadius={48} outerRadius={72} dataKey="value" stroke="none">
                  {pieData.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => brl(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {pieData.map((p) => {
                const pct = (p.value / totalSpend * 100).toFixed(1);
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-sm text-white">{p.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{brl(p.value)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.color }} />
                    </div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{pct}% do total</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-sm font-semibold text-white">Indicadores de Performance</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <Gauge value={5.69} max={20} color="#22c55e" label="CTR Google" display="5,69%" />
            </div>
            <div className="rounded-xl p-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <Gauge value={81.6} max={100} color="#22c55e" label="Performance Site" display="81,6" />
            </div>
            <div className="rounded-xl p-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <Gauge value={41} max={100} color="#f5c518" label="Rolagem ↑ melhorou" display="41%" />
            </div>
            <div className="rounded-xl p-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <Gauge value={cplMedio} max={400} color="#3A7BFF" label="CPL Médio" display={loading ? "—" : brl(cplMedio)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
