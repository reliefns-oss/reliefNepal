'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  rating: z.number().min(1, 'Please select a rating'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(), // honeypot
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function FeedbackPopup() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      rating: 0,
      subject: '',
      message: '',
      website: '',
    },
  });

  const rating = watch('rating');

  // Portal needs the browser's document, so wait until mounted on the client.
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpen = () => setIsOpen(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    reset();
    setSubmitted(false);
    // Return focus to the floating button
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, [reset]);

  // Escape to close + focus trap + focus first field
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const t = setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>('#feedback-name, #feedback-popup-close')
        ?.focus();
    }, 100);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, submitted, handleClose]);

  async function onSubmit(values: FeedbackFormData) {
    if (values.website) {
      // Honeypot triggered
      reset();
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS not configured');
      }

      const response = await fetch(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: values.name.trim(),
              reply_to: values.email.trim(),
              email: values.email.trim(),
              subject: `[Feedback] ${values.subject.trim()}`,
              message: values.message.trim(),
              rating: values.rating,
              time: new Date().toLocaleString('en-NP', {
                timeZone: 'Asia/Kathmandu',
              }),
            },
          }),
        },
      );

      if (!response.ok) throw new Error('EmailJS rejected the message.');

      reset();
      setSubmitted(true);
    } catch {
      alert(
        'We could not send your feedback. Please try again or email info@reliefnepal.org.np.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted) return null;

  const content = (
    <>
      {/* Floating trigger button: always pinned to the bottom-right of the viewport */}
      {!isOpen && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
          }}
          className="rounded-full bg-forest-700 p-4 shadow-xl text-white hover:bg-forest-900 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
          aria-label="Open feedback form"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Success dialog */}
      {isOpen && submitted && (
        <div
          ref={dialogRef}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
          }}
          className="w-[calc(100vw-3rem)] max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-success-title"
        >
          <button
            id="feedback-popup-close"
            type="button"
            className="absolute top-3 right-3 z-10 rounded-full p-1 text-slate-400 transition hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-forest-500"
            onClick={handleClose}
            aria-label="Close feedback popup"
          >
            <X size={24} />
          </button>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
            <CheckCircle size={32} className="text-forest-700" />
          </div>
          <h2
            id="feedback-success-title"
            className="text-2xl font-bold text-forest-900"
          >
            Thank you for your feedback!
          </h2>
          <p className="mt-3 text-slate-600">
            We appreciate you taking the time to share your thoughts with us.
            Your feedback helps us improve our work.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-6 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-900"
          >
            Close
          </button>
        </div>
      )}

      {/* Feedback form dialog */}
      {isOpen && !submitted && (
        <div
          ref={dialogRef}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
          }}
          className="w-[calc(100vw-3rem)] max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-popup-title"
        >
          <button
            id="feedback-popup-close"
            type="button"
            className="absolute top-3 right-3 z-10 rounded-full p-1 text-slate-400 transition hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-forest-500"
            onClick={handleClose}
            aria-label="Close feedback popup"
          >
            <X size={24} />
          </button>

          <div className="mb-6 text-center">
            <h2
              id="feedback-popup-title"
              className="text-xl font-bold text-forest-900"
            >
              We value your feedback
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Help us improve by sharing your experience with Relief Nepal
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div>
              <label
                htmlFor="feedback-name"
                className="block text-sm font-medium text-slate-700"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="feedback-name"
                type="text"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? 'feedback-name-error' : undefined
                }
                className="mt-1 w-full min-h-11 rounded-lg border border-forest-100 bg-white px-3 text-slate-900 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
                {...register('name')}
              />
              {errors.name && (
                <p
                  id="feedback-name-error"
                  role="alert"
                  className="mt-1 text-sm text-red-700"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="feedback-email"
                className="block text-sm font-medium text-slate-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="feedback-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'feedback-email-error' : undefined
                }
                className="mt-1 w-full min-h-11 rounded-lg border border-forest-100 bg-white px-3 text-slate-900 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
                {...register('email')}
              />
              {errors.email && (
                <p
                  id="feedback-email-error"
                  role="alert"
                  className="mt-1 text-sm text-red-700"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-700">
                Your experience <span className="text-red-500">*</span>
              </span>
              <div
                className="mt-2 flex items-center gap-2"
                role="radiogroup"
                aria-label="Rating"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    onClick={() =>
                      setValue('rating', star, { shouldValidate: true })
                    }
                    className="flex-shrink-0 p-1 text-2xl transition-colors"
                    style={{ color: rating >= star ? '#166534' : '#d1d5db' }}
                  >
                    <Star
                      size={28}
                      fill={rating >= star ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="feedback-subject"
                className="block text-sm font-medium text-slate-700"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="feedback-subject"
                type="text"
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? 'feedback-subject-error' : undefined
                }
                className="mt-1 w-full min-h-11 rounded-lg border border-forest-100 bg-white px-3 text-slate-900 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
                {...register('subject')}
              />
              {errors.subject && (
                <p
                  id="feedback-subject-error"
                  role="alert"
                  className="mt-1 text-sm text-red-700"
                >
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="feedback-message"
                className="block text-sm font-medium text-slate-700"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback-message"
                rows={4}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'feedback-message-error' : undefined
                }
                className="mt-1 w-full min-h-11 rounded-lg border border-forest-100 bg-white px-3 py-3 text-slate-900 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
                {...register('message')}
              />
              {errors.message && (
                <p
                  id="feedback-message-error"
                  role="alert"
                  className="mt-1 text-sm text-red-700"
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <label>
                Leave this field empty
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('website')}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-11 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-900 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? (
                'Sending…'
              ) : (
                <>
                  <Send size={16} className="mr-2 inline" aria-hidden="true" />
                  Send feedback
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              Your feedback is sent directly to the Relief Nepal team by email.
            </p>
          </form>
        </div>
      )}
    </>
  );

  // Render directly into <body> so no parent transform/overflow can break `fixed`.
  return createPortal(content, document.body);
}
