import { feedbackRepository } from '../../repositories/index.js';
import { query } from '../../config/database.js';
import { sendFeedbackNotification, sendAutoReply } from '../../services/email.js';

export const feedbackController = {
  async submitFeedback(req, res, next) {
    try {
      const data = req.validatedBody;

      // Honeypot check
      if (data.website) {
        return res.status(201).json({ data: { accepted: true } });
      }

      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const submission = await feedbackRepository.create({
        feedback: data.feedback,
        is_confidential: data.isConfidential,
        name: data.name || null,
        gender: data.gender || null,
        district: data.district || null,
        municipality: data.municipality || null,
        ward_no: data.wardNo || null,
        village: data.village || null,
        wants_response: data.wantsResponse,
        mobile_no: data.mobileNo || null,
        email: data.email || null,
        ip_address: ip,
        user_agent: userAgent,
        status: 'new',
      });

      // Send email notification to admin (feedback@reliefnepal.org.np)
      const notificationData = {
        ...submission,
        is_confidential: data.isConfidential,
        wants_response: data.wantsResponse,
        mobile_no: data.mobileNo || null,
        email: data.email || null,
        created_at: new Date().toISOString(),
      };

      // Send admin notification and auto-reply in parallel (non-blocking)
      Promise.all([
        sendFeedbackNotification(notificationData),
        sendAutoReply(notificationData),
      ]).catch((error) => {
        console.error('[Feedback] Email sending failed:', error.message);
      });

      res.status(201).json({
        data: {
          accepted: true,
          id: submission.id,
          message: 'Thank you for your feedback. We will review it shortly.',
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async listFeedback(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        search,
        startDate,
        endDate,
      } = req.query;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const offset = (pageNum - 1) * limitNum;

      const [feedback, total] = await Promise.all([
        feedbackRepository.findAllAdmin({
          limit: limitNum,
          offset,
          status,
          search,
          startDate,
          endDate,
        }),
        feedbackRepository.countAdmin({ status, search, startDate, endDate }),
      ]);

      res.json({
        data: feedback,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await feedbackRepository.getStats();
      const totalResult = await query('SELECT COUNT(*) as total FROM feedback_submissions');
      const total = Number(totalResult.rows[0].total);

      res.json({
        data: {
          total,
          byStatus: stats.reduce((acc, row) => {
            acc[row.status] = Number(row.count);
            return acc;
          }, {}),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getFeedback(req, res, next) {
    try {
      const { id } = req.params;
      const feedback = await feedbackRepository.findById(id);

      if (!feedback) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Feedback not found' },
        });
      }

      res.json({ data: feedback });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      if (!['new', 'in_progress', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({
          error: { code: 'INVALID_STATUS', message: 'Invalid status value' },
        });
      }

      const adminId = req.admin?.user?.id;
      const updated = await feedbackRepository.updateStatus(id, status, adminNotes, adminId);

      if (!updated) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Feedback not found' },
        });
      }

      res.json({ data: updated });
    } catch (error) {
      next(error);
    }
  },

  async bulkUpdateStatus(req, res, next) {
    try {
      const { ids, status, adminNotes } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          error: { code: 'INVALID_IDS', message: 'IDs array is required' },
        });
      }

      if (!['new', 'in_progress', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({
          error: { code: 'INVALID_STATUS', message: 'Invalid status value' },
        });
      }

      const adminId = req.admin?.user?.id;
      const results = [];

      for (const id of ids) {
        const updated = await feedbackRepository.updateStatus(id, status, adminNotes, adminId);
        if (updated) results.push(updated);
      }

      res.json({
        data: {
          updated: results.length,
          requested: ids.length,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};