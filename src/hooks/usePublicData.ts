// Lightweight cache invalidation hook for the admin template
// In the production app this would invalidate any public data caches
// For the offline admin template, provide a no-op implementation.
export function invalidatePublicDataCache(): void {
  // Intentionally empty - cache invalidation not required for local dev
}
