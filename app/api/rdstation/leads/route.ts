import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");
  const until = searchParams.get("until");

  let query = supabase
    .from("rd_leads")
    .select("*")
    .order("criado_em", { ascending: false });

  if (since) query = query.gte("criado_em", since);
  if (until) query = query.lte("criado_em", until + "T23:59:59");

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const leads = data || [];

  // Agrupa por origem
  const porOrigem = leads.reduce((acc: any, l: any) => {
    const o = l.origem || "Direto";
    acc[o] = (acc[o] || 0) + 1;
    return acc;
  }, {});

  // Agrupa por lifecycle/etapa do funil
  const porEtapa = leads.reduce((acc: any, l: any) => {
    const e = l.lifecycle || "Lead";
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    total: leads.length,
    leads,
    porOrigem,
    porEtapa,
  });
}
