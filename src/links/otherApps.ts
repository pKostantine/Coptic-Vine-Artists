/**
 * The other Coptic Vine apps, for the foot of Account (Coptic Vine design,
 * "Account": the one account, the same in every app, and the other apps).
 * The same list as the kit's links/otherApps.ts in the reader apps; Artists
 * doesn't use the kit, so it keeps its own copy. Each opens the app where it
 * is installed, and its web version where it isn't.
 */
import { Linking, Platform } from 'react-native';

export type OtherAppId = 'books' | 'canon' | 'music' | 'learn';

export interface OtherApp {
  id: OtherAppId;
  name: string;
  description: string;
  scheme: string;
  web: string;
}

export const OTHER_APPS: OtherApp[] = [
  { id: 'books', name: 'Coptic Vine Books', description: 'The liturgical books, Today and the Bible', scheme: 'copticvine-books', web: 'https://books.copticvine.ca' },
  { id: 'canon', name: 'Coptic Vine Canon', description: 'Your spiritual canon, day by day', scheme: 'copticvine-canon', web: 'https://canon.copticvine.ca' },
  { id: 'music', name: 'Coptic Vine Music', description: 'Hymns and songs: where listeners hear your releases', scheme: 'copticvine-music', web: 'https://music.copticvine.ca' },
  { id: 'learn', name: 'Coptic Vine Learn', description: 'Learn the hymns by season: where your lessons are taught', scheme: 'copticvine-learn', web: 'https://learn.copticvine.ca' },
];

/** Opens the app, or its web version where it isn't installed. */
export async function openOtherApp(app: OtherApp): Promise<void> {
  if (Platform.OS === 'web') {
    window.open(app.web, '_blank', 'noopener');
    return;
  }
  const native = `${app.scheme}://`;
  try {
    if (await Linking.canOpenURL(native)) {
      await Linking.openURL(native);
      return;
    }
  } catch {
    // Not installed, or the scheme isn't listed: the web version.
  }
  await Linking.openURL(app.web);
}
