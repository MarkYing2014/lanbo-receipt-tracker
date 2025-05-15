/**
 * Simplest possible Convex authentication configuration
 * This completely allows anonymous access with no JWT validation
 */
export default {
  // Allow completely anonymous access with no JWT validation
  allowUnauthenticated: true,
  
  // Remove all providers to avoid any JWT validation attempts
  providers: [],
};
