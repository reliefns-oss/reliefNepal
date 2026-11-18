import { redirect } from 'next/navigation';

export default function StoriesRedirectPage() {
  redirect('/admin?tab=stories');
}
