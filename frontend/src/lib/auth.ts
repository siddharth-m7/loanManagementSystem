import { fetchApi } from './api';

/**
 * After a successful login, decide where to send the user.
 * - Borrowers with existing loans → /dashboard
 * - Borrowers without loans → /apply
 * - All other roles → /dashboard
 */
export async function getPostLoginRoute(role: string): Promise<string> {
  if (role !== 'BORROWER') return '/dashboard';

  try {
    const data = await fetchApi('/loans/my-loans');
    const hasLoans = data.loans && data.loans.length > 0;
    return hasLoans ? '/dashboard' : '/apply';
  } catch {
    // If the check fails for any reason, default to /apply
    return '/apply';
  }
}
