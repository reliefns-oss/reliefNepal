import {
  findMany,
  insert,
} from './base.repository.js';

export const newsletterRepository = {
  async createSubscription(email) {
    const subscription = await insert('newsletter_subscriptions', {
      email,
      consented_at: new Date().toISOString(),
    }, 'id, email, consented_at, created_at');
    // Handle duplicate email (ON CONFLICT DO NOTHING equivalent)
    if (!subscription) {
      // Check if already exists
      const existing = await findMany('newsletter_subscriptions', {
        columns: 'id, email, consented_at, created_at',
        filters: { email },
        limit: 1,
      });
      return existing[0] || null;
    }
    return subscription;
  },

  async findAllAdmin(options = {}) {
    const { limit = 500, offset = 0 } = options;
    return findMany('newsletter_subscriptions', {
      columns: 'id, email, consented_at, created_at',
      orderBy: { column: 'created_at', direction: 'DESC' },
      limit,
      offset,
    });
  },
};