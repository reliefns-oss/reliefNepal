'use client';

import { motion } from 'framer-motion';
import '@/components/ui/design-tokens.css';

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  fallbackIcon,
  className = '',
  status,
  statusPosition = 'bottom-right',
  ...props
}) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  const statusPositions = {
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClass = sizes[size] || sizes.md;
  const shapeClass = shape === 'square' ? 'rounded-lg' : 'rounded-full';
  const statusSizeClass = statusSizes[size] || statusSizes.md;
  const statusPositionClass = statusPositions[statusPosition] || statusPositions['bottom-right'];

  const statusColors = {
    online: 'bg-brand-500',
    offline: 'bg-slate-400',
    busy: 'bg-amber-500',
    away: 'bg-amber-500',
    active: 'bg-brand-500',
    inactive: 'bg-slate-400',
  };

  return (
    <div className={`relative inline-flex ${className}`} {...props}>
      <div className={`${sizeClass} ${shapeClass} bg-bg-tertiary flex items-center justify-center overflow-hidden relative text-text-tertiary font-semibold`}>
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
        ) : fallbackIcon ? (
          <span className="flex items-center justify-center" aria-hidden="true">{fallbackIcon}</span>
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
        {status && (
          <motion.span
            className={`absolute ${statusPositionClass} ${statusSizeClass} rounded-full border-2 border-white dark:border-bg-secondary ${statusColors[status] || statusColors.offline}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    </div>
  );
}

export function AvatarGroup({
  avatars = [],
  maxVisible = 5,
  size = 'md',
  className = '',
  ...props
}) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;

  return (
    <div className={`flex -space-x-2 ${className}`} {...props} aria-label={`${avatars.length} people`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar key={avatar.key || index} {...avatar} size={size} className="ring-2 ring-white dark:ring-bg-secondary" />
      ))}
      {remainingCount > 0 && (
        <div className={`flex-shrink-0 ${size === 'xs' ? 'w-6 h-6' : size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : size === 'lg' ? 'w-12 h-12' : size === 'xl' ? 'w-16 h-16' : 'w-24 h-24'} rounded-full bg-bg-tertiary border-2 border-white dark:border-bg-secondary flex items-center justify-center text-text-secondary font-semibold`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export function UserAvatar({ user, size = 'md', className = '', ...props }) {
  if (!user) return <Avatar name="Unknown" size={size} className={className} {...props} />;
  return (
    <Avatar
      src={user.photo_url || user.avatar_url || user.image}
      alt={user.display_name || user.name || user.email}
      name={user.display_name || user.name || user.email}
      size={size}
      status={user.is_active !== false ? 'online' : 'offline'}
      className={className}
      {...props}
    />
  );
}