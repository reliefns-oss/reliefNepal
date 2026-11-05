'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  getAdminErrorMessage,
  getImageUploadErrorMessage,
} from '../../lib/admin-feedback.js';
import { useToast } from '../../components/ui/Toast.jsx';

const definitions = {
  gallery: {
    heading: 'Gallery',
    singular: 'gallery item',
    path: 'gallery',
    blank: {
      title: '',
      media_type: 'photo',
      media_url: '',
      media_public_id: null,
      project_id: '',
      thumbnail_url: '',
      alt_text: '',
      caption: '',
      publication_status: 'draft',
    },
    fields: [
      ['project_id', 'Project', 'project'],
      ['title', 'Title', 'text'],
      ['media_type', 'Media type', 'select:photo,video,audio'],
      ['media_url', 'Media URL (YouTube link for videos)', 'url'],
      ['thumbnail_url', 'Thumbnail URL (optional)', 'url'],
      ['alt_text', 'Image description (photos)', 'text'],
      ['caption', 'Caption', 'textarea'],
      ['publication_status', 'Publication', 'select:draft,published,archived'],
    ],
    label: (item) => `${item.media_type} | ${item.publication_status}`,
  },
  networks: {
    heading: 'Networks and partners',
    singular: 'network',
    path: 'networks',
    blank: {
      name: '',
      slug: '',
      relationship_type: 'local_district',
      short_description: '',
      description: '',
      location: '',
      website_url: '',
      logo_url: '',
      logo_public_id: null,
      public_contact_email: '',
      collaboration_context: '',
      collaboration_areas: '',
      display_order: 0,
      publication_status: 'draft',
    },
    fields: [
      ['name', 'Organization name', 'text'],
      ['slug', 'Profile URL slug (generated from name; editable)', 'slug'],
      [
        'relationship_type',
        'Partner category',
        'select:local_district,resource_provider',
      ],
      ['logo_url', 'Partner logo (optional)', 'partner-logo'],
      ['short_description', 'Short introduction', 'textarea'],
      ['description', 'Full description', 'textarea'],
      ['location', 'Location (optional)', 'text'],
      ['website_url', 'Website URL (optional)', 'url'],
      ['public_contact_email', 'Public contact email (optional)', 'email'],
      ['collaboration_context', 'How we work together (optional)', 'textarea'],
      ['collaboration_areas', 'Collaboration areas (optional)', 'textarea'],
      ['display_order', 'Display order (lower numbers appear first)', 'number'],
      ['publication_status', 'Publication', 'select:draft,published,archived'],
    ],
    label: (item) =>
      `${item.relationship_type === 'local_district' ? 'Local / District Partner' : 'Resource Provider / Partner'} | ${item.publication_status}`,
  },
  notices: {
    heading: 'Notices',
    singular: 'notice',
    path: 'notices',
    blank: {
      slug: '',
      title: '',
      body: '',
      attachment_url: '',
      image_url: null,
      image_public_id: null,
      publication_status: 'draft',
    },
    fields: [
      ['title', 'Title', 'text'],
      ['slug', 'URL slug (generated from title; editable)', 'slug'],
      ['image_url', 'Notice photo', 'notice-photo'],
      ['body', 'Notice details', 'textarea'],
      ['attachment_url', 'Attachment URL (optional)', 'url'],
      ['publication_status', 'Publication', 'select:draft,published,archived'],
    ],
    label: (item) => item.publication_status,
  },
  vacancies: {
    heading: 'Vacancies',
    singular: 'vacancy',
    path: 'vacancies',
    blank: {
      slug: '',
      title: '',
      job_type: 'full-time',
      job_level: 'entry',
      location: '',
      number_of_vacancies: 1,
      work_schedule: '',
      hours_per_week: '',
      duration: '',
      description: '',
      responsibilities: '',
      qualifications: '',
      benefits: '',
      application_instructions: '',
      application_email: '',
      application_url: '',
      application_deadline: '',
      status: 'draft',
      published_at: '',
    },
    fields: [
      ['title', 'Job title', 'text'],
      ['slug', 'URL slug (generated from title; editable)', 'slug'],
      [
        'job_type',
        'Job type',
        'select:full-time,part-time,contract,internship,consultancy,temporary',
      ],
      [
        'job_level',
        'Job level',
        'select:entry,junior,mid,senior,lead,manager,director,other',
      ],
      ['location', 'Job location', 'text'],
      ['number_of_vacancies', 'Number of vacancies', 'number'],
      ['work_schedule', 'Working hours / schedule', 'text'],
      ['hours_per_week', 'Hours per week (optional)', 'number'],
      ['duration', 'Employment duration (optional)', 'text'],
      ['application_deadline', 'Application deadline', 'date'],
      ['description', 'Job description', 'textarea'],
      ['responsibilities', 'Responsibilities (optional)', 'textarea'],
      ['qualifications', 'Qualifications / requirements', 'textarea'],
      ['benefits', 'Benefits (optional)', 'textarea'],
      ['application_instructions', 'How to apply', 'textarea'],
      [
        'application_email',
        'Application email (or use the URL below)',
        'email',
      ],
      ['application_url', 'Application URL', 'url'],
      ['status', 'Status', 'select:draft,open,closed,archived'],
    ],
    label: (item) => `${item.job_type} | ${item.status}`,
  },
  'board-members': {
    heading: 'Board Members',
    singular: 'board member',
    path: 'board-members',
    blank: {
      sn: 1,
      name: '',
      qualification: '',
      expertise: '',
      designation: '',
      contact: '',
      email: '',
      experience: 0,
      photo_url: '',
      photo_public_id: null,
      display_order: 0,
      is_active: true,
    },
    fields: [
      ['sn', 'Serial No. (unique)', 'number'],
      ['name', 'Full name', 'text'],
      ['qualification', 'Qualification', 'text'],
      ['expertise', 'Sectoral expertise', 'text'],
      ['designation', 'Designation', 'text'],
      ['contact', 'Contact number', 'text'],
      ['email', 'Email', 'email'],
      ['experience', 'Years of experience', 'number'],
      ['photo_url', 'Board member photo', 'board-photo'],
      ['display_order', 'Display order', 'number'],
      ['is_active', 'Active (show on website)', 'select:true,false'],
    ],
    label: (item) =>
      `${item.designation} | ${item.is_active ? 'Active' : 'Inactive'}`,
  },
  procurement: {
    heading: 'Procurement',
    singular: 'procurement item',
    path: 'procurement',
    blank: {
      title: '',
      slug: '',
      reference_number: '',
      category: 'goods',
      description: '',
      requirements: '',
      submission_instructions: '',
      submission_email: '',
      submission_url: '',
      attachment_url: '',
      deadline: '',
      status: 'draft',
      location: '',
      duration: '',
      work_schedule: '',
      display_order: 0,
      publication_status: 'draft',
    },
    fields: [
      ['title', 'Procurement title', 'text'],
      ['slug', 'URL slug (generated from title; editable)', 'slug'],
      ['reference_number', 'Reference number', 'text'],
      [
        'category',
        'Category',
        'select:goods,services,works,general',
      ],
      ['description', 'Description', 'textarea'],
      ['requirements', 'Requirements / Specifications', 'textarea'],
      ['submission_instructions', 'Submission instructions', 'textarea'],
      [
        'submission_email',
        'Submission email',
        'email',
      ],
      ['submission_url', 'Submission URL (optional)', 'url'],
      ['attachment_url', 'Attachment (PDF, DOC, etc.)', 'procurement-attachment'],
      ['deadline', 'Submission deadline', 'date'],
      [
        'status',
        'Status',
        'select:draft,open,closed,awarded,cancelled',
      ],
      ['location', 'Location (optional)', 'text'],
      ['duration', 'Duration / Contract period (optional)', 'text'],
      ['work_schedule', 'Work schedule / Timeline (optional)', 'text'],
      ['display_order', 'Display order (lower numbers appear first)', 'number'],
      [
        'publication_status',
        'Publication',
        'select:draft,published,archived',
      ],
    ],
    label: (item) => `${item.category} | ${item.status} | ${item.publication_status}`,
  },
  programs: {
    heading: 'Programs',
    singular: 'program',
    path: 'programs',
    blank: {
      slug: '',
      name: '',
      description: '',
      publication_status: 'draft',
    },
    fields: [
      ['name', 'Program name', 'text'],
      ['slug', 'URL slug (generated from name; editable)', 'slug'],
      ['description', 'Description', 'textarea'],
      ['publication_status', 'Publication', 'select:draft,published,archived'],
    ],
    label: (item) => item.publication_status,
  },
};

