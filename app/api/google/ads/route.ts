import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN!;
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN!;
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID!;
const MCC_ID = process.env.GOOGLE_ADS_MCC_ID!;

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  return data.access_token as string;
}

async function queryGoogleAds(accessToken: string, query: string) {
  const res = await fetch(
    `https://googleads.googleapis.com/v17/customers/${CUSTOMER_ID}/googleAds:search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": DEVELOPER_TOKEN,
        "login-customer-id": MCC_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");
  const until = searchParams.get("until");

  if (!since || !until) {
    return NextResponse.json({ error: "since e until obrigatórios" }, { status: 400 });
  }

  try {
    const accessToken = await getAccessToken();

    // Métricas gerais da conta
    const metricsQuery = `
      SELECT
        metrics.cost_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.average_cpc,
        metrics.conversions,
        metrics.cost_per_conversion
      FROM customer
      WHERE segments.date BETWEEN '${since}' AND '${until}'
    `;

    // Campanhas
    const campanhasQuery = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.cost_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.average_cpc,
        metrics.conversions,
        metrics.cost_per_conversion
      FROM campaign
      WHERE segments.date BETWEEN '${since}' AND '${until}'
        AND campaign.status = 'ENABLED'
      ORDER BY metrics.cost_micros DESC
    `;

    // Palavras-chave
    const keywordsQuery = `
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        metrics.clicks,
        metrics.impressions,
        metrics.ctr,
        metrics.cost_micros,
        metrics.conversions
      FROM keyword_view
      WHERE segments.date BETWEEN '${since}' AND '${until}'
        AND ad_group_criterion.status = 'ENABLED'
      ORDER BY metrics.clicks DESC
      LIMIT 10
    `;

    // Termos de pesquisa
    const termosQuery = `
      SELECT
        search_term_view.search_term,
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.conversions,
        segments.keyword.info.match_type
      FROM search_term_view
      WHERE segments.date BETWEEN '${since}' AND '${until}'
      ORDER BY metrics.clicks DESC
      LIMIT 10
    `;

    const [metricsData, campanhasData, keywordsData, termosData] = await Promise.all([
      queryGoogleAds(accessToken, metricsQuery),
      queryGoogleAds(accessToken, campanhasQuery),
      queryGoogleAds(accessToken, keywordsQuery),
      queryGoogleAds(accessToken, termosQuery),
    ]);

    // Processa métricas gerais
    const row = metricsData.results?.[0];
    const metrics = row ? {
      spend: Number(row.metrics.costMicros || 0) / 1_000_000,
      impressions: Number(row.metrics.impressions || 0),
      clicks: Number(row.metrics.clicks || 0),
      ctr: Number(row.metrics.ctr || 0) * 100,
      cpc: Number(row.metrics.averageCpc || 0) / 1_000_000,
      conversoes: Number(row.metrics.conversions || 0),
      custoConv: Number(row.metrics.costPerConversion || 0) / 1_000_000,
    } : null;

    // Processa campanhas
    const campanhas = (campanhasData.results || []).map((r: any) => ({
      id: r.campaign.id,
      nome: r.campaign.name,
      spend: Number(r.metrics.costMicros || 0) / 1_000_000,
      impressions: Number(r.metrics.impressions || 0),
      clicks: Number(r.metrics.clicks || 0),
      ctr: Number(r.metrics.ctr || 0) * 100,
      cpc: Number(r.metrics.averageCpc || 0) / 1_000_000,
      conversoes: Number(r.metrics.conversions || 0),
    }));

    // Processa keywords
    const keywords = (keywordsData.results || []).map((r: any) => ({
      termo: r.adGroupCriterion.keyword.text,
      tipo: r.adGroupCriterion.keyword.matchType,
      clicks: Number(r.metrics.clicks || 0),
      impressions: Number(r.metrics.impressions || 0),
      ctr: Number(r.metrics.ctr || 0) * 100,
      custo: Number(r.metrics.costMicros || 0) / 1_000_000,
      conversoes: Number(r.metrics.conversions || 0),
    }));

    // Processa termos de pesquisa
    const termos = (termosData.results || []).map((r: any) => ({
      termo: r.searchTermView.searchTerm,
      tipo: r.segments?.keyword?.info?.matchType || "—",
      clicks: Number(r.metrics.clicks || 0),
      custo: Number(r.metrics.costMicros || 0) / 1_000_000,
      conversoes: Number(r.metrics.conversions || 0),
    }));

    return NextResponse.json({ metrics, campanhas, keywords, termos });

  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
