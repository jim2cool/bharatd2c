export function getActiveStoreIdClient(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('bharat_active_store_id')
}
