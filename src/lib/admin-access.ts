import { collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type DashboardAccessRole = 'admin' | 'editor';
export type DashboardAccessStatus = 'pending' | 'active';

export interface DashboardPermissions {
  dashboard: boolean;
  blogs: boolean;
  transactions: boolean;
  calls: boolean;
}

export const FULL_PERMISSIONS: DashboardPermissions = {
  dashboard: true,
  blogs: true,
  transactions: true,
  calls: true,
};

export const BLOGS_ONLY_PERMISSIONS: DashboardPermissions = {
  dashboard: true,
  blogs: true,
  transactions: false,
  calls: false,
};

export interface DashboardAccessRecord {
  email: string;
  username?: string;
  usernameNormalized?: string;
  role: DashboardAccessRole;
  status: DashboardAccessStatus;
  permissions: DashboardPermissions;
  approvedBy?: string;
  createdAt: number;
  updatedAt: number;
}

const DASHBOARD_ACCESS_COLLECTION = 'dashboardAccessUsers';
const DASHBOARD_REQUESTS_COLLECTION = 'dashboardAccessRequests';
const DASHBOARD_ACCESS_CACHE_KEY = 'almahy_dashboard_access_cache';

const isOfflineFirestoreError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const errorCode = (error as { code?: string }).code;
  return errorCode === 'unavailable' || error.message.toLowerCase().includes('client is offline');
};

const readAccessCache = (): Record<string, DashboardAccessRecord> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem(DASHBOARD_ACCESS_CACHE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, DashboardAccessRecord>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeAccessCache = (cache: Record<string, DashboardAccessRecord>) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(DASHBOARD_ACCESS_CACHE_KEY, JSON.stringify(cache));
};

const setCachedAccess = (record: DashboardAccessRecord) => {
  const cache = readAccessCache();
  cache[normalizeEmail(record.email)] = record;
  writeAccessCache(cache);
};

const removeCachedAccess = (email: string) => {
  const cache = readAccessCache();
  delete cache[normalizeEmail(email)];
  writeAccessCache(cache);
};

const getCachedAccess = (email: string): DashboardAccessRecord | null => {
  const cache = readAccessCache();
  return cache[normalizeEmail(email)] || null;
};

export const getCachedDashboardAccess = (email: string) => getCachedAccess(email);

export const getCachedDashboardUsers = () => {
  return Object.values(readAccessCache()).sort((left, right) => {
    if (left.role !== right.role) {
      return left.role === 'admin' ? -1 : 1;
    }
    if (left.status !== right.status) {
      return left.status === 'pending' ? -1 : 1;
    }
    return left.email.localeCompare(right.email);
  });
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const normalizeUsername = (username: string) => username.trim().toLowerCase().replace(/\s+/g, '');

const normalizeRecordUsername = (record: DashboardAccessRecord): DashboardAccessRecord => {
  if (!record.username && !record.usernameNormalized) {
    return record;
  }

  const normalizedUsername = normalizeUsername(record.usernameNormalized || record.username || '');
  if (!normalizedUsername) {
    return {
      ...record,
      username: undefined,
      usernameNormalized: undefined,
    };
  }

  return {
    ...record,
    username: normalizedUsername,
    usernameNormalized: normalizedUsername,
  };
};

const getAccessDocId = (email: string) => encodeURIComponent(normalizeEmail(email));

const submitDashboardAccessRequest = async (email: string, username?: string) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username || '');
  const now = Date.now();
  const payload: DashboardAccessRecord = {
    email: normalizedEmail,
    username: normalizedUsername || undefined,
    usernameNormalized: normalizedUsername || undefined,
    role: 'editor',
    status: 'pending',
    permissions: BLOGS_ONLY_PERMISSIONS,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await assertUsernameAvailableForEmail(normalizedUsername, normalizedEmail);
    await setDoc(doc(db, DASHBOARD_REQUESTS_COLLECTION, getAccessDocId(normalizedEmail)), payload, { merge: true });
    setCachedAccess(payload);
    return payload;
  } catch (error) {
    if (isOfflineFirestoreError(error)) {
      setCachedAccess(payload);
      return payload;
    }
    throw error;
  }
};

export const getPrimaryAdminEmail = () => normalizeEmail(process.env.NEXT_PUBLIC_PRIMARY_ADMIN_EMAIL || 'althakeel.com@gmail.com');

export const isPrimaryAdminEmail = (email: string) => {
  const primaryAdminEmail = getPrimaryAdminEmail();
  return Boolean(primaryAdminEmail) && normalizeEmail(email) === primaryAdminEmail;
};

