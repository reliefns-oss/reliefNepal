import { newsletterRepository } from '../../repositories/index.js';

export const inquiryRepository = {
  async createNewsletterSubscription(subscription) {
    return newsletterRepository.createSubscription(subscription.email);
  },
};