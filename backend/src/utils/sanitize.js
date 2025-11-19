/**
 * Sanitize user input to prevent NoSQL injection
 * Removes MongoDB operators from user input
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Escape special regex characters
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const key in input) {
      // Remove keys starting with $ (MongoDB operators)
      if (!key.startsWith('$')) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  
  return input;
};

/**
 * Validate and sanitize MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Sanitize search query for safe regex use
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  // Remove special characters that could break regex
  // Allow only alphanumeric, spaces, and basic punctuation
  return query
    .trim()
    .replace(/[^\w\s\-_.,']/g, '')
    .substring(0, 100); // Limit length
};
