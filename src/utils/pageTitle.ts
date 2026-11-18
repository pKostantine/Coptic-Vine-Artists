import { useEffect } from 'react';
import { usePathname } from 'expo-router';

/**
 * The browser tab's title, as in every Coptic Vine app (coptic-vine-kit
 * utils/pageTitle.ts): the app's name on its main page, "<page> · <app>" on
 * every other ("Releases · Coptic Vine Artists").
 */
const APP = 'Coptic Vine Artists';

/** Each page's name, by its path; the first that matches. The main page (/) has none. */
const PAGES: [RegExp, string][] = [
  [/^\/releases\/?$/, 'Releases'],
  [/^\/release\//, 'Release'],
  [/^\/lyrics/, 'Lyrics Studio'],
  [/^\/profile/, 'Profile & account'],
  [/^\/submission\/new/, 'New Submission'],
  [/^\/submission\/edit\//, 'Edit Submission'],
  [/^\/submission\/?$/, 'Submissions'],
  [/^\/submission\//, 'Submission'],
  [/^\/auth\//, 'Sign In'],
];

export function pageTitle(page?: string | null): string {
  return page ? `${page} · ${APP}` : APP;
}

/** In the root layout: names the page shown in the tab. */
export function useRouteTitle(): void {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = pageTitle(PAGES.find(([pattern]) => pattern.test(pathname))?.[1]);
  }, [pathname]);
}
