import { NextResponse } from "next/server";

const TOKEN = process.env.CLARITY_TOKEN!;
const PROJECT_ID = process.env.CLARITY_PROJECT_ID!;

export async function GET() {
  try {
    const res = await fetch(
      `https://www.clarity.ms/export-data/api/v1/project-live-insights?projectId=${PROJECT_ID}`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Clarity API ${res.status}: ${text}` }, { status: 502 });
    }

    // API retorna array [{metricName, information}] — normaliza para objeto keyed
    const raw: Array<{ metricName: string; information: any[] }> = await res.json();
    const byMetric: Record<string, any[]> = {};
    for (const item of raw) {
      byMetric[item.metricName] = item.information || [];
    }

    const traffic = byMetric["Traffic"]?.[0] || {};
    const scrollDepth = byMetric["ScrollDepth"]?.[0] || {};
    const deadClick = byMetric["DeadClickCount"]?.[0] || {};
    const totalSessions = Number(traffic.totalSessionCount || 0);

    const browsers = (byMetric["Browser"] || []).map((b: any) => ({
      name: b.name || "Outro",
      sessions: Number(b.sessionsCount || 0),
      percentage: totalSessions > 0 ? Number(((Number(b.sessionsCount || 0) / totalSessions) * 100).toFixed(2)) : 0,
    }));

    const referrers = (byMetric["ReferrerUrl"] || []).map((r: any) => ({
      url: r.name || "Direto",
      sessions: Number(r.sessionsCount || 0),
    }));

    const popularPages = (byMetric["PopularPages"] || []).map((p: any) => ({
      url: p.url || "/",
      sessions: Number(p.visitsCount || p.sessionsCount || 0),
      scrollDepth: Number(p.scrollDepth || p.averageScrollDepth || 0),
    }));

    return NextResponse.json({
      Traffic: {
        totalSessionCount: totalSessions,
        totalUserCount: Number(traffic.distinctUserCount || 0),
      },
      ScrollDepth: {
        averageScrollDepth: Number(scrollDepth.averageScrollDepth || 0),
      },
      DeadClickCount: {
        percentage: Number(deadClick.sessionsWithMetricPercentage || 0),
      },
      Browser: browsers,
      ReferrerUrl: referrers,
      PopularPages: popularPages,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
