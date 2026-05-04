import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// RD Station envia um POST com os dados do lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Estrutura do payload do RD Station Webhook
    const leads = body.leads || [body];

    for (const lead of leads) {
      const origem = detectarOrigem(lead);

      await supabase.from("rd_leads").upsert({
        email: lead.email,
        nome: lead.name || lead.nome || "",
        telefone: lead.mobile_phone || lead.phone || "",
        origem,
        utm_source: lead.traffic_source || lead.utm_source || "",
        utm_campaign: lead.traffic_campaign || lead.utm_campaign || "",
        lifecycle: lead.lifecycle_stage || "",
        oportunidade: lead.opportunity || false,
        convertido_em: lead.converted_at || null,
        criado_em: lead.created_at || new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
        payload_raw: lead,
      }, { onConflict: "email" });
    }

    return NextResponse.json({ ok: true, leads: leads.length });
  } catch (err) {
    console.error("Webhook RD Station erro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET para validação do webhook pelo RD Station
export async function GET() {
  return NextResponse.json({ status: "webhook ativo" });
}

function detectarOrigem(lead: any): string {
  const source = (lead.traffic_source || lead.utm_source || "").toLowerCase();
  const campaign = (lead.traffic_campaign || lead.utm_campaign || "").toLowerCase();

  if (source.includes("google") || source.includes("cpc")) return "Google Ads";
  if (source.includes("facebook") || source.includes("instagram") || source.includes("meta")) return "Meta Ads";
  if (campaign.includes("google")) return "Google Ads";
  if (campaign.includes("meta") || campaign.includes("facebook")) return "Meta Ads";
  if (source.includes("organic")) return "Orgânico";
  return source || "Direto";
}
