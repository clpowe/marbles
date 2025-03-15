import { z } from "zod";
import { findUserByEmail } from "../db/auth";
import { catchError } from "@lib/utils";
import { isRateLimited, resetRateLimit } from "../utils/rateLimiter";
import { logAuthEvent } from "../utils/auditLogger";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  // Get client IP address for rate limiting
  const clientIP = getRequestHeader(event, 'x-forwarded-for') || 
                   event.node.req.socket.remoteAddress ||
                   'unknown';
  
  // Check if this IP is rate limited
  if (isRateLimited(clientIP)) {
    throw createError({
      statusCode: 429,
      statusText: "Too Many Requests",
      message: "Too many failed login attempts. Please try again later."
    });
  }

  try {
    const { email, password } = await readValidatedBody(event, bodySchema.parse);
    const [userError, user] = await catchError(findUserByEmail(email));

    if (userError || !user) {
      // Log failed login attempt
      logAuthEvent({
        eventType: 'LOGIN_FAILURE',
        email: email,
        ipAddress: clientIP,
        userAgent: getRequestHeader(event, 'user-agent'),
        timestamp: new Date().toISOString(),
        details: { reason: 'User not found or database error' }
      });
      
      throw createError({
        statusCode: 401,
        statusText: "Invalid credentials",
        message: "Invalid email or password"
      });
    }

    if (await verifyPassword(user?.password!, password)) {
      if (!user.email) return;
      
      // Reset rate limit on successful login
      resetRateLimit(clientIP);
      
      // Log successful login
      logAuthEvent({
        eventType: 'LOGIN_SUCCESS',
        userId: user.id,
        email: user.email,
        ipAddress: clientIP,
        userAgent: getRequestHeader(event, 'user-agent'),
        timestamp: new Date().toISOString()
      });
      
      // Set user session
      await setUserSession(event, {
        user: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user!.email,
          id: user?.id,
          createdAt: user?.createdAt,
        },
        // Record IP address and user agent for additional security
        ipAddress: clientIP,
        userAgent: getRequestHeader(event, 'user-agent'),
        loginTime: new Date().toISOString()
      }, {
        // Set to expire in 7 days
        maxAge: 60 * 60 * 24 * 7
      });
      
      return {
        statusCode: 200,
      };
    }
    
    throw createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  } catch (error) {
    // Extract error details safely with type checking
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error && typeof error === 'object' && 'statusCode' in error ? 
      (error.statusCode as number) : 500;
    
    // Log login error
    logAuthEvent({
      eventType: 'LOGIN_FAILURE',
      ipAddress: clientIP,
      userAgent: getRequestHeader(event, 'user-agent'),
      timestamp: new Date().toISOString(),
      details: { 
        errorMessage,
        errorCode
      }
    });
    
    // Log the error but don't expose details
    console.error("Login error:", error);
    
    // If the error is not already a HTTP error, create a generic one
    if (!(error && typeof error === 'object' && 'statusCode' in error)) {
      throw createError({
        statusCode: 500,
        message: "Authentication failed. Please try again."
      });
    }
    
    // Re-throw HTTP errors
    throw error;
  }
});
