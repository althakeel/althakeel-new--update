'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  approveDashboardAccess,
  BLOGS_ONLY_PERMISSIONS,
  DashboardAccessRecord,
  FULL_PERMISSIONS,
  ensurePrimaryAdminAccess,
  getPrimaryAdminEmail,
  listDashboardUsers,
  normalizeEmail,
  revokeDashboardAccess,
} from '@/lib/admin-access';

type Tab = 'users' | 'invite';

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [denied, setDenied] = useState(false);
  const [users, setUsers] = useState<DashboardAccessRecord[]>([]);
  const [tab, setTab] = useState<Tab>('users');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [permissionPreset, setPermissionPreset] = useState<'all' | 'blogs'>('all');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const primaryAdminEmail = getPrimaryAdminEmail();

  const loadUsers = async () => {
    try {
      const list = await listDashboardUsers();
      setUsers(list);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load users.' });
    }
  };

  const upsertUser = (nextUser: DashboardAccessRecord) => {
    setUsers((prev) => {
      const index = prev.findIndex((item) => normalizeEmail(item.email) === normalizeEmail(nextUser.email));
      if (index === -1) {
        return [nextUser, ...prev];
      }

      const clone = [...prev];
      clone[index] = nextUser;
      return clone;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user?.email) {
          router.replace(`/${locale}/login`);
          return;
        }

        const email = normalizeEmail(user.email);

        if (email !== primaryAdminEmail) {
          setDenied(true);
          return;
        }

        setDenied(false);
        setAdminEmail(email);
        setLoading(false);

        void ensurePrimaryAdminAccess(email)
          .then(() => loadUsers())
          .catch(() => {
            setFeedback({
              type: 'error',
              message: 'Admin verification is slow. Please refresh in a moment.',
            });
          });
      } catch {
        setFeedback({ type: 'error', message: 'Failed to initialize admin panel.' });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, primaryAdminEmail]);

  const handleApprove = async (emailToApprove: string) => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const approvedUser = await approveDashboardAccess(
        emailToApprove,
        adminEmail,
        permissionPreset === 'all' ? FULL_PERMISSIONS : BLOGS_ONLY_PERMISSIONS
      );
      if (approvedUser) {
        upsertUser(approvedUser);
      }
      const res = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToApprove, locale }),
      });
      const result = await res.json() as { success?: boolean; message?: string };
      setFeedback({
        type: res.ok && result?.success ? 'success' : 'error',
        message: res.ok && result?.success
          ? `Access approved and email sent to ${emailToApprove}`
          : `Access approved for ${emailToApprove}, but email failed: ${result?.message || 'Unknown email error'}`,
      });
      await loadUsers();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to approve access.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async (email: string) => {
    setActionLoading(true);
    setFeedback(null);
    try {
      await revokeDashboardAccess(email);
      setUsers((prev) => prev.filter((item) => normalizeEmail(item.email) !== normalizeEmail(email)));
      setFeedback({ type: 'success', message: `Access revoked for ${email}` });
      await loadUsers();
    } catch {
      setFeedback({ type: 'error', message: 'Cannot revoke primary admin access.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInvite = async () => {
    const email = normalizeEmail(inviteEmail);
    const username = inviteUsername.trim();
    const password = invitePassword.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!username) {
      setFeedback({ type: 'error', message: 'Please enter a username.' });
      return;
    }

    if (password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be signed in as primary admin.');
      }

      const token = await currentUser.getIdToken();
      const provisionResponse = await fetch('/api/admin/users/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, username, password }),
      });

      const provisionResult = await provisionResponse.json() as { success?: boolean; message?: string };
      const provisioningSkipped = !provisionResponse.ok
        && typeof provisionResult?.message === 'string'
        && provisionResult.message.includes('Firebase Admin credentials are not configured');

      if ((!provisionResponse.ok || !provisionResult?.success) && !provisioningSkipped) {
        throw new Error(provisionResult?.message || 'Failed to set username/password credentials.');
      }

      const approvedUser = await approveDashboardAccess(
        email,
        adminEmail,
        permissionPreset === 'all' ? FULL_PERMISSIONS : BLOGS_ONLY_PERMISSIONS,
        username
      );
      if (approvedUser) {
        upsertUser(approvedUser);
      }
      const res = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const result = await res.json() as { success?: boolean; message?: string };
      setFeedback({
        type: res.ok && result?.success ? 'success' : 'error',
        message: res.ok && result?.success
          ? (provisioningSkipped
            ? `Access granted to ${email}. Credential provisioning was skipped because Firebase Admin credentials are not configured. If the Firebase Auth account already exists, the current password will still work.`
            : `Invitation sent and access granted to ${email}. Username/password created.`)
          : `Access granted to ${email}, but invitation email failed: ${result?.message || 'Unknown email error'}`,
      });
      setInviteEmail('');
      setInviteUsername('');
      setInvitePassword('');
      await loadUsers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to invite user.';
      setFeedback({ type: 'error', message });
    } finally {
      setActionLoading(false);
    }
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-amber-300 border-t-transparent animate-spin" />
      </main>
    );
  }

  /* ─── Access denied ─── */
  if (denied) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full rounded-2xl border border-red-500/30 bg-white/[0.03] p-8 text-center shadow-2xl">
          <p className="text-2xl font-bold text-red-400 mb-3">Access Denied</p>
          <p className="text-sm text-slate-400 mb-6">This page is only accessible to the primary admin.</p>
          <Link href={`/${locale}`} className="text-sm text-amber-300 hover:underline">Back to Home</Link>
        </div>
      </main>
    );
  }

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const activeUsers = users.filter((u) => u.status === 'active');

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pb-16 pt-32">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-slate-400 mt-0.5">{adminEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/dashboard`}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => { void signOut(auth).then(() => router.push(`/${locale}/login`)); }}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Active', value: activeUsers.length },
            { label: 'Pending', value: pendingUsers.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-bold text-amber-300">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-white/10 pb-0">
          {(['users', 'invite'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setFeedback(null); }}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                tab === t
                  ? 'bg-white/[0.06] text-amber-300 border border-b-0 border-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'users' ? `Users (${users.length})` : 'Invite / Grant Access'}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {feedback.message}
          </div>
        )}

        {/* ── Users tab ── */}
        {tab === 'users' && (
          <div className="space-y-3">
            {users.length === 0 && (
              <p className="text-center text-slate-500 py-12">No users yet.</p>
            )}
            {users.map((u) => (
              <div
                key={u.email}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{u.email}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {u.role}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {u.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {u.permissions.blogs ? 'Blogs' : ''}{u.permissions.transactions ? ' · Transactions' : ''}{u.permissions.calls ? ' · Calls' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {u.status === 'pending' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => void handleApprove(u.email)}
                      className="rounded-lg bg-emerald-600/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {u.email !== primaryAdminEmail && (
                    <button
                      disabled={actionLoading}
                      onClick={() => void handleRevoke(u.email)}
                      className="rounded-lg bg-red-600/70 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Invite tab ── */}
        {tab === 'invite' && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-amber-300"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Username</label>
                <input
                  type="text"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  placeholder="username"
                  className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-amber-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-amber-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Permission Level</label>
              <div className="flex gap-3">
                {(['all', 'blogs'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setPermissionPreset(preset)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                      permissionPreset === preset
                        ? 'border-amber-300/50 bg-amber-300/10 text-amber-300'
                        : 'border-white/15 text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset === 'all' ? 'Full Access' : 'Blogs Only'}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {permissionPreset === 'all'
                  ? 'Dashboard, Blogs, Transactions, Calls'
                  : 'Dashboard and Blogs only'}
              </p>
            </div>

            <button
              disabled={actionLoading}
              onClick={() => void handleInvite()}
              className="w-full rounded-xl bg-amber-300 py-3 font-bold text-slate-900 transition-colors hover:bg-amber-200 disabled:opacity-60"
            >
              {actionLoading ? 'Processing…' : 'Grant Access & Send Invitation'}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
