import { Router } from 'express';
import { validateBody } from '../../middleware/validate.js';
import { z } from 'zod';
import { feedbackController } from './feedback.controller.js';
import { requireAdmin } from '../../middleware/require-admin.js';

export const feedbackRoutes = Router();

// Public feedback submission
const feedbackSchema = z.object({
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
  isConfidential: z.boolean(),
  name: z.string().optional(),
  gender: z.preprocess(
    (value) => value === '' ? undefined : value,
    z.enum(['male', 'female', 'others']).optional(),
  ),
  district: z.string().optional(),
  municipality: z.string().optional(),
  wardNo: z.string().optional(),
  village: z.string().optional(),
  wantsResponse: z.boolean(),
  mobileNo: z.string().optional(),
  email: z.preprocess(
    (value) => value === '' ? undefined : value,
    z.string().email('Invalid email address').optional(),
  ),
  website: z.string().optional(), // honeypot
}).refine((data) => {
  if (!data.isConfidential && !data.name) return false;
  return true;
}, {
  message: 'Name is required when not confidential',
  path: ['name'],
}).refine((data) => {
  if (data.wantsResponse && !data.email) return false;
  return true;
}, {
  message: 'Email is required when you want a response',
  path: ['email'],
}).refine((data) => {
  if (data.wantsResponse && !data.mobileNo) return false;
  return true;
}, {
  message: 'Mobile number is required when you want a response',
  path: ['mobileNo'],
});

feedbackRoutes.post(
  '/submit',
  validateBody(feedbackSchema),
  feedbackController.submitFeedback,
);

// Admin routes - all require admin auth
feedbackRoutes.use(requireAdmin);

// List feedback with filters
feedbackRoutes.get('/', feedbackController.listFeedback);

// Get feedback stats
feedbackRoutes.get('/stats', feedbackController.getStats);

// Get single feedback
feedbackRoutes.get('/:id', feedbackController.getFeedback);

// Update feedback status
feedbackRoutes.patch('/:id/status', feedbackController.updateStatus);

// Bulk update status
feedbackRoutes.post('/bulk/status', feedbackController.bulkUpdateStatus);