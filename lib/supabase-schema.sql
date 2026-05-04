-- Tabela de leads do RD Station (recebidos via webhook)
create table if not exists rd_leads (
  id           uuid default gen_random_uuid() primary key,
  email        text unique not null,
  nome         text,
  telefone     text,
  origem       text,           -- "Google Ads", "Meta Ads", "Orgânico", etc
  utm_source   text,
  utm_campaign text,
  lifecycle    text,           -- etapa do funil: Lead, Qualified Lead, Cliente, etc
  oportunidade boolean default false,
  convertido_em timestamptz,
  criado_em    timestamptz default now(),
  atualizado_em timestamptz default now(),
  payload_raw  jsonb          -- payload completo do RD Station para debug
);

-- Index para queries por data
create index if not exists rd_leads_criado_em_idx on rd_leads (criado_em desc);
create index if not exists rd_leads_origem_idx on rd_leads (origem);

-- RLS: leitura pública (anon key), escrita só server-side
alter table rd_leads enable row level security;

create policy "leitura publica" on rd_leads
  for select using (true);

create policy "insercao service" on rd_leads
  for insert with check (true);

create policy "update service" on rd_leads
  for update using (true);
