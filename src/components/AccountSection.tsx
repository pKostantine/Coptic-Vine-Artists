/**
 * The foot of Profile: the one Coptic Vine account (Coptic Vine design,
 * "Account"). Who is signed in, the notifications Artists sends, the other
 * apps, and logging out.
 */
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Banner, Button, Card, uiStyles } from '@/components/ui';
import { COLORS, SPACING } from '@/constants/theme';
import { OTHER_APPS, openOtherApp } from '@/links/otherApps';
import { account } from '@/services/account';
import { loadNotificationPreferences, setNotificationPreference, type NotificationPreferenceMap } from '@/services/notificationService';
import { signOut } from '@/services/signOut';

/** The notifications Artists sends (workers/api/scripts/gen-triggers.ts in coptic-vine-platform). */
const CATEGORIES = [
  { id: 'submission_updates', title: 'Submission updates', description: 'When a submission is approved, sent back or rejected.' },
  { id: 'release_updates', title: 'Releases going live', description: 'When an approved release is published on Coptic Vine.' },
] as const;

export function AccountSection() {
  const [email, setEmail] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<NotificationPreferenceMap | null>(null);
  const [error, setError] = useState('');
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let live = true;
    void account.getUser().then((user) => { if (live) setEmail(user?.email ?? null); }).catch(() => {});
    void loadNotificationPreferences(CATEGORIES.map((category) => category.id))
      .then((next) => { if (live) setPrefs(next); })
      .catch((cause) => { if (live) setError(String(cause?.message ?? cause)); });
    return () => { live = false; };
  }, []);

  async function toggle(category: string, enabled: boolean) {
    const before = prefs;
    setPrefs((current) => ({ ...(current ?? {}), [category]: enabled }));
    setError('');
    try {
      await setNotificationPreference(category, enabled);
    } catch (cause) {
      setPrefs(before);
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  return (
    <>
      <Card
        eyebrow="Account"
        title="Your Coptic Vine account"
        description="The same account in every Coptic Vine app: sign in with it in Books, Canon, Music and Learn too."
      >
        {!!email && (
          <View style={styles.signedIn}>
            <Text style={uiStyles.muted}>Signed in as</Text>
            <Text style={uiStyles.body} selectable>{email}</Text>
          </View>
        )}
        <Button
          kind="secondary"
          icon="log-out-outline"
          label={leaving ? 'Logging out…' : 'Log out'}
          busy={leaving}
          style={styles.logOut}
          onPress={() => {
            setLeaving(true);
            void signOut().finally(() => setLeaving(false));
          }}
        />
      </Card>

      <Card title="Notifications" description="What Coptic Vine Artists tells you about.">
        {!!error && <Banner tone="error">{error}</Banner>}
        {CATEGORIES.map((category) => (
          <View key={category.id} style={uiStyles.row}>
            <View style={styles.rowBody}>
              <Text style={uiStyles.rowTitle}>{category.title}</Text>
              <Text style={uiStyles.muted}>{category.description}</Text>
            </View>
            <Switch
              accessibilityLabel={category.title}
              value={prefs ? prefs[category.id] !== false : true}
              disabled={!prefs}
              onValueChange={(enabled) => void toggle(category.id, enabled)}
              trackColor={{ true: COLORS.gold, false: COLORS.inset }}
              thumbColor={COLORS.white}
            />
          </View>
        ))}
      </Card>

      <Card title="The Coptic Vine apps" description="Open the other apps with the same account.">
        {OTHER_APPS.map((app) => (
          <Pressable
            key={app.id}
            accessibilityRole="link"
            accessibilityLabel={`Open ${app.name}`}
            onPress={() => void openOtherApp(app)}
            style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
              uiStyles.row,
              styles.appRow,
              hovered && styles.appRowHover,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.rowBody}>
              <Text style={uiStyles.rowTitle}>{app.name}</Text>
              <Text style={uiStyles.muted}>{app.description}</Text>
            </View>
            <Text style={uiStyles.link}>Open ›</Text>
          </Pressable>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  signedIn: { gap: 2 },
  logOut: { alignSelf: 'flex-start' },
  rowBody: { flex: 1, minWidth: 180, gap: 3 },
  appRow: { borderRadius: 12, paddingHorizontal: 12 },
  appRowHover: { backgroundColor: COLORS.hover },
  pressed: { opacity: 0.82 },
});
