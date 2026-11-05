import { authenticateAdmin } from './auth.js';

export async function requireAdmin(req, res, next) {
  return authenticateAdmin(req, res, next);
}