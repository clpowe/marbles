/**
 * Plugin to add security headers to all responses
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    // Content Security Policy
    event.node.res.setHeader('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " + 
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "connect-src 'self' wss: https:;");
    
    // Prevent MIME type sniffing
    event.node.res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    event.node.res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Enable XSS protection
    event.node.res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // HTTP Strict Transport Security (HSTS)
    // Only add in production environments
    if (process.env.NODE_ENV === 'production') {
      event.node.res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    // Referrer Policy
    event.node.res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Feature Policy / Permissions Policy
    event.node.res.setHeader('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  });
});
