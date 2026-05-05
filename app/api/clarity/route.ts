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

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
