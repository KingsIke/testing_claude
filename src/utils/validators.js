const VALID_STATUSES = ['todo', 'in-progress', 'done'];

export function validateTaskCreate(body) {
  const errors = [];

  if (!body.title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof body.title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (body.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  } else if (body.title.length > 255) {
    errors.push({ field: 'title', message: 'Title cannot exceed 255 characters' });
  }

  if (body.description && typeof body.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  } else if (body.description && body.description.length > 1000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateTaskUpdate(body) {
  const errors = [];

  if (body.title !== undefined) {
    if (typeof body.title !== 'string') {
      errors.push({ field: 'title', message: 'Title must be a string' });
    } else if (body.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (body.title.length > 255) {
      errors.push({ field: 'title', message: 'Title cannot exceed 255 characters' });
    }
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (body.description.length > 1000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters' });
    }
  }

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      errors.push({
        field: 'status',
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateStatus(status) {
  return VALID_STATUSES.includes(status);
}
