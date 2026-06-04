create table if not exists contact_submissions (
  id integer primary key autoincrement,
  created_at text not null default (datetime('now')),
  name text not null,
  email text,
  project_type text not null default 'Company site',
  message text not null,
  source text not null default 'nxwarden.com',
  user_agent text,
  ip_hint text
);

create index if not exists idx_contact_submissions_created_at
on contact_submissions(created_at desc);
