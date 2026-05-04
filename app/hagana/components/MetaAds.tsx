"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell,
} from "recharts";

function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}
function brl(n: number) {
  return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MetaAds({ data, loading }: { data: any; loading: boolean }) {
  const insights = data?.insights || [];
  const campanhas = data?.campanhas || [];

  const totals = insights.reduce(
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

  const campanhaRows = campanhas
    .map((c: any) => {
      const ins = c.insights?.data?.[0] || {};
      const leads = ins.actions?.find((a: any) => a.action_type === "lead");
      const reach = Number(ins.reach || 0);
      const impressions = Number(ins.impressions || 0);
      const spend = Number(ins.spend || 0);
      const leadsN = Number(leads?.value || 0);
      return {
        nome: c.name,
        status: c.status,
        leads: leadsN,
        reach,
        impressions,
        spend,
        cpl: leadsN > 0 ? spend / leadsN : 0,
      };
    })
    .filter((c: any) => c.status === "ACTIVE" || c.spend > 0)
    .sort((a: any, b: any) => b.spend - a.spend);

  const barDataResult = campanhaRows.map((c: any) => ({
    nome: c.nome.replace(/\[.*?\]/g, "").trim().slice(0, 20),
    valor: c.leads || c.reach,
  }));

  const barDataSpend = campanhaRows.map((c: any) => ({
    nome: c.nome.replace(/\[.*?\]/g, "").trim().slice(0, 20),
    valor: c.spend,
  }));

  const COLORS = ["#ef4444", "#ef4444", "#22c55e", "#a78bfa"];

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-xl font-bold text-white">Meta Ads</h2>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>dados em tempo real</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-3 mb-5">
        {[
          { label: "Investimento", value: loading ? "—" : brl(totals.spend), color: "#f5c518" },
          { label: "Alcance", value: loading ? "—" : fmt(totals.reach), color: "#22c55e" },
          { label: "Impressões", value: loading ? "—" : fmt(totals.impressions), color: "#ffffff" },
          { label: "Leads CRM", value: loading ? "—" : String(totals.leads), color: "#22c55e" },
          { label: "Entr. Página", value: loading ? "—" : fmt(totals.landingPage), color: "#f5c518" },
          { label: "Campanhas Ativas", value: loading ? "—" : String(campanhaRows.length), color: "#a78bfa" },
        ].map((k) => (
          <div key={k.label} className="glass rounded-xl p-4">
            <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)" }} className="uppercase mb-2">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-sm font-semibold text-white">Resultado por Campanha</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barDataResult} margin={{ left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="nome" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {barDataResult.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <p className="text-sm font-semibold text-white">Gasto por Campanha</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barDataSpend} margin={{ left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="nome" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0c1628", border: "1px solid rgba(58,123,255,0.2)", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`R$ ${Number(v).toFixed(2)}`, "Gasto"]} />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {barDataSpend.map((_: any, i: number) => (
                  <Cell key={i} fill={["#ef4444", "#ef4444", "#22c55e", "#a78bfa"][i % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campanhas Table */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <p className="text-sm font-semibold text-white">Campanhas</p>
        </div>
        <table className="w-full" style={{ fontSize: 12 }}>
          <thead>
            <tr style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th className="text-left pb-3 font-medium uppercase">Campanha</th>
              <th className="pb-3 text-right font-medium uppercase">Leads</th>
              <th className="pb-3 text-right font-medium uppercase">Alcance</th>
              <th className="pb-3 text-right font-medium uppercase">Impressões</th>
              <th className="pb-3 text-right font-medium uppercase">Custo/Lead</th>
              <th className="pb-3 text-right font-medium uppercase">Gasto</th>
            </tr>
          </thead>
          <tbody>
            {campanhaRows.map((c: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4" style={{ color: "rgba(255,255,255,0.8)", maxWidth: 260 }}>
                  <span className="line-clamp-1">{c.nome}</span>
                </td>
                <td className="py-3 text-right font-semibold" style={{ color: "#22c55e" }}>{c.leads || "—"}</td>
                <td className="py-3 text-right" style={{ color: "rgba(255,255,255,0.6)" }}>{fmt(c.reach)}</td>
                <td className="py-3 text-right" style={{ color: "rgba(255,255,255,0.6)" }}>{fmt(c.impressions)}</td>
                <td className="py-3 text-right" style={{ color: c.cpl > 100 ? "#ef4444" : "#22c55e" }}>
                  {c.cpl > 0 ? brl(c.cpl) : "—"}
                </td>
                <td className="py-3 text-right" style={{ color: "rgba(255,255,255,0.7)" }}>{brl(c.spend)}</td>
              </tr>
            ))}
            <tr style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <td className="py-3 font-semibold text-white">Total</td>
              <td className="py-3 text-right font-semibold" style={{ color: "#22c55e" }}>{totals.leads || "—"}</td>
              <td className="py-3 text-right text-white">{fmt(totals.reach)}</td>
              <td className="py-3 text-right text-white">{fmt(totals.impressions)}</td>
              <td className="py-3 text-right">—</td>
              <td className="py-3 text-right text-white font-semibold">{brl(totals.spend)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
