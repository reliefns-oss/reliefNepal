'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api/client.js';
import {
  getAdminErrorMessage,
  getImageUploadErrorMessage,
} from '../../lib/admin-feedback.js';
import AdminContentSection from './AdminContentSection.jsx';
import { ToastContainer, useToast } from '../../components/ui/Toast.jsx';

const tabs = [
  ['programs', 'Programs'],
  ['projects', 'Projects'],
  ['gallery', 'Gallery'],
  ['vacancies', 'Vacancies'],
  ['networks', 'Networks'],
  ['notices', 'Notices'],
  ['board-members', 'Board Members'],
  ['procurement', 'Procurement'],
];
const blank = {
  slug: '',
  title: '',
  summary: '',
  location: '',
  donor: '',
  period: '',
  total_budget: '',
  theme: '',
  background: '',
  impact_metrics: [],
  impact_details: [],
  status: 'planned',
  publication_status: 'draft',
  starts_on: '',
  ends_on: '',
  banner_url: null,
  banner_public_id: null,
  program_id: '',
};

function slugFromTitle(value) {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

function requiredMark() {
  return (
    <span className="ml-1 font-bold text-red-600" aria-hidden="true">
      *
    </span>
  );
}

const STORAGE_KEY = 'relief_nepal_admin_token';

export default function AdminPage() {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  });
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('projects');
  const [rows, setRows] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [rowsLoadError, setRowsLoadError] = useState('');
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsLoadError, setProgramsLoadError] = useState('');
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerUploadStep, setBannerUploadStep] = useState('');
  const { toast } = useToast();

  function showMessage(text, tone = 'success') {
    toast({
      title: tone === 'success' ? 'Success' : tone === 'error' ? 'Error' : tone === 'warning' ? 'Warning' : 'Info',
      description: text,
      type: tone,
      duration: tone === 'error' ? 8000 : 5000,
    });
  }

  const request = useCallback(async (path, options = {}) => {
    if (!token) throw new Error('Not authenticated');
    return apiRequest(path, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  }, [token]);

  // Verify token on load
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let active = true;
    request('/admin/auth/verify')
      .then((value) => {
        if (active) {
          setProfile(value.user);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem(STORAGE_KEY);
          setToken(null);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [token, request]);

  function updateImpactItem(collection, index, key, value) {
    setForm((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  }

  function addImpactMetric() {
    setForm((current) => ({
      ...current,
      impact_metrics: [
        ...current.impact_metrics,
        {
          label: '',
          value: '',
          unit: '',
          reporting_period: '',
          measured_on: '',
          source: '',
          verification_status: 'unverified',
        },
      ],
    }));
  }

  function addImpactDetail() {
    setForm((current) => ({
      ...current,
      impact_details: [
        ...current.impact_details,
        { title: '', description: '' },
      ],
    }));
  }

  function removeImpactItem(collection, index) {
    setForm((current) => ({
      ...current,
      [collection]: current[collection].filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  useEffect(() => {
    if (!profile) return;
    if (['gallery', 'vacancies', 'networks', 'notices'].includes(tab)) return;
    let active = true;
    setRowsLoading(true);
    setRowsLoadError('');
    request(`/admin/${tab}`)
      .then((data) => {
        if (active) setRows(data);
      })
      .catch((error) => {
        if (active) setRowsLoadError(getAdminErrorMessage(error));
      })
      .finally(() => {
        if (active) setRowsLoading(false);
      });
    return () => { active = false; };
  }, [profile, tab, request]);

  useEffect(() => {
    if (!profile) return;
    let active = true;
    setProgramsLoading(true);
    setProgramsLoadError('');
    request('/admin/programs')
      .then((data) => {
        if (active) setPrograms(data);
      })
      .catch((error) => {
        if (active) setProgramsLoadError(getAdminErrorMessage(error));
      })
      .finally(() => {
        if (active) setProgramsLoading(false);
      });
    return () => { active = false; };
  }, [profile, request]);

  async function refreshProjects() {
    setRowsLoading(true);
    const success = await request('/admin/projects')
      .then((data) => {
        setRows(data);
        setRowsLoadError('');
        return true;
      })
      .catch((error) => {
        setRowsLoadError(getAdminErrorMessage(error));
        return false;
      })
      .finally(() => setRowsLoading(false));
    return success;
  }

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await apiRequest('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(STORAGE_KEY, response.token);
      setToken(response.token);
      setProfile(response.user);
      setPassword('');
      setMessage('');
    } catch (error) {
      setMessage(getAdminErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setProfile(null);
    setRows([]);
    setPrograms([]);
    setForm(blank);
    setEditing(null);
    showMessage('Signed out successfully.');
  }

  async function saveProject(event) {
    event.preventDefault();
    setBusy(true);
    showMessage('');
    try {
      const saved = await request(
        editing ? `/admin/projects/${editing}` : '/admin/projects',
        {
          method: editing ? 'PATCH' : 'POST',
          body: JSON.stringify({
            ...form,
            program_id: form.program_id || null,
            starts_on: form.starts_on || null,
            ends_on: form.ends_on || null,
            impact_metrics: [...form.impact_metrics].sort(
              (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
            ),
            impact_details: [...form.impact_details].sort(
              (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
            ),
          }),
        },
      );
      setRows((current) =>
        editing
          ? current.map((project) => (project.id === editing ? saved : project))
          : [saved, ...current],
      );
      setForm(blank);
      setEditing(null);
      const refreshed = await refreshProjects();
      showMessage(
        refreshed
          ? 'Project saved.'
          : 'Project saved, but the list could not refresh. Use "Try again" to reload it.',
        refreshed ? 'success' : 'warning',
      );
    } catch (error) {
      showMessage(getAdminErrorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  }

  function editProject(project) {
    setEditing(project.id);
    setForm({
      ...blank,
      ...project,
      impact_metrics: [...(project.impact_metrics || [])].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
      ),
      impact_details: [...(project.impact_details || [])].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
      ),
      starts_on: project.starts_on || '',
      ends_on: project.ends_on || '',
    });
    showMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function uploadBanner(file) {
    if (!file) return;
    if (
      !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      showMessage('Choose a JPG, PNG, WebP, or AVIF image smaller than 8 MB.', 'error');
      return;
    }
    setUploadingBanner(true);
    setBannerUploadStep('Preparing secure upload...');
    showMessage('');
    try {
      // Step 1: Get upload URL and public_id
      const signed = await request('/admin/uploads/sign', {
        method: 'POST',
        body: JSON.stringify({ purpose: 'project-banner', mime_type: file.type }),
      });

      setBannerUploadStep('Uploading banner...');
      // Step 2: Upload file directly to our API
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // reader.result is like "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const uploaded = await request('/admin/uploads/direct', {
        method: 'POST',
        body: JSON.stringify({
          public_id: signed.public_id,
          file_base64: base64,
          mime_type: file.type,
        }),
      });

      setBannerUploadStep('Verifying banner...');
      // Step 3: Verify (optional but good for consistency)
      const verified = await request('/admin/uploads/verify', {
        method: 'POST',
        body: JSON.stringify({
          public_id: signed.public_id,
          secure_url: uploaded.media_url,
        }),
      });

      setForm((current) => ({ ...current, ...verified }));
      showMessage('Banner uploaded. Save the project to keep this change.');
    } catch (error) {
      showMessage(getImageUploadErrorMessage(error), 'error');
    } finally {
      setUploadingBanner(false);
      setBannerUploadStep('');
    }
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete ${project.title}? This cannot be undone.`)) return;
    try {
      await request(`/admin/projects/${project.id}`, { method: 'DELETE' });
      setRows((current) => current.filter((row) => row.id !== project.id));
      const refreshed = await refreshProjects();
      showMessage(
        refreshed
          ? 'Project deleted.'
          : 'Project deleted, but the list could not refresh. Use "Try again" to reload it.',
        refreshed ? 'success' : 'warning',
      );
    } catch (error) {
      showMessage(getAdminErrorMessage(error), 'error');
    }
  }

  if (loading)
    return (
      <main className="min-h-[70vh] bg-[#f7f8f5] p-8 text-center">
        Loading admin workspace...
      </main>
    );

  if (!token)
    return (
      <main className="min-h-[70vh] bg-[#f7f8f5] px-5 py-16">
        <form onSubmit={signIn} className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
            Relief Nepal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-forest-900">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Use your admin account.</p>
          <label className="mt-6 block text-sm font-semibold">
            Email
            <input
              required type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border p-3 font-normal"
              autoComplete="username"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Password
            <input
              required type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border p-3 font-normal"
              autoComplete="current-password"
            />
          </label>
          {message && <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>}
          <button disabled={busy} className="mt-6 w-full rounded-lg bg-forest-800 px-4 py-3 font-semibold text-white disabled:opacity-60">
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </main>
    );

  if (!profile)
    return (
      <main className="min-h-[70vh] bg-[#f7f8f5] px-5 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm text-center">
          <p className="text-sm text-slate-700">Verifying your session...</p>
        </div>
      </main>
    );

  return (
    <main className="min-h-[70vh] bg-[#f7f8f5] px-4 py-10 sm:px-6">
      <ToastContainer />
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">Content management</p>
            <h1 className="mt-1 text-3xl font-bold text-forest-900">Admin workspace</h1>
            <p className="text-sm text-slate-600">{profile.display_name || profile.email} | {profile.role}</p>
          </div>
          <button onClick={signOut} className="rounded-lg border border-forest-200 bg-white px-4 py-2 text-sm font-semibold text-forest-900">Sign out</button>
        </header>

        <nav className="mt-8 flex gap-2 overflow-x-auto border-b border-forest-200">
          {tabs.filter(([id]) => profile.role === 'admin' || ['programs', 'projects', 'gallery', 'vacancies', 'networks', 'notices', 'procurement', 'board-members'].includes(id)).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${tab === id ? 'border-forest-700 text-forest-900' : 'border-transparent text-slate-500'}`}>{label}</button>
          ))}
        </nav>

        {['programs', 'gallery', 'vacancies', 'networks', 'notices', 'board-members', 'procurement'].includes(tab) && (
          <AdminContentSection type={tab} request={request} />
        )}

        {tab === 'projects' && (
          <>
            <form onSubmit={saveProject} className="mt-6 grid gap-4 rounded-xl bg-white p-5 shadow-sm sm:grid-cols-2">
              <div className="sm:col-span-2 flex items-center justify-between">
                <h2 className="text-lg font-bold text-forest-900">{editing ? 'Edit project' : 'Add a project'}</h2>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm(blank); }} className="text-sm text-slate-600">Cancel edit</button>}
              </div>
              <p className="sm:col-span-2 text-xs text-slate-500">Fields marked with <span className="font-bold text-red-600">*</span> are required. Save as a draft while preparing; publish when the project is ready for the website.</p>

              <label className="text-sm font-semibold">Title {requiredMark()}
                <input required value={form.title} onChange={(e) => { const title = e.target.value; setForm((current) => ({ ...current, title, ...(editing ? {} : { slug: slugFromTitle(title) }) })); }} className="mt-1 w-full rounded-lg border p-2.5 font-normal" />
              </label>
              <label className="text-sm font-semibold">URL slug (generated from title; editable) {requiredMark()}
                <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="community-water-project" />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">Summary
                <textarea rows="3" value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" />
              </label>
              <label className="text-sm font-semibold">Location <input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="e.g., Sindhuli" /></label>
              <label className="text-sm font-semibold">Donor <input value={form.donor || ''} onChange={(e) => setForm({ ...form, donor: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="e.g., NATAN Worldwide Disaster Relief" /></label>
              <label className="text-sm font-semibold">Project Period <input value={form.period || ''} onChange={(e) => setForm({ ...form, period: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="e.g., April 2023 – December 2024" /></label>
              <label className="text-sm font-semibold">Total Budget <input value={form.total_budget || ''} onChange={(e) => setForm({ ...form, total_budget: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="e.g., USD 50,000" /></label>
              <label className="text-sm font-semibold">Theme <input value={form.theme || ''} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="e.g., Psychosocial Health and Protection" /></label>
              <label className="text-sm font-semibold sm:col-span-2">Background
                <textarea rows="4" value={form.background || ''} onChange={(e) => setForm({ ...form, background: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="Detailed project background and description..." />
              </label>

              <section className="sm:col-span-2 rounded-xl border border-forest-100 bg-forest-50/50 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-forest-900">Impact figures</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Add measurable results, such as &quot;240 families received clean water.&quot; Enter the result, amount, and unit separately. Figures stay private on the public site until marked verified.</p>
                  </div>
                  <button type="button" onClick={addImpactMetric} className="rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50">+ Add figure</button>
                </div>
                {form.impact_metrics.length === 0 ? (
                  <p className="mt-4 rounded-lg border border-dashed border-forest-200 bg-white p-4 text-sm text-slate-500">No impact figures added. You can add them later or leave this section empty.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {form.impact_metrics.map((metric, index) => (
                      <fieldset key={metric.id || index} className="rounded-lg border border-slate-200 bg-white p-4">
                        <legend className="sr-only">Impact figure {index + 1}</legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="text-sm font-semibold">What changed? <input required value={metric.label || ''} onChange={(event) => updateImpactItem('impact_metrics', index, 'label', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="Families with safe drinking water" /></label>
                          <div className="grid grid-cols-[minmax(0,1fr)_minmax(110px,.7fr)] gap-2">
                            <label className="text-sm font-semibold">Amount <input required value={metric.value || ''} onChange={(event) => updateImpactItem('impact_metrics', index, 'value', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="240" /></label>
                            <label className="text-sm font-semibold">Unit <input value={metric.unit || ''} onChange={(event) => updateImpactItem('impact_metrics', index, 'unit', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="families" /></label>
                          </div>
                          <label className="text-sm font-semibold">Verification <select value={metric.verification_status || 'unverified'} onChange={(event) => updateImpactItem('impact_metrics', index, 'verification_status', event.target.value)} className="mt-1 w-full rounded-lg border bg-white p-2.5 font-normal"><option value="unverified">Needs verification</option><option value="verified">Verified — ready to publish</option></select></label>
                          <div className="flex items-end justify-between gap-3">
                            <details className="group text-sm"><summary className="cursor-pointer py-2 font-semibold text-forest-700">Add reporting details</summary>
                              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                                <label className="text-sm font-semibold">Reporting period <input value={metric.reporting_period || ''} onChange={(event) => updateImpactItem('impact_metrics', index, 'reporting_period', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="e.g., 2025" /></label>
                                <label className="text-sm font-semibold">Measured on <input type="date" value={metric.measured_on || ''} onChange={(event) => updateImpactItem('impact_metrics', index, 'measured_on', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" /></label>
                                <label className="text-sm font-semibold sm:col-span-2">Source or evidence <input value={metric.source || ''} onChange={(event) => updateImpactItem('impact_metrics', index, 'source', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="e.g., 2025 monitoring report" /></label>
                              </div>
                            </details>
                            <button type="button" onClick={() => removeImpactItem('impact_metrics', index)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" aria-label={`Remove impact figure ${index + 1}`}>Remove</button>
                          </div>
                        </div>
                      </fieldset>
                    ))}
                  </div>
                )}
              </section>

              <section className="sm:col-span-2 rounded-xl border border-forest-100 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-bold text-forest-900">Impact details</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Explain how the work made a difference. Use one short heading and a clear description for each result.</p></div>
                  <button type="button" onClick={addImpactDetail} className="rounded-lg border border-forest-200 bg-white px-3 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50">+ Add detail</button>
                </div>
                {form.impact_details.length === 0 ? (
                  <p className="mt-4 rounded-lg border border-dashed border-forest-200 bg-forest-50/50 p-4 text-sm text-slate-500">No impact details added. You can add them later or leave this section empty.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {form.impact_details.map((detail, index) => (
                      <fieldset key={detail.id || index} className="rounded-lg border border-slate-200 p-4">
                        <legend className="sr-only">Impact detail {index + 1}</legend>
                        <div className="flex items-start gap-3">
                          <div className="grid flex-1 gap-3">
                            <label className="text-sm font-semibold">Heading <input required value={detail.title || ''} onChange={(event) => updateImpactItem('impact_details', index, 'title', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="Safer water for rural families" /></label>
                            <label className="text-sm font-semibold">What happened? <textarea required rows={3} value={detail.description || ''} onChange={(event) => updateImpactItem('impact_details', index, 'description', event.target.value)} className="mt-1 w-full rounded-lg border p-2.5 font-normal" placeholder="Describe the work and the difference it made in the community." /></label>
                          </div>
                          <button type="button" onClick={() => removeImpactItem('impact_details', index)} className="mt-5 rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" aria-label={`Remove impact detail ${index + 1}`}>Remove</button>
                        </div>
                      </fieldset>
                    ))}
                  </div>
                )}
              </section>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Project banner
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploadingBanner} onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; input.value = ''; uploadBanner(file); }} className="mt-2 block w-full rounded-lg border p-2.5 font-normal" />
                  <span className="mt-1 block text-xs font-normal text-slate-500">JPG, PNG, WebP, or AVIF up to 8 MB.</span>
                </label>
                {form.banner_url && (
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <img src={form.banner_url} alt="Project banner preview" className="h-28 w-48 rounded-lg object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, banner_url: null, banner_public_id: null })} className="text-sm font-semibold text-red-700">Remove banner</button>
                  </div>
                )}
                {uploadingBanner && <p className="mt-2 text-sm text-forest-700" role="status">{bannerUploadStep}</p>}
              </div>

              <label className="text-sm font-semibold">Project status <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal"><option value="planned">Planned</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></label>
              <label className="text-sm font-semibold">Program category {requiredMark()}
                <select required value={form.program_id || ''} disabled={programsLoading || Boolean(programsLoadError)} onChange={(event) => setForm({ ...form, program_id: event.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal">
                  <option value="" disabled>{programsLoading ? 'Loading programs...' : programsLoadError ? 'Programs could not be loaded' : programs.some((p) => p.publication_status === 'published') ? 'Select a program' : 'Create a program first'}</option>
                  {programs.filter((p) => p.publication_status === 'published' || p.id === form.program_id).map((program) => (<option key={program.id} value={program.id}>{program.name}</option>))}
                </select>
                {programsLoadError ? (<span className="mt-1 block text-xs font-normal text-red-700">{programsLoadError} <button type="button" onClick={() => { setProgramsLoading(true); setProgramsLoadError(''); request('/admin/programs').then(setPrograms).catch((error) => setProgramsLoadError(getAdminErrorMessage(error))).finally(() => setProgramsLoading(false)); }} className="font-semibold underline">Try again</button></span>) : !programsLoading && !programs.some((p) => p.publication_status === 'published' || p.id === form.program_id) ? (<span className="mt-1 block text-xs font-normal text-slate-500">Publish a program before assigning it to a project.</span>) : null}
              </label>
              <label className="text-sm font-semibold">Publication <select value={form.publication_status} onChange={(e) => setForm({ ...form, publication_status: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              <label className="text-sm font-semibold">Start date <input type="date" value={form.starts_on || ''} onChange={(e) => setForm({ ...form, starts_on: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" /></label>
              <label className="text-sm font-semibold">End date <input type="date" value={form.ends_on || ''} onChange={(e) => setForm({ ...form, ends_on: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5 font-normal" /></label>
              <div className="sm:col-span-2"><button disabled={busy || uploadingBanner} className="rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white">{busy ? 'Saving...' : editing ? 'Save changes' : 'Create project'}</button></div>
            </form>

            <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="border-b p-4"><h2 className="font-bold text-forest-900">All projects <span className="font-normal text-slate-500">({rows.length})</span></h2></div>
              {rowsLoading ? <p role="status" className="p-6 text-sm text-slate-500">Loading projects...</p> : rowsLoadError ? (<div className="p-6"><p role="alert" className="text-sm text-red-800">{rowsLoadError}</p><button type="button" onClick={refreshProjects} className="mt-3 rounded-lg border px-3 py-2 text-sm font-semibold text-forest-800">Try again</button></div>) : rows.length === 0 ? (<p className="p-6 text-sm text-slate-500">No projects yet. Create the first one above.</p>) : (
                <div className="divide-y">
                  {rows.map((p) => (
                    <article key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-4">
                        {p.banner_url && <img src={p.banner_url} alt="" className="h-14 w-24 rounded-md object-cover" />}
                        <div><h3 className="font-semibold text-slate-900">{p.title}</h3><p className="text-sm text-slate-500">/{p.slug} | {p.program?.name || 'Uncategorized'} | {p.status} | {p.publication_status}</p></div>
                      </div>
                      <div className="flex gap-2"><button onClick={() => editProject(p)} className="rounded border px-3 py-1.5 text-sm">Edit</button><button onClick={() => deleteProject(p)} className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-700">Delete</button></div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {tab === 'newsletter' && (
          <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b p-4"><h2 className="font-bold text-forest-900">Newsletter subscribers <span className="font-normal text-slate-500">({rows.length})</span></h2></div>
            {rows.length === 0 ? <p className="p-6 text-sm text-slate-500">No subscribers yet, or your account needs the admin role to view this list.</p> : (
              <div className="divide-y">{rows.map((x) => (<div key={x.id} className="flex flex-wrap justify-between gap-2 p-4"><a className="text-sm font-medium text-forest-700 underline" href={`mailto:${x.email}`}>{x.email}</a><span className="text-xs text-slate-500">Subscribed {new Date(x.created_at).toLocaleDateString()}</span></div>))}</div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}