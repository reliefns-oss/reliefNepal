'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/api/client';

const feedbackSchema = z.object({
  // Section A: Feedback/Complain
  feedback: z.string().min(10, 'Please enter your feedback or complaint (minimum 10 characters)'),

  // Section B: Confidential - use string from radio, transform to boolean
  isConfidential: z.enum(['true', 'false']).transform(val => val === 'true'),

  // Section C: Personal details (conditional)
  name: z.string().optional(),
  gender: z.preprocess(
    (value) => value === '' ? undefined : value,
    z.enum(['male', 'female', 'others']).optional(),
  ),
  district: z.string().optional(),
  municipality: z.string().optional(),
  wardNo: z.string().optional(),
  village: z.string().optional(),

  // Section D: Want response - use string from radio, transform to boolean
  wantsResponse: z.enum(['true', 'false']).transform(val => val === 'true'),
  mobileNo: z.string().optional(),
  email: z.preprocess(
    (value) => value === '' ? undefined : value,
    z.string().email('Please enter a valid email address').optional(),
  ),

  website: z.string().optional(), // honeypot
}).refine((data) => {
  // If not confidential, name is required
  if (!data.isConfidential && !data.name) return false;
  return true;
}, {
  message: 'Name is required when not confidential',
  path: ['name'],
}).refine((data) => {
  // If wants response, email is required
  if (data.wantsResponse && !data.email) return false;
  return true;
}, {
  message: 'Email is required when you want a response',
  path: ['email'],
}).refine((data) => {
  // If wants response, mobile is required
  if (data.wantsResponse && !data.mobileNo) return false;
  return true;
}, {
  message: 'Mobile number is required when you want a response',
  path: ['mobileNo'],
});

const fieldClass =
  'mt-1 min-h-11 w-full rounded-lg border border-forest-100 bg-white px-3 text-slate-900 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500';

const labelClass = 'block text-sm font-medium text-slate-700';

