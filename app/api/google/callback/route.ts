import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Código não recebido" }, { status: 400 });
  }

  // Troca o code pelo refresh_token
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "https://dashboard-hagana.vercel.app/api/google/callback",
      grant_type: "authorization_code",
    }),
  });

  const tokens = await res.json();

  if (tokens.error) {
    return NextResponse.json({ error: tokens.error, detail: tokens.error_description }, { status: 400 });
  }

  // Mostra o refresh_token na tela — copie e salve como env var
  return NextResponse.json({
    ok: true,
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
    instrucao: "Copie o refresh_token e adicione como GOOGLE_ADS_REFRESH_TOKEN na Vercel",
  });
}
