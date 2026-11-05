'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import '@/components/ui/design-tokens.css';

const FILE_ICONS = {
  'application/pdf': File,
  'application/msword': File,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': File,
  'application/vnd.ms-excel': File,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': File,
  'image/jpeg': ImageIcon,
  'image/png': ImageIcon,
  'image/webp': ImageIcon,
  'image/avif': ImageIcon,
};

const FILE_TYPES = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/avif': 'AVIF',
};

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function FileUpload({
  accept = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
  maxSize = 16 * 1024 * 1024,
  multiple = false,
  onUpload,
  onRemove,
  value = [],
  disabled = false,
  label = 'Upload files',
  description,
  className = '',
  uploadLabel = 'Upload',
  compact = false,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState(value || []);
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (!accept.some((type) => file.type === type || (type.endsWith('/*') && file.type.startsWith(type.slice(0, -1))))) {
      return `File type ${file.type} is not allowed`;
    }
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFiles = (newFiles) => {
    const validFiles = [];
    const newErrors = { ...errors };

    Array.from(newFiles).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors[file.name] = error;
      } else {
        validFiles.push({
          file,
          id: `${file.name}-${file.size}-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          status: 'pending',
        });
      }
    });

    setErrors(newErrors);
    if (validFiles.length > 0) {
      setFiles((prev) => multiple ? [...prev, ...validFiles] : validFiles);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    onRemove?.(id);
  };

  const uploadFile = async (fileObj) => {
    setUploading((prev) => ({ ...prev, [fileObj.id]: true }));
    setFiles((prev) => prev.map((f) => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

    try {
      if (onUpload) {
        const result = await onUpload(fileObj.file);
        setFiles((prev) => prev.map((f) => f.id === fileObj.id ? { ...f, status: 'complete', ...result } : f));
      } else {
        setFiles((prev) => prev.map((f) => f.id === fileObj.id ? { ...f, status: 'complete' } : f));
      }
    } catch (error) {
      setFiles((prev) => prev.map((f) => f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f));
    } finally {
      setUploading((prev) => {
        const next = { ...prev };
        delete next[fileObj.id];
        return next;
      });
    }
  };

  const uploadAll = () => {
    files.filter((f) => f.status === 'pending').forEach(uploadFile);
  };

  const retryUpload = (id) => {
    const file = files.find((f) => f.id === id);
    if (file) uploadFile(file);
  };

  const getFileIcon = (type) => {
    const Icon = FILE_ICONS[type] || File;
    return <Icon className="w-5 h-5" aria-hidden="true" />;
  };

  const getFileTypeLabel = (type) => FILE_TYPES[type] || type.split('/').pop().toUpperCase();

  if (compact) {
    return (
      <div className={className}>
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border-light bg-white">
          <div className="relative">
            <input
              ref={inputRef}
              type="file"
              accept={accept.join(',')}
              multiple={multiple}
              onChange={handleInputChange}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label={label}
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Upload className="w-4 h-4" />}
              disabled={disabled}
            >
              {label}
            </Button>
          </div>
          {files.length > 0 && (
            <span className="text-sm text-text-secondary">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-1 max-h-40 overflow-auto">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center gap-2 px-2 py-1.5 text-xs bg-bg-primary rounded">
                {getFileIcon(fileObj.type)}
                <span className="truncate flex-1">{fileObj.name}</span>
                <span className="text-text-tertiary">{formatFileSize(fileObj.size)}</span>
                <button onClick={() => removeFile(fileObj.id)} className="text-text-tertiary hover:text-red-600 p-0.5" aria-label="Remove file">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 transition-all duration-200 ${
          dragActive
            ? 'border-brand-500 bg-brand-50'
            : files.some((f) => f.status === 'error')
            ? 'border-red-300 bg-red-50'
            : 'border-border-light bg-white hover:border-brand-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="region"
        aria-label={label}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={label}
        />
        <div className="p-8 text-center">
          <motion.div
            animate={{ y: dragActive ? -4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mb-4"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-4 ${dragActive ? 'scale-110' : ''}`}>
              <Upload className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{dragActive ? 'Drop files here' : label}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {description || `Drag and drop files here, or click to browse. ${multiple ? 'Multiple files allowed.' : ''}`}
            </p>
            <p className="mt-2 text-xs text-text-tertiary">
              Accepted: {accept.map((t) => getFileTypeLabel(t)).join(', ')} • Max size: {formatFileSize(maxSize)}
            </p>
          </motion.div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2" role="list" aria-label="Uploaded files">
          {files.map((fileObj) => (
            <motion.div
              key={fileObj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                fileObj.status === 'error'
                  ? 'border-red-200 bg-red-50'
                  : fileObj.status === 'complete'
                  ? 'border-brand-200 bg-brand-50'
                  : 'border-border-light bg-white'
              }`}
              role="listitem"
            >
              <div className="relative flex-shrink-0">
                {fileObj.preview ? (
                  <img src={fileObj.preview} alt="" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-tertiary">
                    {getFileIcon(fileObj.type)}
                  </div>
                )}
                {fileObj.status === 'uploading' && (
                  <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
                {fileObj.status === 'complete' && (
                  <div className="absolute inset-0 rounded-lg bg-brand-600/90 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
                {fileObj.status === 'error' && (
                  <div className="absolute inset-0 rounded-lg bg-red-600/90 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{fileObj.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-tertiary">{formatFileSize(fileObj.size)}</span>
                  <Badge variant="default" size="xs">{getFileTypeLabel(fileObj.type)}</Badge>
                  {fileObj.status === 'uploading' && <span className="text-xs text-brand-600">Uploading...</span>}
                  {fileObj.status === 'complete' && <span className="text-xs text-brand-600">Uploaded</span>}
                  {fileObj.status === 'error' && <span className="text-xs text-red-600">Failed</span>}
                </div>
                {fileObj.status === 'error' && (
                  <p className="mt-1 text-xs text-red-600">{fileObj.error || 'Upload failed'}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {fileObj.status === 'error' && (
                  <Button variant="ghost" size="xs" onClick={() => retryUpload(fileObj.id)}>
                    Retry
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => removeFile(fileObj.id)}
                  disabled={fileObj.status === 'uploading'}
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {files.some((f) => f.status === 'pending') && (
        <div className="mt-4 flex justify-end">
          <Button onClick={uploadAll} disabled={uploading}>
            {uploadLabel} {files.filter((f) => f.status === 'pending').length} file{files.filter((f) => f.status === 'pending').length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
          <p className="text-sm font-medium text-red-800">Some files were rejected:</p>
          <ul className="mt-2 space-y-1">
            {Object.entries(errors).map(([name, error]) => (
              <li key={name} className="text-sm text-red-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-mono">{name}</span>
                <span>– {error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function FileUploadDropzone({
  onUpload,
  _accept,
  _maxSize,
  _multiple,
  disabled,
  children,
  className = '',
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => onUpload?.(file));
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 transition-all duration-200 ${dragActive ? 'border-brand-500 bg-brand-50' : 'border-border-light bg-white hover:border-brand-300'} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {children}
    </div>
  );
}