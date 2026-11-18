-- Feedback & Complaints submissions table (for plain PostgreSQL)
create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  -- Section A: Feedback/Complain
  feedback text not null,
  -- Section B: Confidential
  is_confidential boolean not null default false,
  -- Section C: Personal details (conditional)
  name text,
  gender text check (gender in ('male', 'female', 'others')),
  district text,
  municipality text,
  ward_no text,
  village text,
  -- Section D: Want response
  wants_response boolean not null default false,
  mobile_no text,
  email text,
  -- Status & Admin
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'closed')),
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  -- Metadata
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index feedback_submissions_status_idx on public.feedback_submissions(status);
create index feedback_submissions_created_at_idx on public.feedback_submissions(created_at desc);
create index feedback_submissions_email_idx on public.feedback_submissions(email) where email is not null;

comment on table public.feedback_submissions is 'Stores feedback and complaint submissions from the public website';
comment on column public.feedback_submissions.feedback is 'The main feedback or complaint content (Section A)';
comment on column public.feedback_submissions.is_confidential is 'Whether the submitter wants to remain confidential (Section B)';
comment on column public.feedback_submissions.name is 'Submitter name (Section C, required when not confidential)';
comment on column public.feedback_submissions.gender is 'Submitter gender (Section C)';
comment on column public.feedback_submissions.district is 'Submitter district (Section C)';
comment on column public.feedback_submissions.municipality is 'Submitter municipality (Section C)';
comment on column public.feedback_submissions.ward_no is 'Submitter ward number (Section C)';
comment on column public.feedback_submissions.village is 'Submitter village/tole (Section C)';
comment on column public.feedback_submissions.wants_response is 'Whether the submitter wants a response (Section D)';
comment on column public.feedback_submissions.mobile_no is 'Mobile number for response (Section D)';
comment on column public.feedback_submissions.email is 'Email for response (Section D)';
comment on column public.feedback_submissions.status is 'Current status: new, in_progress, resolved, closed';
comment on column public.feedback_submissions.admin_notes is 'Internal admin notes on handling the feedback';

-- Trigger to auto-update updated_at
create or replace function public.set_feedback_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger feedback_submissions_set_updated_at
  before update on public.feedback_submissions
  for each row execute function public.set_feedback_updated_at();

revoke all on function public.set_feedback_updated_at() from public;

-- Grant permissions for API user
grant insert on public.feedback_submissions to postgres;
grant select, update on public.feedback_submissions to postgres;