export const ensurePrimaryAdminAccess = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  if (!isPrimaryAdminEmail(normalizedEmail)) {
    return null;
  }

  const now = Date.now();
  const accessRef = doc(db, DASHBOARD_ACCESS_COLLECTION, getAccessDocId(normalizedEmail));
  try {
    const existing = await getDoc(accessRef);

    const payload: DashboardAccessRecord = {
      email: normalizedEmail,
      role: 'admin',
      status: 'active',
      permissions: FULL_PERMISSIONS,
      createdAt: existing.exists() ? (existing.data().createdAt as number) || now : now,
      updatedAt: now,
    };

    await setDoc(accessRef, payload, { merge: true });
    setCachedAccess(payload);
    return payload;
  } catch (error) {
    if (isOfflineFirestoreError(error)) {
      const cached = getCachedAccess(normalizedEmail);
      if (cached) {
        return cached;
      }

      const fallback: DashboardAccessRecord = {
        email: normalizedEmail,
        role: 'admin',
        status: 'active',
        permissions: FULL_PERMISSIONS,
        createdAt: now,
        updatedAt: now,
      };
      setCachedAccess(fallback);
      return fallback;
    }

    throw error;
  }
};

export const getDashboardAccess = async (email: string): Promise<DashboardAccessRecord | null> => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  try {
    await ensurePrimaryAdminAccess(normalizedEmail);
    const accessRef = doc(db, DASHBOARD_ACCESS_COLLECTION, getAccessDocId(normalizedEmail));
    const snapshot = await getDoc(accessRef);

    if (!snapshot.exists()) {
      return null;
    }

    const access = normalizeRecordUsername(snapshot.data() as DashboardAccessRecord);
    setCachedAccess(access);
    return access;
  } catch (error) {
    if (isOfflineFirestoreError(error)) {
      return getCachedAccess(normalizedEmail);
    }

    throw error;
  }
};

export const ensureDashboardAccessRequest = async (email: string, username?: string) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username || '');
  if (!normalizedEmail) {
    return null;
  }

  if (isPrimaryAdminEmail(normalizedEmail)) {
    return ensurePrimaryAdminAccess(normalizedEmail);
  }

  try {
    const existing = await getDashboardAccess(normalizedEmail);
    if (existing) {
      return existing;
    }

    const request = await submitDashboardAccessRequest(normalizedEmail, normalizedUsername || undefined);
    return request;
  } catch (error) {
    if (isOfflineFirestoreError(error)) {
      const cached = getCachedAccess(normalizedEmail);
      if (cached) {
        return cached;
      }

      return submitDashboardAccessRequest(normalizedEmail, normalizedUsername || undefined);
    }

    throw error;
  }
};

export const approveDashboardAccess = async (
  email: string,
  approvedBy: string,
  permissions: DashboardPermissions = FULL_PERMISSIONS,
  username?: string
) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error('Email is required');
  }

  if (isPrimaryAdminEmail(normalizedEmail)) {
    return ensurePrimaryAdminAccess(normalizedEmail);
  }

  const now = Date.now();
  const accessRef = doc(db, DASHBOARD_ACCESS_COLLECTION, getAccessDocId(normalizedEmail));

  try {
    const existing = await getDoc(accessRef);
    const existingData = existing.exists() ? (existing.data() as DashboardAccessRecord) : null;

    const normalizedUsername = normalizeUsername(username || existingData?.username || existingData?.usernameNormalized || '');
    await assertUsernameAvailableForEmail(normalizedUsername, normalizedEmail);
    const payload: DashboardAccessRecord = {
      email: normalizedEmail,
      username: normalizedUsername || undefined,
      usernameNormalized: normalizedUsername || undefined,
      role: existingData?.role === 'admin' ? 'admin' : 'editor',
      status: 'active',
      permissions,
      approvedBy: normalizeEmail(approvedBy),
      createdAt: existingData?.createdAt || now,
      updatedAt: now,
    };

    await setDoc(accessRef, payload, { merge: true });
    await deleteDoc(doc(db, DASHBOARD_REQUESTS_COLLECTION, getAccessDocId(normalizedEmail)));
    setCachedAccess(payload);
    return payload;
  } catch (error) {
    if (isOfflineFirestoreError(error)) {
      const cached = getCachedAccess(normalizedEmail);
      const payload: DashboardAccessRecord = {
        email: normalizedEmail,
        username: normalizeUsername(username || cached?.username || cached?.usernameNormalized || '') || undefined,
        usernameNormalized: normalizeUsername(username || cached?.username || cached?.usernameNormalized || '') || undefined,
        role: cached?.role === 'admin' ? 'admin' : 'editor',
        status: 'active',
        permissions,
        approvedBy: normalizeEmail(approvedBy),
        createdAt: cached?.createdAt || now,
        updatedAt: now,
      };
      setCachedAccess(payload);
      return payload;
    }

    throw error;
  }
};

