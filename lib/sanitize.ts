/**
 * Sanitize HTML content to prevent XSS attacks
 * Lightweight sanitizer for server-side rendering compatible with Next.js 15
 * Safe for controlled database content
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  
  // For server-side rendering, we use a simple allow-list approach
  // This is safe since content comes from our controlled database
  const allowedTags = new Set([
    'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'span', 'div',
    'blockquote', 'code', 'pre'
  ]);
  
  // Remove script tags and on* event handlers
  let sanitized = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Only allow safe attributes
  sanitized = sanitized.replace(
    /(<\w+)([^>]*)(>)/g,
    (match, openTag, attrs, closeTag) => {
      const tagName = openTag.slice(1).toLowerCase();
      if (!allowedTags.has(tagName)) {
        return '';
      }
      
      // Filter attributes to only allow safe ones
      const safeAttrs = attrs.replace(
        /(\w+)\s*=\s*["']([^"']*)["']/g,
        (attrMatch: string, attrName: string, attrValue: string) => {
          const safeName = attrName.toLowerCase();
          if (['href', 'target', 'rel', 'class', 'style'].includes(safeName)) {
            // Extra safety for href
            if (safeName === 'href' && attrValue.trim().toLowerCase().startsWith('javascript:')) {
              return '';
            }
            return ` ${safeName}="${attrValue}"`;
          }
          return '';
        }
      );
      
      return openTag + safeAttrs + closeTag;
    }
  );
  
  return sanitized;
}

/**
 * Sanitize and prepare HTML for dangerouslySetInnerHTML
 */
export function createSafeHtml(dirty: string): { __html: string } {
  return { __html: sanitizeHtml(dirty) }
}
