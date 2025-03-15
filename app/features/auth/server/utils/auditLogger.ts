/**
 * Audit logging utility for authentication-related events
 * In a production environment, consider sending these logs to a dedicated service
 */

type AuditEventType = 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILURE' 
  | 'LOGOUT' 
  | 'REGISTRATION_SUCCESS' 
  | 'REGISTRATION_FAILURE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_SUCCESS'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  email?: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  details?: Record<string, any>;
}

/**
 * Log an authentication event
 */
export function logAuthEvent(event: AuditLogEntry): void {
  // Remove sensitive information before logging
  const sanitizedEvent = { ...event };
  
  // Make sure we don't log passwords or tokens
  if (sanitizedEvent.details) {
    if (sanitizedEvent.details.password) {
      sanitizedEvent.details.password = '[REDACTED]';
    }
    if (sanitizedEvent.details.token) {
      sanitizedEvent.details.token = '[REDACTED]';
    }
  }
  
  // Add timestamp if not provided
  if (!sanitizedEvent.timestamp) {
    sanitizedEvent.timestamp = new Date().toISOString();
  }
  
  // In development, log to console
  // In production, you would send this to a secure logging service
  console.log(`[AUTH AUDIT] ${sanitizedEvent.timestamp} - ${sanitizedEvent.eventType}`, 
    JSON.stringify(sanitizedEvent));
  
  // TODO: In production, implement persistent storage for audit logs
  // Examples: Write to database, send to log aggregation service, etc.
}