export const listDashboardUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, DASHBOARD_ACCESS_COLLECTION));
    const requestSnapshot = await getDocs(collection(db, DASHBOARD_REQUESTS_COLLECTION));

    const approvedItems = snapshot.docs
      .map((item) => normalizeRecordUsername(item.data() as DashboardAccessRecord))
      .sort((left, right) => {
        if (left.role !== right.role) {
          return left.role === 'admin' ? -1 : 1;
        }
        return left.email.localeCompare(right.email);
      });

    const approvedEmails = new Set(approvedItems.map((item) => normalizeEmail(item.email)));
    const pendingItems = requestSnapshot.docs
      .map((item) => normalizeRecordUsername(item.data() as DashboardAccessRecord))
      .filter((item) => !approvedEmails.has(normalizeEmail(item.email)));

    const items = [...approvedItems, ...pendingItems].sort((left, right) => {
      if (left.role !== right.role) {
        return left.role === 'admin' ? -1 : 1;
      }
      if (left.status !== right.status) {
        return left.status === 'pending' ? -1 : 1;
      }
      return left.email.localeCompare(right.email);
    });

    const cachedItems = Object.values(readAccessCache());
    if (items.length === 0 && cachedItems.length > 0) {
      return cachedItems.sort((left, right) => {
        if (left.role !== right.role) {
          return left.role === 'admin' ? -1 : 1;
        }
        if (left.status !== right.status) {
          return left.status === 'pending' ? -1 : 1;
        }
        return left.email.localeCompare(right.email);
      });
    }

    const cache: Record<string, DashboardAccessRecord> = {};
    for (const item of items) {
      cache[normalizeEmail(item.email)] = item;
    }
    writeAccessCache(cache);

    return items;
  } catch (error) {
    if (isOfflineFirestoreError(error)) {
      return Object.values(readAccessCache()).sort((left, right) => {
        if (left.role !== right.role) {
          return left.role === 'admin' ? -1 : 1;
        }
        return left.email.localeCompare(right.email);
      });
    }

    throw error;
  }
};

export const revokeDashboardAccess = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  if (isPrimaryAdminEmail(normalizedEmail)) {
    throw new Error('Primary admin access cannot be removed');
  }

  await deleteDoc(doc(db, DASHBOARD_ACCESS_COLLECTION, getAccessDocId(normalizedEmail)));
  await deleteDoc(doc(db, DASHBOARD_REQUESTS_COLLECTION, getAccessDocId(normalizedEmail)));
  removeCachedAccess(normalizedEmail);
};

const findCachedByUsername = (username: string): DashboardAccessRecord | null => {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return null;
  }

  const cachedItems = Object.values(readAccessCache());
  for (const item of cachedItems) {
    const itemUsername = normalizeUsername(item.usernameNormalized || item.username || '');
    if (itemUsername && itemUsername === normalizedUsername) {
      return item;
    }
  }

  return null;
};

const findDashboardRecordByUsername = async (
  collectionName: string,
  username: string
): Promise<DashboardAccessRecord | null> => {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return null;
  }

  const recordsQuery = query(
    collection(db, collectionName),
    where('usernameNormalized', '==', normalizedUsername),
    limit(1)
  );
  const snapshot = await getDocs(recordsQuery);
  if (snapshot.empty) {
    return null;
  }

  return normalizeRecordUsername(snapshot.docs[0].data() as DashboardAccessRecord);
};

const assertUsernameAvailableForEmail = async (username: string, email: string): Promise<void> => {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return;
  }

  const normalizedEmail = normalizeEmail(email);
  const existingInAccess = await findDashboardRecordByUsername(DASHBOARD_ACCESS_COLLECTION, normalizedUsername);
  if (existingInAccess && normalizeEmail(existingInAccess.email) !== normalizedEmail) {
    throw new Error('Username is already used by another account.');
  }

  const existingInRequests = await findDashboardRecordByUsername(DASHBOARD_REQUESTS_COLLECTION, normalizedUsername);
  if (existingInRequests && normalizeEmail(existingInRequests.email) !== normalizedEmail) {
    throw new Error('Username is already used by another account.');
  }
};

export const resolveDashboardLoginEmail = async (identifier: string): Promise<string | null> => {
  const normalizedIdentifier = identifier.trim();
  if (!normalizedIdentifier) {
    return null;
  }

  const maybeEmail = normalizeEmail(normalizedIdentifier);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(maybeEmail);
  if (isEmail) {
    return maybeEmail;
  }

  try {
    const fromAccess = await findDashboardRecordByUsername(DASHBOARD_ACCESS_COLLECTION, normalizedIdentifier);
    if (fromAccess?.email) {
      setCachedAccess(fromAccess);
      return normalizeEmail(fromAccess.email);
    }

    const fromRequests = await findDashboardRecordByUsername(DASHBOARD_REQUESTS_COLLECTION, normalizedIdentifier);
    if (fromRequests?.email) {
      setCachedAccess(fromRequests);
      return normalizeEmail(fromRequests.email);
    }

    const cached = findCachedByUsername(normalizedIdentifier);
    return cached?.email ? normalizeEmail(cached.email) : null;
  } catch (error) {
    if (isOfflineFirestoreError(error)) {
      const cached = findCachedByUsername(normalizedIdentifier);
      return cached?.email ? normalizeEmail(cached.email) : null;
    }

    throw error;
  }
};
