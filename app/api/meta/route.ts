import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.META_ACCESS_TOKEN!;
const ACCOUNT = process.env.META_ACCOUNT_ID!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");
  const until = searchParams.get("until");

  if (!since || !until) {
    return NextResponse.json({ error: "since e until são obrigatórios" }, { status: 400 });
  }

  const timeRange = JSON.stringify({ since, until });

  try {
    // Insights gerais da conta
    const insightsRes = await fetch(
      `https://graph.facebook.com/v19.0/${ACCOUNT}/insights?fields=spend,reach,impressions,actions,clicks,ctr,date_start&time_increment=1&time_range=${encodeURIComponent(timeRange)}&access_token=${TOKEN}`
    );
    const insightsJson = await insightsRes.json();

    // Campanhas ativas com métricas
    const campanhasRes = await fetch(
      `https://graph.facebook.com/v19.0/${ACCOUNT}/campaigns?fields=id,name,status,insights.time_range(${encodeURIComponent(timeRange)}){spend,reach,impressions,actions,clicks,ctr}&access_token=${TOKEN}`
    );
    const campanhasJson = await campanhasRes.json();

    // Conjuntos de anúncios
    const adSetsRes = await fetch(
      `https://graph.facebook.com/v19.0/${ACCOUNT}/adsets?fields=id,name,status,insights.time_range(${encodeURIComponent(timeRange)}){spend,reach,impressions,actions,clicks,ctr}&access_token=${TOKEN}`
    );
    const adSetsJson = await adSetsRes.json();

    // Anúncios (criativos) com métricas
    const adsRes = await fetch(
      `https://graph.facebook.com/v19.0/${ACCOUNT}/ads?fields=id,name,status,creative{thumbnail_url,title},insights.time_range(${encodeURIComponent(timeRange)}){spend,reach,impressions,actions,clicks,ctr}&access_token=${TOKEN}`
    );
    const adsJson = await adsRes.json();

    // Expõe erros da Meta API se houver
    if (insightsJson.error) {
      return NextResponse.json({ meta_error: insightsJson.error, token_loaded: !!TOKEN }, { status: 502 });
    }

    return NextResponse.json({
      insights: insightsJson.data || [],
      campanhas: campanhasJson.data || [],
      adSets: adSetsJson.data || [],
      ads: adsJson.data || [],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err), token_loaded: !!TOKEN }, { status: 500 });
  }
}
