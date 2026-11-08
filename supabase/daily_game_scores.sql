-- Anonymous, one-per-browser daily score comparisons for Your Daily News Game.
-- Score rows are never directly readable; clients receive only per-score totals through the RPC below.
create table if not exists public.daily_game_scores (
  edition_date date not null,
  player_id uuid not null,
  score smallint not null check (score between 0 and 5),
  updated_at timestamptz not null default now(),
  primary key (edition_date, player_id)
);

alter table public.daily_game_scores enable row level security;
revoke all on public.daily_game_scores from anon, authenticated;

create or replace function public.submit_daily_game_score(
  p_edition_date date,
  p_player_id uuid,
  p_score smallint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_edition_date is null or p_player_id is null or p_score is null or p_score < 0 or p_score > 5 then
    raise exception 'Invalid daily game score';
  end if;

  insert into public.daily_game_scores (edition_date, player_id, score)
  values (p_edition_date, p_player_id, p_score)
  on conflict (edition_date, player_id) do update
    set score = greatest(public.daily_game_scores.score, excluded.score),
        updated_at = now();
end;
$$;

create or replace function public.get_daily_game_score_distribution(p_edition_date date)
returns table (score smallint, player_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select s.score, count(*)::bigint as player_count
  from public.daily_game_scores s
  where s.edition_date = p_edition_date
  group by s.score
  order by s.score;
$$;

revoke all on function public.submit_daily_game_score(date, uuid, smallint) from public;
revoke all on function public.get_daily_game_score_distribution(date) from public;
grant execute on function public.submit_daily_game_score(date, uuid, smallint) to anon, authenticated;
grant execute on function public.get_daily_game_score_distribution(date) to anon, authenticated;
