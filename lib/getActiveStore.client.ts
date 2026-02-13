export function getActiveStoreIdClient(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('easy_active_store_id')
}
