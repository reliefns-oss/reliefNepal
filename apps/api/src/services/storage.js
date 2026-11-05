import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';

// Allowed MIME types and their extensions
const MIME_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'application/pdf': '.pdf',
};

const ALLOWED_MIME_TYPES = Object.keys(MIME_EXTENSIONS);

// Collections and their subdirectories
const COLLECTIONS = {
  projects: 'projects',
  gallery: 'gallery',
  notices: 'notices',
  partners: 'partners',
  procurement: 'procurement',
  board: 'board',
};

function getCollectionDir(collection) {
  const dir = COLLECTIONS[collection] || 'projects';
  return path.join(env.uploadRoot, dir);
}

function ensureUploadDirs() {
  for (const dir of Object.values(COLLECTIONS)) {
    const fullPath = path.join(env.uploadRoot, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }
}

// Initialize directories on module load
ensureUploadDirs();

export function validateFileType(mimeType) {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

export function validateFileSize(size) {
  return size <= env.maxFileSize;
}

export function getExtension(mimeType) {
  return MIME_EXTENSIONS[mimeType] || '.bin';
}

export function generatePublicId(collection, mimeType) {
  const dir = COLLECTIONS[collection] || 'projects';
  const ext = MIME_EXTENSIONS[mimeType] || '';
  return `relief-nepal/${dir}/${randomUUID()}${ext}`;
}

export function getFilePath(publicId) {
  // publicId format: relief-nepal/collection/uuid
  // Convert to filesystem path: /home/.../uploads/collection/uuid.ext
  const parts = publicId.split('/');
  if (parts.length !== 3 || parts[0] !== 'relief-nepal') {
    return null;
  }
  const [, collection, filename] = parts;
  const collectionDir = COLLECTIONS[collection];
  if (!collectionDir) return null;
  return path.join(env.uploadRoot, collectionDir, filename);
}

export function getPublicUrl(publicId) {
  if (!publicId) return null;
  const relativePath = publicId.replace('relief-nepal/', '');
  return `${env.publicBaseUrl}${env.uploadUrlPrefix}/${relativePath}`;
}

export function deleteFile(publicId) {
  const filePath = getFilePath(publicId);
  if (!filePath) return false;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Failed to delete file', { publicId, error: error.message });
    return false;
  }
}

export function saveFile(buffer, publicId) {
  const filePath = getFilePath(publicId);
  if (!filePath) {
    throw new Error('Invalid publicId format');
  }
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function getFileInfo(publicId) {
  const filePath = getFilePath(publicId);
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  const stats = fs.statSync(filePath);
  return {
    size: stats.size,
    modified: stats.mtime,
    path: filePath,
  };
}

// For multipart upload handling (multer)
export function createMulterStorage() {
  // This will be used with multer.diskStorage()
  return {
    destination: (req, file, cb) => {
      const collection = req.body?.collection || 'projects';
      const dir = getCollectionDir(collection);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = getExtension(file.mimetype);
      const filename = `${randomUUID()}${ext}`;
      cb(null, filename);
    },
  };
}

// For direct buffer upload (from admin verify endpoint)
export async function handleDirectUpload(buffer, publicId, mimeType) {
  if (!validateFileType(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
  if (!validateFileSize(buffer.length)) {
    throw new Error(`File too large: ${buffer.length} bytes (max ${env.maxFileSize})`);
  }
  saveFile(buffer, publicId);
  return getPublicUrl(publicId);
}