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

create table if not exists nodes (
  id text primary key,
  name text not null,
  provider text,
  region text,
  visibility text not null default 'private',
  created_at text not null default (datetime('now'))
);

create table if not exists telemetry (
  id integer primary key autoincrement,
  node_id text not null,
  cpu_percent real,
  memory_percent real,
  disk_percent real,
  temperature_c real,
  online_users integer,
  created_at text not null default (datetime('now')),
  foreign key (node_id) references nodes(id)
);

create index if not exists idx_telemetry_node_created_at
on telemetry(node_id, created_at desc);

create index if not exists idx_telemetry_created_at
on telemetry(created_at desc);

create table if not exists audit_logs (
  id integer primary key autoincrement,
  source text not null,
  event_type text not null,
  message text not null,
  created_at text not null default (datetime('now'))
);

create index if not exists idx_audit_logs_created_at
on audit_logs(created_at desc);

create table if not exists system_events (
  id integer primary key autoincrement,
  source text not null,
  event_type text not null,
  message text not null,
  severity text not null default 'info',
  created_at text not null default (datetime('now'))
);

create index if not exists idx_system_events_created_at
on system_events(created_at desc);
