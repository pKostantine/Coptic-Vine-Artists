import { account } from '@/services/account';
import { disableNativeNotificationDevice } from '@/services/notificationService';

/** Signs out, detaching this device from Artists notifications first. */
export async function signOut(): Promise<void> {
  try {
    await disableNativeNotificationDevice();
  } catch (error) {
    console.warn('Unable to detach this device from Coptic Vine Artists notifications before sign-out:', error);
  }
  await account.signOut();
}