export default function FeedbackForm() {
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: '',
      isConfidential: 'false',
      name: '',
      gender: '',
      district: '',
      municipality: '',
      wardNo: '',
      village: '',
      wantsResponse: 'false',
      mobileNo: '',
      email: '',
      website: '',
    },
  });

  const isConfidential = watch('isConfidential') === 'true';
  const wantsResponse = watch('wantsResponse') === 'true';

  async function onSubmit(values) {
    setStatus({ state: 'idle', message: '' });

    if (values.website) {
      // Honeypot triggered
      reset();
      setSubmitted(true);
      return;
    }

    setStatus({ state: 'submitting', message: '' });

    try {
      // Submit to backend API
      await apiRequest('/feedback/submit', {
        method: 'POST',
        body: JSON.stringify(values),
      });

      reset();
      setSubmitted(true);
      setStatus({
        state: 'success',
        message: 'Thank you for your feedback! We appreciate you taking the time to share your thoughts with us.',
      });
    } catch (error) {
      setStatus({
        state: 'error',
        message: error.message || 'We could not send your feedback. Please try again or email info@reliefnepal.org.np.',
      });
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
          <CheckCircle size={32} className="text-forest-700" />
        </div>
        <h2 className="text-2xl font-bold text-forest-900">Thank you for your feedback!</h2>
        <p className="mt-3 text-slate-600">
          We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve our work.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-900"
        >
          Submit another feedback
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Header Info */}
      <div className="bg-forest-50 rounded-xl p-4 border border-forest-100">
        <h3 className="text-lg font-bold text-forest-900">सुझाव तथा गुनासो फारम</h3>
        <p className="text-sm text-forest-700 mt-1">Feedback & Complain Form</p>
        <p className="mt-3 text-sm text-slate-600">
          हामि जवाफदेही छौ । त्यसैले तपाईको सुझाव तथा गुनासोहरुलाई सकारात्मक रूपमा स्वीकार गर्दछौ ।
          हामि विश्वास गर्दछौ, तपाईको सुझाव तथा गुनासोहरुको व्यवस्थापन कार्यले हामि प्रतिको विश्वसनीयतालाई अझ उच्च बनाउने छ ।
        </p>
        <p className="mt-2 text-sm text-slate-600">
          We are accountable. Therefore, we accept your suggestions and complaints positively.
          We believe that managing your suggestions and complaints will further enhance our credibility.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          यदि तपाईँ फोन मार्फत आफ्नो सुझाव तथा गुनासो टिपाउन चाहनुहुन्छ भने
          <a href="tel:+9779854089995" className="text-forest-700 underline hover:text-forest-900">
            (+९७७) - ९८५४०८९९९५
          </a>
          मा सम्पर्क गर्न सक्नु हुनेछ ।
        </p>
        <p className="mt-1 text-sm text-slate-600">
          If you wish to submit your feedback/complaint by phone, you can contact
          <a href="tel:+9779854089995" className="text-forest-700 underline hover:text-forest-900">
            (+977) - 9854089995
          </a>.
        </p>
      </div>

      {/* Section A: Feedback & Complain */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-forest-900">
          क) सुझाव तथा गुनासो <span className="text-forest-700 font-normal">/ Feedback & Complain</span>
        </legend>
        <label htmlFor="feedback" className={labelClass}>
          तपाईको सुझाव वा गुनासो यहाँ लेख्नुहोस्... <span className="text-red-500">*</span>
          <span className="ml-2 text-forest-700">/ Your feedback or complaint here...</span>
        </label>
        <textarea
          id="feedback"
          rows={4}
          aria-invalid={Boolean(errors.feedback)}
          aria-describedby={errors.feedback ? 'feedback-error' : undefined}
          className={`${fieldClass} py-3`}
          {...register('feedback')}
        />
        {errors.feedback && (
          <p id="feedback-error" role="alert" className="text-sm text-red-700">
            {errors.feedback.message}
          </p>
        )}
      </fieldset>

      {/* Section B: Confidential */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-forest-900">
          ख) के तपाई आफुलाई गोप्य राख्नु हुन्छ? <span className="text-forest-700 font-normal">/ Do you want to confidential yourself?</span>
        </legend>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="false"
              {...register('isConfidential')}
              className="h-4 w-4 text-forest-700 border-forest-300 focus:ring-forest-500"
            />
            <span className="text-sm text-slate-700">No (होइन)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="true"
              {...register('isConfidential')}
              className="h-4 w-4 text-forest-700 border-forest-300 focus:ring-forest-500"
            />
            <span className="text-sm text-slate-700">Yes (हो)</span>
          </label>
        </div>
        {errors.isConfidential && (
          <p role="alert" className="text-sm text-red-700">
            {errors.isConfidential.message}
          </p>
        )}
      </fieldset>

      {/* Section C: Personal Details (conditional) */}
      {!isConfidential && (
        <fieldset className="space-y-6 border-t border-forest-100 pt-6">
          <legend className="text-sm font-semibold text-forest-900">
            ग) यदि आफुलाई गोप्य राख्नु हुन्न भने कृपया व्यक्तिगत विवरण उल्लेख गर्नुहोस्।
            <span className="text-forest-700 font-normal">/ If you do not want to be confidential, please provide personal details.</span>
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                नाम/थर <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ Name/Surname</span>
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your Full Name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={fieldClass}
                {...register('name')}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <span className={labelClass}>
                लिङ्ग <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ Gender</span>
              </span>
              <div className="mt-1 flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="male"
                    {...register('gender')}
                    className="h-4 w-4 text-forest-700 border-forest-300 focus:ring-forest-500"
                  />
                  <span className="text-sm text-slate-700">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="female"
                    {...register('gender')}
                    className="h-4 w-4 text-forest-700 border-forest-300 focus:ring-forest-500"
                  />
                  <span className="text-sm text-slate-700">Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="others"
                    {...register('gender')}
                    className="h-4 w-4 text-forest-700 border-forest-300 focus:ring-forest-500"
                  />
                  <span className="text-sm text-slate-700">Others</span>
                </label>
              </div>
              {errors.gender && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="district" className={labelClass}>
                जिल्ला <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ District</span>
              </label>
              <input
                id="district"
                type="text"
                placeholder="e.g. Mahottari"
                aria-invalid={Boolean(errors.district)}
                className={fieldClass}
                {...register('district')}
              />
            </div>

            <div>
              <label htmlFor="municipality" className={labelClass}>
                पालिका <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ Municipality</span>
              </label>
              <input
                id="municipality"
                type="text"
                placeholder="e.g. Bardibas"
                aria-invalid={Boolean(errors.municipality)}
                className={fieldClass}
                {...register('municipality')}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="wardNo" className={labelClass}>
                वार्ड नं <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ Ward No</span>
              </label>
              <input
                id="wardNo"
                type="text"
                placeholder="e.g. 14"
                aria-invalid={Boolean(errors.wardNo)}
                className={fieldClass}
                {...register('wardNo')}
              />
            </div>

            <div>
              <label htmlFor="village" className={labelClass}>
                टोल <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ Village/Tope</span>
              </label>
              <input
                id="village"
                type="text"
                placeholder="Your village/tole"
                aria-invalid={Boolean(errors.village)}
                className={fieldClass}
                {...register('village')}
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* Section D: Want Response */}
      <fieldset className="space-y-4 border-t border-forest-100 pt-6">
        <legend className="text-sm font-semibold text-forest-900">
          घ) तपाई जवाफ चाहानु हुन्छ? यदि चाहानुहुन्छ भने कृपया सम्पर्क विवरण भर्नुहोला।
          <span className="text-forest-700 font-normal">/ Do you want a response? If yes, please provide contact details.</span>
        </legend>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="false"
              {...register('wantsResponse')}
              className="h-4 w-4 text-forest-700 border-forest-300 focus:ring-forest-500"
            />
            <span className="text-sm text-slate-700">No (चाहैन)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="true"
              {...register('wantsResponse')}
              className="h-4 w-4 text-forest-700 border-forest-300 focus:ring-forest-500"
            />
            <span className="text-sm text-slate-700">Yes (चाहन्छु)</span>
          </label>
        </div>

        {wantsResponse && (
          <div className="grid gap-4 sm:grid-cols-2 pl-4 border-l-2 border-forest-200">
            <div>
              <label htmlFor="mobileNo" className={labelClass}>
                मोबाईल नं <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ Mobile No</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">+977-</span>
                <input
                  id="mobileNo"
                  type="tel"
                  placeholder="XXXXXXXXXX"
                  aria-invalid={Boolean(errors.mobileNo)}
                  aria-describedby={errors.mobileNo ? 'mobileNo-error' : undefined}
                  className={`${fieldClass} pl-14`}
                  {...register('mobileNo')}
                />
              </div>
              {errors.mobileNo && (
                <p id="mobileNo-error" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.mobileNo.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                इमेल ठेगाना <span className="text-red-500">*</span>
                <span className="ml-2 text-forest-700">/ Email</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={fieldClass}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1 text-sm text-red-700">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        )}
      </fieldset>

      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || status.state === 'submitting'}
        className="w-full min-h-11 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-900 disabled:cursor-wait disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting || status.state === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} className="mr-2 inline" aria-hidden="true" />
            Submit Feedback / पेश गर्नुहोस्
          </>
        )}
      </button>

      {status.message && (
        <div
          role={status.state === 'error' ? 'alert' : 'status'}
          className={`flex items-start gap-2 text-sm ${status.state === 'error' ? 'text-red-700' : 'text-forest-700'}`}
        >
          {status.state === 'error' ? (
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <CheckCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <p>{status.message}</p>
        </div>
      )}

      <p className="text-center text-xs text-slate-500">
        Your feedback is sent directly to the Relief Nepal team by email.
        <br />
        तपाईको सुझाव तथा गुनासो रिलीफ नेपाल टिममा इमेल मार्फत पुग्नेछ।
      </p>
    </form>
  );
}