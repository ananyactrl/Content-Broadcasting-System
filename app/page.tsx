import { redirect } from 'next/navigation';

/**
 * Root route — redirect to login.
 * Middleware handles the case where the user is already authenticated.
 */
export default function RootPage() {
  redirect('/login');
}
