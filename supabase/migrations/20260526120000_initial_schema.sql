-- Mini Board: initial schema (profiles, posts, RLS, triggers)
-- docs/rdb-design.md, AGENTS.md 기준
-- 적용 전 docs/migration-plan.md 승인 필요

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  created_at timestamptz not null default now(),
  constraint profiles_nickname_not_empty check (trim(nickname) <> '')
);

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create table public.posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_title_not_empty check (trim(title) <> ''),
  constraint posts_content_not_empty check (trim(content) <> '')
);

create index posts_author_id_idx on public.posts (author_id);
create index posts_created_at_desc_idx on public.posts (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger (posts)
-- ---------------------------------------------------------------------------
create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_posts_updated_at();

-- ---------------------------------------------------------------------------
-- profile on signup (auth.users)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''),
      split_part(coalesce(new.email, 'user'), '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- profiles: SELECT — 로그인 사용자
create policy profiles_select_authenticated
  on public.profiles
  for select
  to authenticated
  using (true);

-- profiles: INSERT — 본인만
create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- profiles: UPDATE — 본인만
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- posts: SELECT — 누구나
create policy posts_select_all
  on public.posts
  for select
  to anon, authenticated
  using (true);

-- posts: INSERT — 로그인 + author_id 일치
create policy posts_insert_own
  on public.posts
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

-- posts: UPDATE — 작성자만
create policy posts_update_own
  on public.posts
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

-- posts: DELETE — 작성자만
create policy posts_delete_own
  on public.posts
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);

-- ---------------------------------------------------------------------------
-- Data API grants (RLS와 별개: 테이블 접근 권한)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.profiles to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant select on public.posts to anon;
grant usage, select on all sequences in schema public to authenticated;
