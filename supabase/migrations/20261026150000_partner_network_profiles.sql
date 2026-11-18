-- Expand existing network partner records into public partner profiles.
-- Historical affiliations remain visible as Funding Partners after the
-- network is simplified to its two supported categories.

alter table public.network_partners
  drop constraint if exists network_partners_relationship_type_check;

alter table public.network_partners
  add column slug text,
  add column logo_public_id text,
  add column short_description text,
  add column location text,
  add column public_contact_email text,
  add column collaboration_context text,
  add column collaboration_areas text,
  add column display_order integer not null default 0;

update public.network_partners
set relationship_type = case
  when relationship_type = 'local-district' then 'local_district'
  else 'resource_provider'
end;

with bases as (
  select
    id,
    coalesce(
      nullif(
        trim(both '-' from regexp_replace(lower(btrim(name)), '[^a-z0-9]+', '-', 'g')),
        ''
      ),
      'partner'
    ) as raw_slug
  from public.network_partners
), normalized as (
  select
    id,
    left(raw_slug, 80) as base_slug,
    count(*) over (
      partition by left(raw_slug, 80)
    ) as same_name_count
  from bases
)
update public.network_partners as partners
set
  slug = case
    when normalized.same_name_count > 1 then
      normalized.base_slug || '-' || replace(normalized.id::text, '-', '')
    else normalized.base_slug
  end,
  short_description = left(coalesce(nullif(btrim(partners.description), ''), ''), 280)
from normalized
where partners.id = normalized.id;

alter table public.network_partners
  alter column slug set not null,
  alter column short_description set not null,
  alter column relationship_type set default 'local_district',
  add constraint network_partners_relationship_type_check
    check (relationship_type in ('local_district', 'resource_provider')),
  add constraint network_partners_slug_format_check
    check (char_length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  add constraint network_partners_display_order_check
    check (display_order >= 0),
  add constraint network_partners_logo_reference_check
    check (logo_public_id is null or logo_url is not null),
  add constraint network_partners_short_description_check
    check (char_length(btrim(short_description)) between 10 and 280) not valid,
  add constraint network_partners_description_check
    check (description is not null and char_length(btrim(description)) > 0) not valid;

create unique index network_partners_slug_key
  on public.network_partners(slug);
create index network_partners_public_order_idx
  on public.network_partners(publication_status, display_order, name);

comment on column public.network_partners.slug is
  'Stable public profile URL segment; unique across all partner records.';
comment on column public.network_partners.relationship_type is
  'Fixed partner category: local_district or resource_provider.';
comment on column public.network_partners.logo_public_id is
  'Verified Cloudinary public ID used to manage the partner logo asset.';
comment on column public.network_partners.collaboration_areas is
  'Optional collaboration areas entered as one item per line.';

create function public.set_network_partner_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger network_partners_set_updated_at
  before update on public.network_partners
  for each row execute function public.set_network_partner_updated_at();
revoke all on function public.set_network_partner_updated_at() from public, anon, authenticated;
