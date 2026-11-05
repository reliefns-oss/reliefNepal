export function getAdminErrorMessage(error) {
  const message = error instanceof Error ? error.message : '';

  if (!message) return 'Something went wrong. Please try again.';
  if (/session expired|sign in again/i.test(message))
    return 'Your session has expired. Sign in again to continue.';
  if (/not authorized|permission|forbidden/i.test(message))
    return 'You do not have permission to do this. Ask an administrator to check your access.';
  if (/uploads? are not configured/i.test(message))
    return 'The image could not be uploaded. Ask an administrator to check the image upload settings, then try again.';
  if (
    /service is unavailable|failed to fetch|networkerror|network request/i.test(
      message,
    )
  )
    return 'Could not reach the service. Check your connection and try again.';

  return message;
}

export function getImageUploadErrorMessage(error) {
  const message = error instanceof Error ? error.message : '';

  if (/uploads? are not configured/i.test(message))
    return 'The image could not be uploaded. Ask an administrator to check the image upload settings, then try again.';
  if (/failed to fetch|networkerror|network request/i.test(message))
    return 'The upload was interrupted. Check your connection and try again.';

  return getAdminErrorMessage(error);
}