const requiredFields = {
  gallery: ['project_id', 'title', 'media_type'],
  networks: [
    'name',
    'slug',
    'relationship_type',
    'short_description',
    'description',
  ],
  notices: ['title', 'slug'],
  vacancies: [
    'title',
    'slug',
    'job_type',
    'job_level',
    'location',
    'number_of_vacancies',
    'description',
    'qualifications',
  ],
  'board-members': [
    'sn',
    'name',
    'qualification',
    'expertise',
    'designation',
    'contact',
    'email',
    'experience',
  ],
  procurement: [
    'title',
    'slug',
    'reference_number',
    'category',
    'description',
    'requirements',
    'submission_instructions',
    'submission_email',
    'deadline',
    'status',
  ],
  programs: ['name', 'slug'],
};

function isRequiredField(type, key, form) {
  if (type === 'gallery' && key === 'media_url')
    return form.media_type !== 'photo';
  if (type === 'vacancies' && form.status === 'open') {
    if (key === 'application_email')
      return !form.application_email && !form.application_url;
  }
  return requiredFields[type]?.includes(key) || false;
}

function requiredMark(required) {
  return required ? (
    <span className="ml-1 font-bold text-red-600" aria-hidden="true">
      *
    </span>
  ) : null;
}

function slugFromTitle(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

function titleFromFilename(filename) {
  const title = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
  return title.length >= 2 ? title : 'Project photo';
}

export default function AdminContentSection({ type, request }) {
  const config = definitions[type];
  const collectionPath = config.path;
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsLoadError, setItemsLoadError] = useState('');
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(type === 'gallery');
  const [projectsLoadError, setProjectsLoadError] = useState('');
  const [form, setForm] = useState(config.blank);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkCategory, setNetworkCategory] = useState('all');
  const pendingPhotosRef = useRef(pendingPhotos);
  const { toast } = useToast();

  // Reset form when type changes (e.g., switching tabs)
  useEffect(() => {
    setForm(definitions[type].blank);
    setEditing(null);
  }, [type]);

  useEffect(() => {
    pendingPhotosRef.current = pendingPhotos;
  }, [pendingPhotos]);

  useEffect(
    () => () => {
      pendingPhotosRef.current.forEach((photo) =>
        URL.revokeObjectURL(photo.previewUrl),
      );
    },
    [],
  );

  function showMessage(text, tone = 'success') {
    toast({
      title: tone === 'success' ? 'Success' : tone === 'error' ? 'Error' : tone === 'warning' ? 'Warning' : 'Info',
      description: text,
      type: tone,
      duration: tone === 'error' ? 8000 : 5000,
    });
  }

  async function refresh() {
    setItemsLoading(true);
    try {
      setItems(await request(`/admin/${collectionPath}`));
      setItemsLoadError('');
      return true;
    } catch (error) {
      setItemsLoadError(getAdminErrorMessage(error));
      return false;
    } finally {
      setItemsLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    setItemsLoading(true);
    request(`/admin/${collectionPath}`)
      .then((data) => {
        if (active) {
          setItems(data);
          setItemsLoadError('');
        }
      })
      .catch((error) => {
        if (active) setItemsLoadError(getAdminErrorMessage(error));
      })
      .finally(() => {
        if (active) setItemsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [collectionPath, request]);

  useEffect(() => {
    if (type !== 'gallery') return undefined;
    let active = true;
    setProjectsLoading(true);
    setProjectsLoadError('');
    request('/admin/projects')
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch((error) => {
        if (active) {
          setProjectsLoadError(getAdminErrorMessage(error));
        }
      })
      .finally(() => {
        if (active) setProjectsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [request, type]);

  async function uploadImage(file, purpose, onStep = () => {}) {
    onStep('Preparing secure upload…');
    const signed = await request('/admin/uploads/sign', {
      method: 'POST',
      body: JSON.stringify({ purpose, mime_type: file.type }),
    });
    onStep('Uploading to image storage…');
    // Use FileReader.readAsDataURL() instead of btoa to avoid "Maximum call stack size exceeded" with binary data
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
    onStep('Verifying photo…');
    return request('/admin/uploads/verify', {
      method: 'POST',
      body: JSON.stringify({
        public_id: signed.public_id,
        secure_url: uploaded.media_url || uploaded.image_url || uploaded.logo_url || uploaded.banner_url,
      }),
    });
  }

  async function uploadPhoto(file, purpose = 'gallery-photo') {
    if (!file) return;

    // Define allowed types per purpose
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    const docTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const isDocPurpose = purpose === 'procurement-attachment';
    const allowedTypes = isDocPurpose ? [...imageTypes, ...docTypes] : imageTypes;
    const maxSize = 16 * 1024 * 1024; // 16 MB for documents

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      if (isDocPurpose) {
        showMessage(
          'Choose a PDF, Word, Excel, or image file smaller than 16 MB.',
          'error',
        );
      } else {
        showMessage(
          'Choose a JPG, PNG, WebP, or AVIF image smaller than 8 MB.',
          'error',
        );
      }
      return;
    }
    setUploading(true);
    showMessage('');
    try {
      const media = await uploadImage(file, purpose, setUploadStep);
      setForm((current) => ({
        ...current,
        ...media,
        ...(purpose === 'gallery-photo' ? { media_type: 'photo' } : {}),
      }));
      showMessage(
        purpose === 'notice-photo'
          ? 'Notice photo uploaded. Save the notice to keep it.'
          : purpose === 'partner-logo'
            ? 'Partner logo uploaded. Save the profile to keep it.'
            : purpose === 'procurement-attachment'
              ? 'Attachment uploaded. Save the procurement item to publish it.'
              : 'Photo uploaded. Save the gallery item to publish it.',
      );
    } catch (error) {
      showMessage(getImageUploadErrorMessage(error), 'error');
    } finally {
      setUploading(false);
      setUploadStep('');
    }
  }

  function selectGalleryPhotos(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const validFiles = files.filter(
      (file) =>
        ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(
          file.type,
        ) && file.size <= 8 * 1024 * 1024,
    );
    const rejectedCount = files.length - validFiles.length;
    const stagedPhotos = validFiles.map((file) => {
      const title = titleFromFilename(file.name);
      return {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title,
        alt_text: title,
        media: null,
      };
    });

    if (stagedPhotos.length > 0) {
      setPendingPhotos((current) => [...current, ...stagedPhotos]);
      showMessage(
        `${stagedPhotos.length} ${stagedPhotos.length === 1 ? 'photo is' : 'photos are'} ready. Review the titles, then save the batch.`,
        rejectedCount > 0 ? 'warning' : 'success',
      );
    }
    if (rejectedCount > 0) {
      showMessage(
        `${rejectedCount} file${rejectedCount === 1 ? ' was' : 's were'} skipped. Choose JPG, PNG, WebP, or AVIF photos smaller than 8 MB.`,
        stagedPhotos.length > 0 ? 'warning' : 'error',
      );
    }
  }

  function updatePendingPhoto(id, key, value) {
    setPendingPhotos((current) =>
      current.map((photo) =>
        photo.id === id ? { ...photo, [key]: value } : photo,
      ),
    );
  }

  function removePendingPhoto(id) {
    setPendingPhotos((current) => {
      const photo = current.find((item) => item.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  async function savePhotoBatch() {
    const batch = [...pendingPhotos];
    let savedCount = 0;
    setBusy(true);
    setUploading(true);
    showMessage('');

    try {
      for (const [index, photo] of batch.entries()) {
        let media = photo.media;
        if (!media) {
          media = await uploadImage(photo.file, 'gallery-photo', (step) =>
            setUploadStep(`Photo ${index + 1} of ${batch.length}: ${step}`),
          );
          setPendingPhotos((current) =>
            current.map((item) =>
              item.id === photo.id ? { ...item, media } : item,
            ),
          );
        }

        setUploadStep(`Saving photo ${index + 1} of ${batch.length}…`);
        const saved = await request('/admin/gallery', {
          method: 'POST',
          body: JSON.stringify({
            project_id: form.project_id,
            title: photo.title.trim(),
            media_type: 'photo',
            ...media,
            alt_text: photo.alt_text.trim(),
            caption: form.caption,
            publication_status: form.publication_status,
          }),
        });

        setItems((current) => [saved, ...current]);
        setPendingPhotos((current) =>
          current.filter((item) => item.id !== photo.id),
        );
        URL.revokeObjectURL(photo.previewUrl);
        savedCount += 1;
      }

      setForm(config.blank);
      const refreshed = await refresh();
      showMessage(
        refreshed
          ? `${savedCount} ${savedCount === 1 ? 'photo was' : 'photos were'} saved to the gallery.`
          : `${savedCount} ${savedCount === 1 ? 'photo was' : 'photos were'} saved, but the list could not refresh. Use “Try again” to reload it.`,
        refreshed ? 'success' : 'warning',
      );
    } catch (error) {
      const remainingCount = batch.length - savedCount;
      const detail = getImageUploadErrorMessage(error);
      showMessage(
        savedCount > 0
          ? `${savedCount} ${savedCount === 1 ? 'photo was' : 'photos were'} saved. ${remainingCount} remain ready to retry. ${detail}`
          : detail,
        savedCount > 0 ? 'warning' : 'error',
      );
    } finally {
      setBusy(false);
      setUploading(false);
      setUploadStep('');
    }
  }

  async function save(event) {
    event.preventDefault();
    if (
      type === 'gallery' &&
      form.media_type === 'photo' &&
      !editing &&
      pendingPhotos.length > 0
    ) {
      await savePhotoBatch();
      return;
    }
    setBusy(true);
    showMessage('');
    try {
      const saved = await request(
        editing
          ? `/admin/${collectionPath}/${editing}`
          : `/admin/${collectionPath}`,
        { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(form) },
      );
      setItems((current) =>
        editing
          ? current.map((item) => (item.id === editing ? saved : item))
          : [saved, ...current],
      );
      setForm(config.blank);
      setEditing(null);
      const refreshed = await refresh();
      showMessage(
        refreshed
          ? `${config.singular} saved.`
          : `${config.singular} saved, but the list could not refresh. Use “Try again” to reload it.`,
        refreshed ? 'success' : 'warning',
      );
    } catch (error) {
      showMessage(getAdminErrorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  }
  function edit(item) {
    setEditing(item.id);
    setForm({ ...config.blank, ...item });
    showMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function updateField(key, value) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'media_type' && value !== current.media_type) {
        next.media_url = '';
        next.thumbnail_url = '';
        next.media_public_id = null;
      }
      if (key === 'media_url' && value !== current.media_url)
        next.media_public_id = null;
      return next;
    });
  }
  async function remove(item) {
    const label = item.title || item.name;
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    try {
      await request(`/admin/${collectionPath}/${item.id}`, {
        method: 'DELETE',
      });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      const refreshed = await refresh();
      showMessage(
        refreshed
          ? `${config.singular} deleted.`
          : `${config.singular} deleted, but the list could not refresh. Use “Try again” to reload it.`,
        refreshed ? 'success' : 'warning',
      );
    } catch (error) {
      showMessage(getAdminErrorMessage(error), 'error');
    }
  }

  const galleryGroups =
    type === 'gallery'
      ? [...new Set(items.map((item) => item.project_id).filter(Boolean))]
          .map((projectId) => ({
            project:
              projects.find((item) => item.id === projectId) ||
              items.find((item) => item.project_id === projectId)?.project,
            items: items.filter((item) => item.project_id === projectId),
          }))
          .filter((group) => group.project)
      : [];
  const unassignedGalleryItems =
    type === 'gallery' ? items.filter((item) => !item.project_id) : [];
  const visibleNetworkItems =
    type === 'networks'
      ? items.filter((item) => {
          const matchesCategory =
            networkCategory === 'all' ||
            item.relationship_type === networkCategory;
          return (
            matchesCategory &&
            item.name.toLocaleLowerCase().includes(networkSearch.trim().toLocaleLowerCase())
          );
        })
      : items;

  function renderItem(item) {
    return (
      <article
        key={item.id}
        className="flex flex-wrap items-center justify-between gap-3 p-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          {((item.media_type === 'photo' && item.media_url) ||
            item.image_url ||
            item.logo_url) && (
            <img
              src={item.media_url || item.image_url || item.logo_url}
              alt=""
              className={`h-12 w-20 rounded bg-white ${item.logo_url ? 'object-contain p-1' : 'object-cover'}`}
            />
          )}
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {item.title || item.name}
            </h3>
            <p className="text-sm capitalize text-slate-500">
              {config.label(item)}
            </p>
            {type === 'networks' && item.updated_at && (
              <time
                dateTime={item.updated_at}
                className="mt-1 block text-xs text-slate-400"
              >
                Updated {new Date(item.updated_at).toLocaleDateString()}
              </time>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => edit(item)}
            disabled={busy || pendingPhotos.length > 0}
            className="rounded border px-3 py-1.5 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => remove(item)}
            disabled={busy || pendingPhotos.length > 0}
            className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-700"
          >
            Delete
          </button>
        </div>
      </article>
    );
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <form onSubmit={save} className="h-fit rounded-xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-forest-900">
            {editing ? `Edit ${config.singular}` : `Add ${config.singular}`}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(config.blank);
              }}
              className="text-sm text-slate-600"
            >
              Cancel
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          <span className="mr-1 font-bold text-red-600" aria-hidden="true">
            *
          </span>
          Required fields
        </p>
        {type === 'vacancies' && (
          <p className="mt-1 text-xs text-slate-500">
            Open roles need at least one application email or URL.
          </p>
        )}

        <fieldset
          aria-label={`${config.heading} fields`}
          className="contents"
          disabled={busy || uploading}
        >
          {config.fields.map(([key, label, kind]) => {
            const required =
              type === 'gallery' &&
              pendingPhotos.length > 0 &&
              ['title', 'alt_text'].includes(key)
                ? false
                : isRequiredField(type, key, form);
            if (
              type === 'gallery' &&
              pendingPhotos.length > 0 &&
              ['title', 'alt_text'].includes(key)
            )
              return null;
            if (kind === 'project')
              return (
                <label key={key} className="mt-4 block text-sm font-semibold">
                  {label}
                  {requiredMark(required)}
                  <select
                    required
                    value={form.project_id || ''}
                    disabled={pendingPhotos.length > 0}
                    onChange={(event) => updateField(key, event.target.value)}
                    className="mt-1 w-full rounded-lg border p-2.5 font-normal"
                  >
                    <option value="" disabled>
                      Choose a project
                    </option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title} · {project.publication_status}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    Every gallery item belongs to a project. Publish the project
                    and its items when they are ready for the website.
                    {pendingPhotos.length > 0 &&
                      ' Save or remove the selected photos before changing projects.'}
                  </span>
                </label>
              );
            if (type === 'gallery' && key === 'media_url')
              return (
                <div key={key} className="mt-4">
                  {form.media_type === 'photo' ? (
                    <>
                      <label className="block text-sm font-semibold">
                        {editing ? 'Upload replacement photo' : 'Choose photos'}
                        {requiredMark(
                          !form.media_url && pendingPhotos.length === 0,
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          multiple={!editing}
                          disabled={busy || uploading || !form.project_id}
                          onChange={(event) => {
                            const input = event.currentTarget;
                            const files = Array.from(input.files || []);
                            input.value = '';
                            if (editing) uploadPhoto(files[0]);
                            else selectGalleryPhotos(files);
                          }}
                          className="mt-1 block w-full rounded-lg border p-2.5 font-normal"
                        />
                      </label>
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        {editing
                          ? 'Choose one JPG, PNG, WebP, or AVIF photo, up to 8 MB.'
                          : 'Select one or more JPG, PNG, WebP, or AVIF photos. Each can be up to 8 MB; titles are suggested from filenames.'}
                      </span>
                      {pendingPhotos.length > 0 && (
                        <section
                          className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3"
                          aria-label="Selected photos"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-sm font-bold text-forest-900">
                              {pendingPhotos.length} selected{' '}
                              {pendingPhotos.length === 1 ? 'photo' : 'photos'}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Review the titles, then save the batch.
                            </p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {pendingPhotos.map((photo, index) => (
                              <article
                                className="overflow-hidden rounded-lg border bg-white"
                                key={photo.id}
                              >
                                <img
                                  src={photo.previewUrl}
                                  alt=""
                                  className="h-36 w-full object-cover"
                                />
                                <div className="space-y-2 p-3">
                                  <label className="block text-xs font-semibold text-slate-700">
                                    Photo {index + 1} title
                                    <span
                                      className="ml-1 text-red-600"
                                      aria-hidden="true"
                                    >
                                      *
                                    </span>
                                    <input
                                      required
                                      minLength={2}
                                      maxLength={180}
                                      value={photo.title}
                                      onChange={(event) =>
                                        updatePendingPhoto(
                                          photo.id,
                                          'title',
                                          event.target.value,
                                        )
                                      }
                                      className="mt-1 w-full rounded-md border p-2 text-sm font-normal"
                                    />
                                  </label>
                                  <label className="block text-xs font-semibold text-slate-700">
                                    Image description (alt text)
                                    <input
                                      maxLength={500}
                                      value={photo.alt_text}
                                      onChange={(event) =>
                                        updatePendingPhoto(
                                          photo.id,
                                          'alt_text',
                                          event.target.value,
                                        )
                                      }
                                      className="mt-1 w-full rounded-md border p-2 text-sm font-normal"
                                    />
                                  </label>
                                  {!photo.media && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removePendingPhoto(photo.id)
                                      }
                                      className="text-xs font-semibold text-red-700"
                                    >
                                      Remove from batch
                                    </button>
                                  )}
                                  {photo.media && (
                                    <p className="text-xs font-medium text-forest-700">
                                      Uploaded and ready to save
                                    </p>
                                  )}
                                </div>
                              </article>
                            ))}
                          </div>
                        </section>
                      )}
                      {form.media_url && (
                        <img
                          src={form.media_url}
                          alt="Gallery preview"
                          className="mt-3 h-36 w-full rounded-lg object-cover"
                        />
                      )}
                    </>
                  ) : (
                    <label className="block text-sm font-semibold">
                      {form.media_type === 'video'
                        ? 'YouTube URL'
                        : 'Audio URL'}
                      {requiredMark(required)}
                      <input
                        type="url"
                        required={required}
                        value={form.media_url}
                        onChange={(event) =>
                          updateField('media_url', event.target.value)
                        }
                        className="mt-1 w-full rounded-lg border p-2.5 font-normal"
                        placeholder="https://..."
                      />
                      <span className="mt-1 block text-xs font-normal text-slate-500">
                        {form.media_type === 'video'
                          ? 'Paste a YouTube video link.'
                          : 'Paste a direct HTTPS link to the audio file.'}
                      </span>
                    </label>
                  )}
                  {uploading && (
                    <p role="status" className="mt-2 text-sm text-forest-700">
                      {uploadStep}
                    </p>
                  )}
                </div>
              );
            if (type === 'networks' && key === 'logo_url')
              return (
                <div key={key} className="mt-4">
                  <span className="block text-sm font-semibold">{label}</span>
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    Upload a clear JPG, PNG, WebP, or AVIF logo, up to 8 MB.
                  </p>
                  <label className="mt-2 block text-sm font-normal">
                    Choose logo image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={busy || uploading}
                      onChange={(event) => {
                        const input = event.currentTarget;
                        const file = input.files?.[0];
                        input.value = '';
                        uploadPhoto(file, 'partner-logo');
                      }}
                      className="mt-1 block w-full rounded-lg border p-2.5"
                    />
                  </label>
                  {uploading && (
                    <p role="status" className="mt-2 text-sm text-forest-700">
                      {uploadStep}
                    </p>
                  )}
                  {form.logo_url && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                      <Image
                        src={form.logo_url}
                        alt={`${form.name || 'Partner'} logo preview`}
                        width={96}
                        height={64}
                        unoptimized
                        className="h-16 w-24 rounded bg-white object-contain p-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            logo_url: null,
                            logo_public_id: null,
                          }))
                        }
                        className="text-sm font-semibold text-red-700"
                      >
                        Remove logo
                      </button>
                    </div>
                  )}
                </div>
              );
            if (type === 'notices' && key === 'image_url')
              return (
                <div key={key} className="mt-4">
                  <span className="block text-sm font-semibold">{label}</span>
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    Add an image to display with the published notice.
                  </p>
                  <label className="mt-2 block text-sm">
                    Upload a JPG, PNG, WebP, or AVIF photo (up to 8 MB)
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={uploading}
                      onChange={(event) => {
                        const input = event.currentTarget;
                        const file = input.files?.[0];
                        input.value = '';
                        uploadPhoto(file, 'notice-photo');
                      }}
                      className="mt-1 block w-full rounded-lg border p-2.5 font-normal"
                    />
                  </label>
                  {uploading && (
                    <p role="status" className="mt-2 text-sm text-forest-700">
                      {uploadStep}
                    </p>
                  )}
                  {form.image_url && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={form.image_url}
                        alt={form.title || 'Notice photo preview'}
                        className="h-28 w-44 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            image_url: null,
                            image_public_id: null,
                          }))
                        }
                        className="text-sm font-semibold text-red-700"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>
              );
            if (type === 'board-members' && key === 'photo_url')
              return (
                <div key={key} className="mt-4">
                  <span className="block text-sm font-semibold">{label}</span>
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    Upload a clear JPG, PNG, WebP, or AVIF photo, up to 8 MB.
                  </p>
                  <label className="mt-2 block text-sm">
                    Choose photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={busy || uploading}
                      onChange={(event) => {
                        const input = event.currentTarget;
                        const file = input.files?.[0];
                        input.value = '';
                        uploadPhoto(file, 'board-photo');
                      }}
                      className="mt-1 block w-full rounded-lg border p-2.5"
                    />
                  </label>
                  {uploading && (
                    <p role="status" className="mt-2 text-sm text-forest-700">
                      {uploadStep}
                    </p>
                  )}
                  {form.photo_url && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                      <img
                        src={form.photo_url}
                        alt={`${form.name || 'Board member'} preview`}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            photo_url: '',
                            photo_public_id: null,
                          }))
                        }
                        className="text-sm font-semibold text-red-700"
                      >
                        Remove photo
                      </button>
                    </div>
                  )}
                </div>
              );
            if (type === 'procurement' && key === 'attachment_url')
              return (
                <div key={key} className="mt-4">
                  <span className="block text-sm font-semibold">{label}</span>
                  <p className="mt-1 text-xs font-normal text-slate-500">
                    Upload a PDF, Word, Excel, or image file (up to 16 MB).
                  </p>
                  <label className="mt-2 block text-sm">
                    Choose file
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png,image/webp,image/avif"
                      disabled={busy || uploading}
                      onChange={(event) => {
                        const input = event.currentTarget;
                        const file = input.files?.[0];
                        input.value = '';
                        uploadPhoto(file, 'procurement-attachment');
                      }}
                      className="mt-1 block w-full rounded-lg border p-2.5"
                    />
                  </label>
                  {uploading && (
                    <p role="status" className="mt-2 text-sm text-forest-700">
                      {uploadStep}
                    </p>
                  )}
                  {form.attachment_url && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center gap-3">
                        <svg className="h-10 w-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 6.5L17.5 9H13v-2.5zM9 15H7v-4h2v4zm4 0h-2v-4h2v4zm4 0h-2v-4h2v4z" />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-900">Attachment</p>
                          <p className="text-sm text-slate-500">Ready to publish</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            attachment_url: '',
                            attachment_public_id: null,
                          }))
                        }
                        className="text-sm font-semibold text-red-700"
                      >
                        Remove attachment
                      </button>
                    </div>
                  )}
                </div>
              );
            if (['notices', 'vacancies'].includes(type) && key === 'title')
              return (
                <label key={key} className="mt-4 block text-sm font-semibold">
                  {label}
                  {requiredMark(required)}
                  <input
                    required
                    value={form.title || ''}
                    onChange={(event) => {
                      const title = event.target.value;
                      setForm((current) => ({
                        ...current,
                        title,
                        ...(editing ? {} : { slug: slugFromTitle(title) }),
                      }));
                    }}
                    className="mt-1 w-full rounded-lg border p-2.5 font-normal"
                  />
                </label>
              );
            if (type === 'networks' && key === 'name')
              return (
                <label key={key} className="mt-4 block text-sm font-semibold">
                  {label}
                  {requiredMark(required)}
                  <input
                    required={required}
                    value={form.name || ''}
                    onChange={(event) => {
                      const name = event.target.value;
                      setForm((current) => ({
                        ...current,
                        name,
                        ...(editing ? {} : { slug: slugFromTitle(name) }),
                      }));
                    }}
                    className="mt-1 w-full rounded-lg border p-2.5 font-normal"
                  />
                </label>
              );
            const control = kind.startsWith('select:') ? (
              <select
                required={required}
                disabled={
                  type === 'gallery' &&
                  key === 'media_type' &&
                  pendingPhotos.length > 0
                }
                value={form[key] || ''}
                onChange={(event) => updateField(key, event.target.value)}
                className="mt-1 w-full rounded-lg border p-2.5 font-normal"
              >
                {kind
                  .slice(7)
                  .split(',')
                  .map((value) => (
                    <option key={value} value={value}>
                      {value
                        .replaceAll('-', ' ')
                        .replaceAll('_', ' ')
                        .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                    </option>
                  ))}
              </select>
            ) : kind === 'textarea' ? (
              <textarea
                required={required}
                rows={
                  [
                    'body',
                    'caption',
                    'description',
                    'responsibilities',
                    'qualifications',
                    'benefits',
                    'application_instructions',
                  ].includes(key)
                    ? 5
                    : 3
                }
                value={form[key] || ''}
                onChange={(event) => updateField(key, event.target.value)}
                className="mt-1 w-full rounded-lg border p-2.5 font-normal"
              />
            ) : (
              <input
                type={
                  ['url', 'email', 'date', 'number'].includes(kind)
                    ? kind
                    : 'text'
                }
                min={
                  kind === 'number'
                    ? key === 'number_of_vacancies'
                      ? 1
                      : 0
                    : undefined
                }
                step={
                  kind === 'number'
                    ? key === 'number_of_vacancies'
                      ? 1
                      : 'any'
                    : undefined
                }
                required={required}
                pattern={kind === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined}
                value={form[key] || ''}
                onChange={(event) => updateField(key, event.target.value)}
                className="mt-1 w-full rounded-lg border p-2.5 font-normal"
              />
            );
            return (
              <label key={key} className="mt-4 block text-sm font-semibold">
                {type === 'gallery' &&
                pendingPhotos.length > 0 &&
                key === 'caption'
                  ? 'Shared caption (optional)'
                  : label}
                {requiredMark(required)}
                {control}
                {type === 'gallery' &&
                  pendingPhotos.length > 0 &&
                  key === 'caption' && (
                    <span className="mt-1 block text-xs font-normal text-slate-500">
                      This caption will be added to each selected photo.
                    </span>
                  )}
              </label>
            );
          })}
        </fieldset>
        {type === 'gallery' &&
          !projectsLoading &&
          projects.length === 0 &&
          (projectsLoadError ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              {projectsLoadError}
            </p>
          ) : (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Create a project in the Projects section first. Once it exists,
              you can add its gallery items here.
            </p>
          ))}
        {type === 'gallery' && projectsLoading && (
          <p role="status" className="mt-4 text-sm text-slate-500">
            Loading projects…
          </p>
        )}
        {type === 'gallery' && projectsLoadError && (
          <button
            type="button"
            onClick={() => {
              setProjectsLoading(true);
              setProjectsLoadError('');
              request('/admin/projects')
                .then(setProjects)
                .catch((error) =>
                  setProjectsLoadError(getAdminErrorMessage(error)),
                )
                .finally(() => setProjectsLoading(false));
            }}
            disabled={projectsLoading}
            className="mt-2 text-sm font-semibold text-forest-800 underline disabled:opacity-60"
          >
            {projectsLoading
              ? 'Loading projects…'
              : 'Try loading projects again'}
          </button>
        )}
        <button
          disabled={
            busy ||
            uploading ||
            (type === 'gallery' &&
              form.media_type === 'photo' &&
              !editing &&
              pendingPhotos.length === 0) ||
            (type === 'gallery' &&
              (projectsLoading || projectsLoadError || projects.length === 0))
          }
          className="mt-5 rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy
            ? uploadStep || 'Saving…'
            : type === 'gallery' &&
                form.media_type === 'photo' &&
                !editing &&
                pendingPhotos.length > 0
              ? `Upload and save ${pendingPhotos.length} ${pendingPhotos.length === 1 ? 'photo' : 'photos'}`
              : editing
                ? 'Save changes'
                : `Create ${config.singular}`}
        </button>
      </form>
      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-bold text-forest-900">
            {config.heading}{' '}
            <span className="font-normal text-slate-500">({items.length})</span>
          </h2>
        </div>
        {itemsLoading ? (
          <p role="status" className="p-6 text-sm text-slate-500">
            Loading {config.heading.toLowerCase()}…
          </p>
        ) : itemsLoadError ? (
          <div className="p-6">
            <p role="alert" className="text-sm text-red-800">
              {itemsLoadError}
            </p>
            <button
              type="button"
              onClick={refresh}
              disabled={itemsLoading}
              className="mt-3 rounded-lg border px-3 py-2 text-sm font-semibold text-forest-800"
            >
              {itemsLoading ? 'Loading…' : 'Try again'}
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No items yet. Create one to get started.
          </p>
        ) : type === 'gallery' ? (
          <div className="divide-y">
            {galleryGroups.map(({ project, items: projectItems }) => (
              <section key={project.id}>
                <header className="flex items-center justify-between gap-3 bg-slate-50 px-4 py-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-forest-900">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {project.publication_status} project
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {projectItems.length}{' '}
                    {projectItems.length === 1 ? 'item' : 'items'}
                  </span>
                </header>
                <div className="divide-y">
                  {projectItems.map((item) => renderItem(item))}
                </div>
              </section>
            ))}
            {unassignedGalleryItems.length > 0 && (
              <section>
                <header className="bg-amber-50 px-4 py-3">
                  <h3 className="font-semibold text-amber-900">
                    Needs a project
                  </h3>
                  <p className="text-xs text-amber-800">
                    Edit each legacy item and assign it to an existing project.
                  </p>
                </header>
                <div className="divide-y">
                  {unassignedGalleryItems.map((item) => renderItem(item))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <>
            {type === 'networks' && (
              <div className="flex flex-col gap-3 border-b bg-slate-50 p-4 sm:flex-row">
                <label className="flex-1 text-xs font-semibold text-slate-600">
                  Search partners
                  <input
                    type="search"
                    value={networkSearch}
                    onChange={(event) => setNetworkSearch(event.target.value)}
                    placeholder="Organization name"
                    className="mt-1 block w-full rounded-md border bg-white px-3 py-2 text-sm font-normal text-slate-900"
                  />
                </label>
                <label className="text-xs font-semibold text-slate-600 sm:w-56">
                  Category
                  <select
                    value={networkCategory}
                    onChange={(event) => setNetworkCategory(event.target.value)}
                    className="mt-1 block w-full rounded-md border bg-white px-3 py-2 text-sm font-normal text-slate-900"
                  >
                    <option value="all">All categories</option>
                    <option value="local_district">Local / District Partner</option>
                    <option value="resource_provider">Resource Provider / Partner</option>
                  </select>
                </label>
              </div>
            )}
            {type === 'networks' && visibleNetworkItems.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">
                No partners match those filters. Try another search or category.
              </p>
            ) : (
              <div className="divide-y">
                {(type === 'networks' ? visibleNetworkItems : items).map((item) =>
                  renderItem(item),
                )}
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
}
