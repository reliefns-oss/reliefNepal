# Admin workspace

The workspace at `/admin` uses Supabase Auth email/password sign-in. The web app needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `apps/web/.env.local`; the API needs the same project URL and publishable key in `apps/api/.env`. Configure Cloudinary `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the API environment to enable project banners. Restart both apps after changing environment variables.

In the Cloudinary Console, copy the cloud name from the dashboard and the API key/secret from **Settings → API Keys**. Add those values only to `apps/api/.env` locally and to the API host's secret environment settings in production. The web app uses the API to obtain a scoped upload signature; it never receives the API secret. The integration accepts JPG, PNG, WebP, and AVIF images up to 8 MB.

## Grant the first administrator

Create the account in Supabase Dashboard → Authentication → Users (or enable a deliberate account signup flow). Copy that user's UUID, then run this once in the Supabase SQL Editor:

```sql
insert into public.profiles (id, display_name, role)
values ('AUTH_USER_UUID', 'Relief Nepal Admin', 'admin')
on conflict (id) do update
set display_name = excluded.display_name,
    role = excluded.role,
    updated_at = now();
```

Replace `AUTH_USER_UUID` with the Auth user's actual UUID. Admins and editors can manage projects, gallery entries, vacancies, networks, and notices. Only admins can review newsletter subscribers. The Contact page sends through EmailJS and has no admin inbox; historical contact records remain in Supabase. New profile records default to `viewer`, which grants no admin workspace access.

## Use the workspace

- **Projects:** create and edit records, upload a JPG, PNG, WebP, or AVIF banner (maximum 8 MB), set planned/ongoing/completed status, and save as draft, published, or archived. In **Impact figures**, add a result name, amount, and unit; reporting period, measurement date, and source are optional. Mark a figure verified only after checking its source; unverified figures are visible to editors but never shown publicly. In **Impact details**, add a heading and a short explanation of the result. Add or remove rows with the buttons—no JSON or code is needed. Published projects show their verified figures and details. Uploads use a server-generated signature; the Cloudinary API secret is never sent to the browser. Removing or replacing a saved banner deletes its old Cloudinary asset.
- **Gallery:** create a project first, then select it before adding gallery media. Upload photos to Cloudinary, add YouTube links for videos, or add an audio HTTPS URL. Admin gallery items are grouped under their project, and the public Media page displays project albums with their photos, videos, and audio together. Published project photos also appear on the project detail page. Add a caption, alt text, and publication state. For public display, publish both the project and its gallery items.
- **Vacancies:** create jobs with a generated, editable URL slug, job type and level, location, number of openings, work schedule, requirements, application instructions, and deadline. Salary is always shown as negotiable. Keep roles in draft until application details are ready, then set status to open. Open roles appear on `/vacancies` with a dedicated detail page.
- **Notice photos:** upload an optional JPG, PNG, WebP, or AVIF image in the Notice editor. The saved photo appears in the public notice list and on its detail page when the notice is published.
- **Networks:** manage partner profiles with a generated editable slug, one of two fixed categories, optional Cloudinary logo, short and full descriptions, location, website, public contact email, collaboration context and areas, display order, and draft/published status. Search and filter the admin list by category. Published profiles appear in the interactive `/network` directory and at `/network/{slug}`. Legacy affiliations are retained as Funding Partners after the network migration.
- **Notices:** create announcements with a title-generated URL slug, optional Cloudinary photo, details, optional attachment link, and publication state. Published notices appear on the Notices page.
- **Newsletter:** view recent subscriber addresses and contact them through the email link. Subscription data is read-only.

The API checks the Supabase access token and profile role on every `/api/v1/admin/*` request. Row-level security remains enabled and is enforced for each request. Never add a service-role or secret key to the web app.

## Contact form email delivery

The Contact page sends messages directly through EmailJS. In EmailJS, connect the email service, create a template with `from_name`, `reply_to`, `email`, `subject`, `message`, and `time` variables, set the recipient in the template, and set its Reply-To field to `{{reply_to}}`. Add `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` to `apps/web/.env.local` and the web deployment environment, then restart the dev server or redeploy. Allowlist the website origin in EmailJS. The public key is intended for browser use; do not add an EmailJS private key. Contact messages are emailed but are not saved in the admin workspace or database. Existing database contact records are left intact.

Before using the latest project impact editor in a hosted environment, apply `20261026120000_normalize_project_impact.sql` after `20261026065258_add_project_detail_fields.sql`. It copies valid entries from the previous project JSON fields into the structured impact tables. Migrated figures are marked unverified and must be reviewed before they appear publicly. Do not run this migration against production until you have reviewed it and reconciled Supabase migration history. If the earlier schema was applied manually in the Supabase SQL Editor, run this file there after its prerequisite migration; see the root README for safe migration workflow guidance.

To enable project albums, apply `20261026130000_link_gallery_items_to_projects.sql` first, then `20261026140000_require_project_gallery.sql`. Do not run the second migration by itself: the first migration creates `gallery_items.project_id`, which the second one constrains. Both follow the initial core and admin content migrations. The second migration requires project assignment for new gallery records and prevents deleting projects that still have gallery items. It keeps old unassigned records available to admins; edit them in the Gallery tab and choose their project. After all old rows have a project, validate the constraint in Supabase SQL Editor:

```sql
alter table public.gallery_items
  validate constraint gallery_items_project_required;

alter table public.gallery_items
  alter column project_id set not null;

alter table public.gallery_items
  drop constraint gallery_items_project_required;
```

To enable partner profiles, apply `20261026150000_partner_network_profiles.sql` after the core and admin content migrations (and reconcile it with any manually applied migration history first). The migration preserves current partner records, maps old `local-district` entries to `local_district`, and maps old `resource-partner` and `affiliation` entries to `resource_provider`. It backfills unique profile slugs from partner names. After applying, restart the API and web apps. Partner logo uploads use the existing API-scoped Cloudinary configuration and are stored under the `partners` folder.

The Projects tab assigns each project to a program category. The standard categories are created by the admin content migration. Gallery photos, notice photos, and partner logos upload to Cloudinary; video items require a YouTube URL, while audio items can use an HTTPS media URL and optional thumbnail. Existing non-YouTube video records are preserved by the migration but are not shown on the public gallery until their URL is replaced. Networks and Notices can be saved as drafts before publication.
