import { redirect } from 'next/navigation';
import { ROLE_HOME } from '@/lib/auth/role-home';
import { getSession } from '@/lib/auth/session';

export default async function HomePage() {
  const user = await getSession();
  redirect(user ? ROLE_HOME[user.role] : '/login');
}