'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { User, signOut } from 'firebase/auth';
import Logo from '@/assets/logo/logo.png';
import {
  approveDashboardAccess,
  BLOGS_ONLY_PERMISSIONS,
  DashboardAccessRecord,
  FULL_PERMISSIONS,
  getCachedDashboardAccess,
  getCachedDashboardUsers,
  ensurePrimaryAdminAccess,
  ensureDashboardAccessRequest,
  getPrimaryAdminEmail,
  listDashboardUsers,
  normalizeEmail,
  normalizeUsername,
  revokeDashboardAccess,
} from '@/lib/admin-access';
import {
  BlogPost,
  BlogsBannerCard,
  deleteBlogFromServer,
  loadBlogsPageBannerConfigFromServer,
  saveBlogToServer,
  saveBlogsPageBannerConfigToServer,
  slugify,
} from '@/lib/blogs';

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'blogs' | 'access'>('dashboard');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [accessRole, setAccessRole] = useState<'admin' | 'editor' | null>(null);
  const [accessUsers, setAccessUsers] = useState<DashboardAccessRecord[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [permissionPreset, setPermissionPreset] = useState<'all' | 'blogs'>('all');
  const [isAccessActionLoading, setIsAccessActionLoading] = useState(false);
  const [accessFeedback, setAccessFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogTitleAr, setBlogTitleAr] = useState('');
  const [blogDate, setBlogDate] = useState('');
  const [blogShortDescription, setBlogShortDescription] = useState('');
  const [blogShortDescriptionAr, setBlogShortDescriptionAr] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogContentAr, setBlogContentAr] = useState('');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogImage, setBlogImage] = useState('');
  const [blogImageAr, setBlogImageAr] = useState('');
  const [blogBannerImage, setBlogBannerImage] = useState('');
  const [blogBannerImageAr, setBlogBannerImageAr] = useState('');
  const [blogsPageBanner, setBlogsPageBanner] = useState('');
  const [isCreateBlogFormOpen, setIsCreateBlogFormOpen] = useState(false);
  const [bannerCardTitleEn, setBannerCardTitleEn] = useState('');
  const [bannerCardTitleAr, setBannerCardTitleAr] = useState('');
  const [bannerCardSubEn, setBannerCardSubEn] = useState('');
  const [bannerCardSubAr, setBannerCardSubAr] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false);
  const [isUploadingImageAr, setIsUploadingImageAr] = useState(false);
  const [isUploadingBannerImageAr, setIsUploadingBannerImageAr] = useState(false);
  const [isUploadingPageBanner, setIsUploadingPageBanner] = useState(false);
  const [isRefreshingAutoImages, setIsRefreshingAutoImages] = useState(false);
  const [isAddingKhaleejBlogs, setIsAddingKhaleejBlogs] = useState(false);
  const [refreshingBlogId, setRefreshingBlogId] = useState<string | null>(null);
  const [blogFeedback, setBlogFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [allowedSections, setAllowedSections] = useState({
    dashboard: true,
    blogs: true,
    transactions: false,
    calls: false,
  });
  const primaryAdminEmail = getPrimaryAdminEmail();
  const effectiveUser = user || auth.currentUser;

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<{ timedOut: boolean; value?: T; error?: unknown }> => {
    return new Promise((resolve) => {
      let completed = false;

      const timeoutId = setTimeout(() => {
        if (!completed) {
          completed = true;
          resolve({ timedOut: true });
        }
      }, timeoutMs);

      promise
        .then((value) => {
          if (completed) {
            return;
          }
          completed = true;
          clearTimeout(timeoutId);
          resolve({ timedOut: false, value });
        })
        .catch((error) => {
          if (completed) {
            return;
          }
          completed = true;
          clearTimeout(timeoutId);
          resolve({ timedOut: false, error });
        });
    });
  };

  const loadPublishedBlogs = async (showErrorFeedback = false) => {
    try {
      const response = await fetch('/api/blogs', { cache: 'no-store' });
      const result = await response.json().catch(() => ({})) as {
        success?: boolean;
        blogs?: BlogPost[];
        message?: string;
      };

      if (!response.ok || !result?.success || !Array.isArray(result.blogs)) {
        throw new Error(result?.message || 'Failed to load blogs.');
      }

      const sortedBlogs = result.blogs.sort((a, b) => b.createdAt - a.createdAt);
      setBlogs(sortedBlogs);
      return sortedBlogs;
    } catch (error) {
      console.error('Load published blogs error:', error);
      if (showErrorFeedback) {
        setBlogFeedback({
          type: 'error',
          message:
            error instanceof Error && error.message
              ? error.message
              : locale === 'ar'
                ? 'تعذر تحميل المقالات من الخادم.'
                : 'Unable to load blogs from server.',
        });
      }
      return [];
    }
  };

  const sendInvitationEmail = async (payload: {
    email: string;
    locale: string;
    type?: 'invite' | 'approved';
    username?: string;
    password?: string;
  }) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = await response.json().catch(() => ({}));
      return { response, result };
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const provisionCustomerCredentials = async (payload: { email: string; username?: string; password: string }) => {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
      return {
        success: false,
        message: locale === 'ar' ? 'المستخدم غير مسجل الدخول.' : 'Admin session is not available.',
      };
    }

    const idToken = await currentUser.getIdToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let response: Response;
    try {
      response = await fetch('/api/admin/users/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error && error.name === 'AbortError'
            ? locale === 'ar'
              ? 'انتهت مهلة إنشاء بيانات الدخول. حاول مرة أخرى.'
              : 'Credential provisioning timed out. Please try again.'
            : locale === 'ar'
              ? 'تعذر إنشاء بيانات الدخول للمستخدم.'
              : 'Failed to provision user credentials.',
      };
    } finally {
      clearTimeout(timeoutId);
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result?.success) {
      return {
        success: false,
        message:
          typeof result?.message === 'string' && result.message.trim()
            ? result.message
            : locale === 'ar'
              ? 'تعذر إنشاء بيانات الدخول للمستخدم.'
              : 'Failed to provision user credentials.',
      };
    }

    return { success: true, message: '' };
  };

  const hasMissingFirebaseAdminCredentials = (message?: string) =>
    typeof message === 'string' && message.includes('Firebase Admin credentials are not configured');

  const loadAccessUsers = async () => {
    try {
      const nextUsers = await listDashboardUsers();
      setAccessUsers((currentUsers) => {
        const merged = new Map<string, DashboardAccessRecord>();

        for (const userItem of [...getCachedDashboardUsers(), ...currentUsers, ...nextUsers]) {
          merged.set(normalizeEmail(userItem.email), userItem);
        }

        return Array.from(merged.values()).sort((left, right) => {
          if (left.role !== right.role) {
            return left.role === 'admin' ? -1 : 1;
          }
          if (left.status !== right.status) {
            return left.status === 'pending' ? -1 : 1;
          }
          return left.email.localeCompare(right.email);
        });
      });
    } catch (error) {
      console.error('Load access users error:', error);
      setAccessFeedback({
        type: 'error',
        message: locale === 'ar' ? 'تعذر تحميل قائمة الصلاحيات.' : 'Unable to load access list.',
      });
    }
  };

  const applyAccessState = (access: DashboardAccessRecord | null) => {
    if (!access) {
      setAccessRole(null);
      setAllowedSections({ dashboard: true, blogs: false, transactions: false, calls: false });
      setAccessDenied(true);
      return;
    }

    setAccessRole(access.role);
    setAllowedSections(access.permissions || { dashboard: true, blogs: true, transactions: false, calls: false });
    setAccessDenied(false);
  };

  useEffect(() => {
    const bootstrapDashboardUser = (currentUser: User | null) => {
      if (!currentUser?.email) {
        setUser(null);
        setAccessRole(null);
        setAllowedSections({ dashboard: true, blogs: false, transactions: false, calls: false });
        setAccessDenied(false);
        router.push(`/${locale}/login`);
        setLoading(false);
        return;
      }

      const email = normalizeEmail(currentUser.email);
      setUser(currentUser);

      if (email === primaryAdminEmail) {
        const cachedUsers = getCachedDashboardUsers();
        const fallbackAdminUser: DashboardAccessRecord = {
          email,
          role: 'admin',
          status: 'active',
          permissions: FULL_PERMISSIONS,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setAccessRole('admin');
        setAllowedSections({ dashboard: true, blogs: true, transactions: true, calls: true });
        setAccessUsers(cachedUsers.length > 0 ? cachedUsers : [fallbackAdminUser]);
        setAccessDenied(false);
        setLoading(false);
        void loadAccessUsers();

        void withTimeout(ensurePrimaryAdminAccess(email), 10000)
          .then((result) => {
            if (result.error) {
              throw result.error;
            }

            if (!result.timedOut) {
              void loadAccessUsers();
            }
          })
          .catch((error) => {
            console.error('Primary admin access sync warning:', error);
          });

        return;
      }

      const cachedAccess = getCachedDashboardAccess(email);
      applyAccessState(cachedAccess);
      setLoading(false);

      void withTimeout(ensureDashboardAccessRequest(email), 10000)
        .then((result) => {
          if (result.error) {
            throw result.error;
          }

          const fallbackPendingAccess: DashboardAccessRecord = {
            email,
            role: 'editor',
            status: 'pending',
            permissions: BLOGS_ONLY_PERMISSIONS,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          const access = result.timedOut
            ? cachedAccess || fallbackPendingAccess
            : result.value || null;

          applyAccessState(access);

          if (access?.role === 'admin') {
            void loadAccessUsers();
          }
        })
        .catch((error) => {
          console.error('Dashboard access error:', error);
          if (!cachedAccess) {
            setAccessDenied(true);
          }
        });
    };

    bootstrapDashboardUser(auth.currentUser);

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      bootstrapDashboardUser(currentUser);
    });

    return () => unsubscribe();
  }, [router, locale, primaryAdminEmail]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const fallbackUser = auth.currentUser;

      if (!fallbackUser?.email) {
        setLoading(false);
        return;
      }

      const email = normalizeEmail(fallbackUser.email);
      setUser(fallbackUser);

      if (email === primaryAdminEmail) {
        const cachedUsers = getCachedDashboardUsers();
        setAccessRole('admin');
        setAllowedSections({ dashboard: true, blogs: true, transactions: true, calls: true });
        setAccessUsers(cachedUsers);
        setAccessDenied(false);
        setLoading(false);
        return;
      }

      const cachedAccess = getCachedDashboardAccess(email) || {
        email,
        role: 'editor' as const,
        status: 'pending' as const,
        permissions: BLOGS_ONLY_PERMISSIONS,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      applyAccessState(cachedAccess);
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [loading, primaryAdminEmail]);

  useEffect(() => {
    const loadServerContent = async () => {
      const [serverBlogs, bannerConfig] = await Promise.all([
        loadPublishedBlogs(),
        loadBlogsPageBannerConfigFromServer(),
      ]);

      setBlogs(serverBlogs);
      setBlogsPageBanner(bannerConfig.bannerUrl);
      setBannerCardTitleEn(bannerConfig.card.titleEn);
      setBannerCardTitleAr(bannerConfig.card.titleAr);
      setBannerCardSubEn(bannerConfig.card.subEn);
      setBannerCardSubAr(bannerConfig.card.subAr);
    };

    void loadServerContent();
  }, []);

  useEffect(() => {
    if (activeSection === 'blogs' && !allowedSections.blogs) {
      setActiveSection('dashboard');
    }
  }, [activeSection, allowedSections.blogs]);

  useEffect(() => {
    if (activeSection === 'access' && accessRole !== 'admin') {
      setActiveSection('dashboard');
    }
  }, [activeSection, accessRole]);

  useEffect(() => {
    if (accessRole === 'admin' && activeSection === 'access') {
      void loadAccessUsers();
    }
  }, [accessRole, activeSection]);

  const handleApproveAccess = async (emailToApprove?: string, usernameToApprove?: string) => {
    if (!user?.email) {
      return;
    }

    const normalizedInviteEmail = normalizeEmail(emailToApprove || inviteEmail);
    const normalizedInviteUsername = normalizeUsername(usernameToApprove || inviteUsername);
    const normalizedInvitePassword = invitePassword.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedInviteEmail);

    if (!isEmail) {
      setAccessFeedback({
        type: 'error',
        message: locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.',
      });
      return;
    }

    if (!normalizedInviteUsername) {
      setAccessFeedback({
        type: 'error',
        message:
          locale === 'ar'
            ? 'يرجى إدخال اسم مستخدم للموافقة.'
            : 'Please provide a username for approval.',
      });
      return;
    }

    if (normalizedInvitePassword.length < 6) {
      setAccessFeedback({
        type: 'error',
        message:
          locale === 'ar'
            ? 'يرجى إدخال كلمة مرور لا تقل عن 6 أحرف.'
            : 'Please provide a password with at least 6 characters.',
      });
      return;
    }

    try {
      setIsAccessActionLoading(true);
      const approvalSave = await approveDashboardAccess(
        normalizedInviteEmail,
        user.email,
        permissionPreset === 'all' ? FULL_PERMISSIONS : BLOGS_ONLY_PERMISSIONS,
        normalizedInviteUsername || undefined
      );

      const provisionResult = await provisionCustomerCredentials({
        email: normalizedInviteEmail,
        username: normalizedInviteUsername || undefined,
        password: normalizedInvitePassword,
      });

      const provisioningSkipped = !provisionResult.success && hasMissingFirebaseAdminCredentials(provisionResult.message);
      if (!provisionResult.success && !provisioningSkipped) {
        throw new Error(provisionResult.message);
      }

      const { response: inviteResponse, result: inviteResult } = await sendInvitationEmail({
        email: normalizedInviteEmail,
        locale,
        type: 'approved',
        username: provisionResult.success ? normalizedInviteUsername || undefined : undefined,
        password: provisionResult.success ? normalizedInvitePassword : undefined,
      });

      setInviteEmail('');
      setInviteUsername('');
      setInvitePassword('');
      if (provisionResult.success) {
        setAccessFeedback({
          type: inviteResponse.ok && inviteResult?.success ? 'success' : 'error',
          message: inviteResponse.ok && inviteResult?.success
            ? locale === 'ar'
              ? 'تمت الموافقة وإنشاء اسم المستخدم/كلمة المرور وإرسال البريد بنجاح.'
              : 'Access approved, username/password provisioned, and email sent successfully.'
            : (typeof inviteResult?.message === 'string' && inviteResult.message.trim())
              ? inviteResult.message
              : locale === 'ar'
                ? 'تمت الموافقة وإنشاء بيانات الدخول لكن فشل إرسال البريد. تحقق من إعدادات Resend.'
                : 'Access approved and credentials provisioned, but email failed to send. Check Resend configuration.',
        });
      } else if (provisioningSkipped) {
        setAccessFeedback({
          type: inviteResponse.ok && inviteResult?.success ? 'success' : 'error',
          message: inviteResponse.ok && inviteResult?.success
            ? locale === 'ar'
              ? 'تمت الموافقة، وتم تجاهل مزامنة كلمة المرور لأن بيانات Firebase Admin غير مهيأة. إذا كان الحساب موجوداً مسبقاً في Firebase Auth، يمكنك تسجيل الدخول بكلمة المرور الحالية.'
              : 'Access approved, and password provisioning was skipped because Firebase Admin credentials are not configured. If the Firebase Auth account already exists, you can log in with the current password.'
            : (typeof inviteResult?.message === 'string' && inviteResult.message.trim())
              ? inviteResult.message
              : locale === 'ar'
                ? 'تمت الموافقة لكن فشل إرسال البريد. تحقق من إعدادات Resend.'
                : 'Access approved, but email failed to send. Check Resend configuration.',
        });
      } else {
        setAccessFeedback({
          type: 'error',
          message:
            locale === 'ar'
              ? `تمت الموافقة لكن تعذر إنشاء اسم المستخدم/كلمة المرور: ${provisionResult.message}`
              : `Access approved, but username/password provisioning failed: ${provisionResult.message}`,
        });
      }
      void loadAccessUsers();
    } catch (error) {
      console.error('Approve access error:', error);
      setAccessFeedback({
        type: 'error',
        message:
          error instanceof Error && error.message
            ? error.message
            : locale === 'ar'
              ? 'تعذر منح الموافقة.'
              : 'Unable to approve access.',
      });
    } finally {
      setIsAccessActionLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    const normalizedInviteEmail = normalizeEmail(inviteEmail);
    const normalizedInviteUsername = normalizeUsername(inviteUsername);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedInviteEmail);

    if (!isEmail) {
      setAccessFeedback({
        type: 'error',
        message: locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.',
      });
      return;
    }

    try {
      setIsAccessActionLoading(true);
      const requestSave = await withTimeout(
        ensureDashboardAccessRequest(normalizedInviteEmail, normalizedInviteUsername || undefined),
        12000
      );

      if (requestSave.timedOut) {
        setAccessFeedback({
          type: 'error',
          message:
            locale === 'ar'
              ? 'استغرق حفظ طلب الوصول وقتا طويلا. تم إرسال الدعوة البريدية على أي حال.'
              : 'Saving access request took too long. Invitation email will still be attempted.',
        });
      } else if (requestSave.error) {
        throw requestSave.error;
      }

      const { response: inviteResponse, result: inviteResult } = await sendInvitationEmail({
        email: normalizedInviteEmail,
        locale,
        type: 'invite',
      });

      setAccessFeedback({
        type: inviteResponse.ok && inviteResult?.success ? 'success' : 'error',
        message: inviteResponse.ok && inviteResult?.success
          ? locale === 'ar'
            ? 'تم إرسال دعوة الوصول بنجاح.'
            : 'Access invitation email sent successfully.'
          : (typeof inviteResult?.message === 'string' && inviteResult.message.trim())
            ? inviteResult.message
            : locale === 'ar'
              ? 'تعذر إرسال الدعوة. تحقق من إعدادات Resend.'
              : 'Failed to send invitation. Check Resend configuration.',
      });

      void loadAccessUsers();
    } catch (error) {
      console.error('Send invitation error:', error);
      setAccessFeedback({
        type: 'error',
        message:
          error instanceof Error && error.message
            ? error.message
            : locale === 'ar'
              ? 'تعذر إرسال الدعوة.'
              : 'Unable to send invitation.',
      });
    } finally {
      setIsAccessActionLoading(false);
    }
  };

  const handleRevokeAccess = async (email: string) => {
    try {
      await revokeDashboardAccess(email);
      setAccessFeedback({
        type: 'success',
        message: locale === 'ar' ? 'تم سحب الوصول.' : 'Access revoked successfully.',
      });
      await loadAccessUsers();
    } catch (error) {
      console.error('Revoke access error:', error);
      setAccessFeedback({
        type: 'error',
        message:
          locale === 'ar'
            ? 'تعذر سحب الوصول. لا يمكن إزالة البريد الإداري الرئيسي.'
            : 'Unable to revoke access. The primary admin email cannot be removed.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: 'card' | 'banner' | 'cardAr' | 'bannerAr') => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (target === 'card') {
      setIsUploadingImage(true);
    } else if (target === 'banner') {
      setIsUploadingBannerImage(true);
    } else if (target === 'cardAr') {
      setIsUploadingImageAr(true);
    } else {
      setIsUploadingBannerImageAr(true);
    }
    setBlogFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result?.success || !result?.url) {
        throw new Error(result?.message || 'Image upload failed');
      }

      if (target === 'card') {
        setBlogImage(result.url);
      } else if (target === 'banner') {
        setBlogBannerImage(result.url);
      } else if (target === 'cardAr') {
        setBlogImageAr(result.url);
      } else {
        setBlogBannerImageAr(result.url);
      }
      setBlogFeedback({
        type: 'success',
        message:
          target === 'card'
            ? locale === 'ar'
              ? 'تم رفع صورة البطاقة بنجاح.'
              : 'Card image uploaded successfully.'
            : target === 'banner'
              ? locale === 'ar'
                ? 'تم رفع صورة البانر بنجاح.'
                : 'Banner image uploaded successfully.'
              : target === 'cardAr'
                ? locale === 'ar'
                  ? 'تم رفع صورة البطاقة العربية بنجاح.'
                  : 'Arabic card image uploaded successfully.'
                : locale === 'ar'
                  ? 'تم رفع صورة البانر العربية بنجاح.'
                  : 'Arabic banner image uploaded successfully.',
      });
    } catch (error) {
      console.error('Image upload error:', error);
      const detailedMessage = error instanceof Error && error.message
        ? error.message
        : locale === 'ar'
          ? 'فشل رفع الصورة. سبب غير معروف.'
          : 'Image upload failed due to an unknown error.';
      setBlogFeedback({
        type: 'error',
        message: detailedMessage,
      });
    } finally {
      if (target === 'card') {
        setIsUploadingImage(false);
      } else if (target === 'banner') {
        setIsUploadingBannerImage(false);
      } else if (target === 'cardAr') {
        setIsUploadingImageAr(false);
      } else {
        setIsUploadingBannerImageAr(false);
      }
      event.target.value = '';
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setIsCreateBlogFormOpen(false);
    setBlogTitle('');
    setBlogTitleAr('');
    setBlogDate('');
    setBlogShortDescription('');
    setBlogShortDescriptionAr('');
    setBlogContent('');
    setBlogContentAr('');
    setBlogImage('');
    setBlogImageAr('');
    setBlogBannerImage('');
    setBlogBannerImageAr('');
  };

  const handlePageBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingPageBanner(true);
    setBlogFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result?.success || !result?.url) {
        throw new Error(result?.message || 'Banner upload failed');
      }

      setBlogsPageBanner(result.url);
      const card: BlogsBannerCard = {
        titleEn: bannerCardTitleEn.trim(),
        titleAr: bannerCardTitleAr.trim(),
        subEn: bannerCardSubEn.trim(),
        subAr: bannerCardSubAr.trim(),
      };
      await saveBlogsPageBannerConfigToServer({
        bannerUrl: result.url,
        card,
        updatedBy: user?.email || undefined,
      });
      setBlogFeedback({
        type: 'success',
        message: locale === 'ar' ? 'تم رفع بانر صفحة المدونة بنجاح.' : 'Blogs page banner uploaded successfully.',
      });
    } catch (error) {
      console.error('Blogs page banner upload error:', error);
      const detailedMessage = error instanceof Error && error.message
        ? error.message
        : locale === 'ar'
          ? 'فشل رفع بانر الصفحة.'
          : 'Blogs page banner upload failed.';
      setBlogFeedback({
        type: 'error',
        message: detailedMessage,
      });
    } finally {
      setIsUploadingPageBanner(false);
      event.target.value = '';
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setIsCreateBlogFormOpen(true);
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogTitleAr(blog.titleAr || '');
    setBlogDate(blog.date);
    setBlogShortDescription(blog.shortDescription);
    setBlogShortDescriptionAr(blog.shortDescriptionAr || '');
    setBlogContent(blog.content);
    setBlogContentAr(blog.contentAr || '');
    setBlogImage(blog.image);
    setBlogImageAr(blog.imageAr || '');
    setBlogBannerImage(blog.bannerImage || '');
    setBlogBannerImageAr(blog.bannerImageAr || '');
    setBlogFeedback(null);
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      await deleteBlogFromServer(blogId);
      const nextBlogs = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(nextBlogs);

      if (editingBlogId === blogId) {
        resetBlogForm();
      }

      setBlogFeedback({
        type: 'success',
        message: locale === 'ar' ? 'تم حذف المقالة.' : 'Blog deleted successfully.',
      });
    } catch (error) {
      console.error('Delete blog error:', error);
      setBlogFeedback({
        type: 'error',
        message: locale === 'ar' ? 'تعذر حذف المقالة.' : 'Failed to delete blog.',
      });
    }
  };

  const handleRefreshDuplicateAutoImages = async () => {
    try {
      setIsRefreshingAutoImages(true);
      setBlogFeedback(null);

      const response = await fetch('/api/blogs/auto-daily?refreshImages=1&onlyDuplicates=1', {
        method: 'POST',
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to refresh auto blog images.');
      }

      const serverBlogs = await loadPublishedBlogs();
      setBlogs(serverBlogs);

      const refreshedCount = Number(result?.refreshed || 0);
      setBlogFeedback({
        type: 'success',
        message:
          refreshedCount > 0
            ? locale === 'ar'
              ? `تم تحديث ${refreshedCount} صورة للمقالات التلقائية.`
              : `Refreshed ${refreshedCount} auto-blog image(s).`
            : locale === 'ar'
              ? 'لا توجد صور مكررة للمقالات التلقائية للتحديث.'
              : 'No duplicate auto-blog images found to refresh.',
      });
    } catch (error) {
      console.error('Refresh duplicate auto images error:', error);
      setBlogFeedback({
        type: 'error',
        message:
          error instanceof Error && error.message
            ? error.message
            : locale === 'ar'
              ? 'تعذر تحديث صور المقالات التلقائية.'
              : 'Failed to refresh auto-blog images.',
      });
    } finally {
      setIsRefreshingAutoImages(false);
    }
  };

  const handleRefreshSingleBlogImage = async (blog: BlogPost) => {
    try {
      setRefreshingBlogId(blog.id);
      setBlogFeedback(null);

      const response = await fetch(`/api/blogs/auto-daily?refreshImages=1&blogId=${encodeURIComponent(blog.id)}`, {
        method: 'POST',
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to refresh this blog image.');
      }

      const serverBlogs = await loadPublishedBlogs();
      setBlogs(serverBlogs);
      setBlogFeedback({
        type: 'success',
        message:
          locale === 'ar'
            ? 'تم تحديث صورة المقالة المحددة.'
            : 'Selected blog image refreshed successfully.',
      });
    } catch (error) {
      console.error('Refresh single blog image error:', error);
      setBlogFeedback({
        type: 'error',
        message:
          error instanceof Error && error.message
            ? error.message
            : locale === 'ar'
              ? 'تعذر تحديث صورة المقالة.'
              : 'Failed to refresh selected blog image.',
      });
    } finally {
      setRefreshingBlogId(null);
    }
  };

  const handleAddKhaleejBlogs = async () => {
    try {
      setIsAddingKhaleejBlogs(true);
      setBlogFeedback(null);

      const response = await fetch('/api/blogs/auto-daily?addKhaleej=1&count=5', {
        method: 'POST',
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to add Khaleej blogs.');
      }

      const serverBlogs = await loadPublishedBlogs();
      setBlogs(serverBlogs);

      const createdCount = Number(result?.created || 0);
      setBlogFeedback({
        type: 'success',
        message:
          createdCount > 0
            ? locale === 'ar'
              ? `تمت إضافة ${createdCount} مقالات من خليج تايمز.`
              : `Added ${createdCount} blog(s) from Khaleej Times.`
            : locale === 'ar'
              ? 'لم يتم العثور على مقالات جديدة من خليج تايمز.'
              : 'No new Khaleej Times articles were available to add.',
      });
    } catch (error) {
      console.error('Add Khaleej blogs error:', error);
      setBlogFeedback({
        type: 'error',
        message:
          error instanceof Error && error.message
            ? error.message
            : locale === 'ar'
              ? 'تعذر إضافة مقالات خليج تايمز.'
              : 'Failed to add Khaleej blogs.',
      });
    } finally {
      setIsAddingKhaleejBlogs(false);
    }
  };

  const handleCreateBlog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBlogFeedback(null);

    if (!blogTitle.trim() || !blogDate || !blogShortDescription.trim() || !blogContent.trim() || !blogImage || !blogBannerImage) {
      setBlogFeedback({
        type: 'error',
        message:
          locale === 'ar'
            ? 'يرجى تعبئة جميع الحقول ورفع صورة البطاقة وصورة البانر.'
            : 'Please fill all fields and upload both card and banner images.',
      });
      return;
    }

    try {
      if (editingBlogId) {
        const existingBlog = blogs.find((blog) => blog.id === editingBlogId);

        if (!existingBlog) {
          throw new Error('Blog not found');
        }

        const savedBlog = await saveBlogToServer(
          {
            ...existingBlog,
            title: blogTitle.trim(),
            titleAr: blogTitleAr.trim() || undefined,
            date: blogDate,
            shortDescription: blogShortDescription.trim(),
            shortDescriptionAr: blogShortDescriptionAr.trim() || undefined,
            content: blogContent.trim(),
            contentAr: blogContentAr.trim() || undefined,
            image: blogImage,
            imageAr: blogImageAr || undefined,
            bannerImage: blogBannerImage,
            bannerImageAr: blogBannerImageAr || undefined,
          },
          user?.email || undefined
        );

        setBlogs((currentBlogs) => currentBlogs.map((blog) => (blog.id === savedBlog.id ? savedBlog : blog)));
        resetBlogForm();
        setBlogFeedback({
          type: 'success',
          message: locale === 'ar' ? 'تم تحديث المقالة بنجاح.' : 'Blog updated successfully.',
        });
        return;
      }

      const baseSlug = slugify(blogTitle);
      const slugExists = blogs.some((blog) => blog.slug === baseSlug);
      const finalSlug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;

      const savedBlog = await saveBlogToServer(
        {
          id: crypto.randomUUID(),
          slug: finalSlug,
          title: blogTitle.trim(),
          titleAr: blogTitleAr.trim() || undefined,
          date: blogDate,
          shortDescription: blogShortDescription.trim(),
          shortDescriptionAr: blogShortDescriptionAr.trim() || undefined,
          content: blogContent.trim(),
          contentAr: blogContentAr.trim() || undefined,
          image: blogImage,
          imageAr: blogImageAr || undefined,
          bannerImage: blogBannerImage,
          bannerImageAr: blogBannerImageAr || undefined,
          createdAt: Date.now(),
        },
        user?.email || undefined
      );

      setBlogs((currentBlogs) => [savedBlog, ...currentBlogs.filter((blog) => blog.id !== savedBlog.id)]);
      resetBlogForm();
      setBlogFeedback({
        type: 'success',
        message: locale === 'ar' ? 'تم إنشاء المقالة بنجاح.' : 'Blog created successfully.',
      });
    } catch (error) {
      console.error('Save blog error:', error);
      setBlogFeedback({
        type: 'error',
        message: locale === 'ar' ? 'تعذر حفظ المقالة.' : 'Failed to save blog.',
      });
    }
  };

  if (loading && !effectiveUser?.email) {
    return (
      <div className="min-h-screen bg-[#F1EFF0]">
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-gray-600">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#F1EFF0] px-5 py-24">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-3xl font-bold text-[#160A0A]">
            {locale === 'ar' ? 'الوصول مرفوض' : 'Access Denied'}
          </h1>
          <p className="mb-4 text-slate-600">
            {locale === 'ar'
              ? 'هذا البريد الإلكتروني لا يملك صلاحية دخول لوحة المدونة بعد. يلزم موافقة البريد الإداري الرئيسي أولاً.'
              : 'This email does not have dashboard access yet. The primary admin must approve it first.'}
          </p>
          <p className="mb-4 rounded-xl border border-[#CECDCB] bg-[#F8F7F7] px-4 py-3 text-sm text-slate-600">
            {locale === 'ar'
              ? `أنت مسجل الدخول بواسطة: ${effectiveUser?.email || 'غير معروف'}`
              : `Signed in as: ${effectiveUser?.email || 'Unknown'}`}
          </p>
          <p className="mb-6 rounded-xl border border-[#CECDCB] bg-[#F8F7F7] px-4 py-3 text-sm text-slate-600">
            {locale === 'ar'
              ? `البريد الإداري الرئيسي: ${primaryAdminEmail || 'غير محدد'}`
              : `Primary admin email: ${primaryAdminEmail || 'Not configured'}`}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/login`} className="rounded-xl bg-[#DE3B34] px-5 py-3 font-semibold text-white hover:bg-[#9B0F09] transition-colors">
              {locale === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-[#CECDCB] px-5 py-3 font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors"
            >
              {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFF0]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-72 md:flex md:flex-col bg-[#160A0A] text-white p-6 pt-24">
        <div className="mb-10">
          <Image src={Logo} alt="Almahy Logo" width={150} height={56} className="object-contain" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className={`w-full rounded-xl px-4 py-3 font-semibold text-left transition-colors ${
              activeSection === 'dashboard' ? 'bg-[#DE3B34] text-white' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </button>
          {allowedSections.blogs ? (
            <button
              type="button"
              onClick={() => setActiveSection('blogs')}
              className={`w-full rounded-xl px-4 py-3 font-semibold text-left transition-colors ${
                activeSection === 'blogs' ? 'bg-[#DE3B34] text-white' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {locale === 'ar' ? 'إدارة المدونة' : 'Blogs'}
            </button>
          ) : null}
          {accessRole === 'admin' ? (
            <button
              type="button"
              onClick={() => setActiveSection('access')}
              className={`w-full rounded-xl px-4 py-3 font-semibold text-left transition-colors ${
                activeSection === 'access' ? 'bg-[#DE3B34] text-white' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {locale === 'ar' ? 'إدارة المستخدمين' : 'Users Access'}
            </button>
          ) : null}
          {allowedSections.transactions ? (
            <div className="rounded-xl px-4 py-3 text-white/80 pointer-events-none">
              {locale === 'ar' ? 'المعاملات' : 'Transactions'}
            </div>
          ) : null}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-white/30 px-4 py-3 font-semibold hover:bg-white/10 transition-colors"
          >
            {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      <main className="md:ml-72 px-5 pb-5 pt-24 md:px-10 md:pb-10 md:pt-24">
        <div className="md:hidden mb-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <Image src={Logo} alt="Almahy Logo" width={120} height={45} className="object-contain" />
          <button
            onClick={handleLogout}
            className="rounded-lg bg-[#DE3B34] px-3 py-2 text-sm font-semibold text-white"
          >
            {locale === 'ar' ? 'خروج' : 'Logout'}
          </button>
        </div>

        <div className={`md:hidden mb-4 grid gap-2 ${allowedSections.blogs && accessRole === 'admin' ? 'grid-cols-3' : allowedSections.blogs || accessRole === 'admin' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className={`rounded-xl px-4 py-2.5 font-semibold transition-colors ${
              activeSection === 'dashboard' ? 'bg-[#DE3B34] text-white' : 'bg-white text-[#160A0A]'
            }`}
          >
            {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </button>
          {allowedSections.blogs ? (
            <button
              type="button"
              onClick={() => setActiveSection('blogs')}
              className={`rounded-xl px-4 py-2.5 font-semibold transition-colors ${
                activeSection === 'blogs' ? 'bg-[#DE3B34] text-white' : 'bg-white text-[#160A0A]'
              }`}
            >
              {locale === 'ar' ? 'المدونة' : 'Blogs'}
            </button>
          ) : null}
          {accessRole === 'admin' ? (
            <button
              type="button"
              onClick={() => setActiveSection('access')}
              className={`rounded-xl px-4 py-2.5 font-semibold transition-colors ${
                activeSection === 'access' ? 'bg-[#DE3B34] text-white' : 'bg-white text-[#160A0A]'
              }`}
            >
              {locale === 'ar' ? 'المستخدمون' : 'Users'}
            </button>
          ) : null}
        </div>

        {activeSection === 'dashboard' ? (
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-[#160A0A] mb-2">
              {locale === 'ar' ? 'مرحبا بعودتك' : 'Welcome Back'}
            </h1>
            <p className="text-slate-600 mb-8">
              {locale === 'ar'
                ? `مرحبا ${effectiveUser?.email || 'المستخدم'}`
                : `Hello ${effectiveUser?.email || 'User'}`}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <section className="rounded-xl border border-[#CECDCB] p-5">
                <h2 className="text-lg font-semibold text-[#160A0A] mb-2">
                  {locale === 'ar' ? 'ملخص الحساب' : 'Account Summary'}
                </h2>
                <p className="text-slate-600 text-sm">
                  {locale === 'ar'
                    ? 'عرض حالة حسابك وأحدث النشاطات.'
                    : 'View your account status and latest activity.'}
                </p>
              </section>

              <section className="rounded-xl border border-[#CECDCB] p-5">
                <h2 className="text-lg font-semibold text-[#160A0A] mb-2">
                  {locale === 'ar' ? 'الوصول السريع' : 'Quick Access'}
                </h2>
                <p className="text-slate-600 text-sm">
                  {locale === 'ar'
                    ? 'الوصول إلى الخدمات الأساسية من مكان واحد.'
                    : 'Access core services from one place.'}
                </p>
              </section>
            </div>
          </div>
        ) : activeSection === 'access' ? (
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
              <h1 className="mb-2 text-2xl md:text-3xl font-bold text-[#160A0A]">
                {locale === 'ar' ? 'إدارة صلاحيات لوحة التحكم' : 'Admin Panel Access'}
              </h1>
              <p className="mb-6 text-sm text-slate-600">
                {locale === 'ar'
                  ? 'يمكن للبريد الإداري الرئيسي فقط الموافقة على المستخدمين وتحديد نوع الصلاحية (وصول كامل أو المدونة فقط).'
                  : 'Only the primary admin can approve users and manually choose access type (Full Access or Blogs Only).'}
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:col-span-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder={locale === 'ar' ? 'أدخل البريد الإلكتروني للموافقة عليه' : 'Enter an email to approve'}
                    className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                  />
                  <input
                    type="text"
                    value={inviteUsername}
                    onChange={(event) => setInviteUsername(event.target.value)}
                    placeholder={locale === 'ar' ? 'اسم المستخدم (مطلوب للموافقة)' : 'Username (required for approval)'}
                    className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                  />
                  <input
                    type="password"
                    value={invitePassword}
                    onChange={(event) => setInvitePassword(event.target.value)}
                    placeholder={locale === 'ar' ? 'كلمة المرور (مطلوبة للموافقة)' : 'Password (required for approval)'}
                    className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                  />
                </div>
                <select
                  value={permissionPreset}
                  onChange={(event) => setPermissionPreset(event.target.value as 'all' | 'blogs')}
                  className="rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                >
                  <option value="all">{locale === 'ar' ? 'وصول كامل' : 'Full Access'}</option>
                  <option value="blogs">{locale === 'ar' ? 'المدونة فقط' : 'Blogs Only'}</option>
                </select>
                <button
                  type="button"
                  disabled={isAccessActionLoading}
                  onClick={() => void handleSendInvitation()}
                  className="rounded-xl border border-[#CECDCB] bg-white px-6 py-3 font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors disabled:opacity-60"
                >
                  {locale === 'ar' ? 'إرسال دعوة' : 'Send Invitation'}
                </button>
                <button
                  type="button"
                  disabled={isAccessActionLoading}
                  onClick={() => void handleApproveAccess()}
                  className="rounded-xl bg-[#DE3B34] px-6 py-3 font-semibold text-white hover:bg-[#9B0F09] transition-colors"
                >
                  {isAccessActionLoading
                    ? locale === 'ar'
                      ? 'جارٍ التنفيذ...'
                      : 'Processing...'
                    : locale === 'ar'
                      ? 'منح الموافقة'
                      : 'Approve Access'}
                </button>
              </div>

              {accessFeedback ? (
                <p className={`mt-4 text-sm ${accessFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {accessFeedback.message}
                </p>
              ) : null}

              <div className="mt-6 rounded-xl border border-[#CECDCB] bg-[#F8F7F7] px-4 py-3 text-sm text-slate-600">
                {locale === 'ar'
                  ? `البريد الإداري الرئيسي الحالي: ${primaryAdminEmail || 'غير محدد'}`
                  : `Current primary admin email: ${primaryAdminEmail || 'Not configured'}`}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[#160A0A]">
                  {locale === 'ar' ? 'المستخدمون المصرح لهم' : 'Authorized Users'}
                </h2>
                <button
                  type="button"
                  onClick={() => void loadAccessUsers()}
                  className="text-sm font-semibold text-[#DE3B34] hover:text-[#9B0F09]"
                >
                  {locale === 'ar' ? 'تحديث القائمة' : 'Refresh List'}
                </button>
              </div>

              {accessUsers.length === 0 ? (
                <p className="text-sm text-slate-600">
                  {locale === 'ar' ? 'لا يوجد مستخدمون مصرح لهم بعد.' : 'No authorized users yet.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {accessUsers.map((accessUser) => (
                    <article key={accessUser.email} className="flex flex-col gap-3 rounded-xl border border-[#CECDCB] p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-[#160A0A]">{accessUser.email}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {locale === 'ar'
                            ? `اسم المستخدم: ${accessUser.username || '-'}`
                            : `Username: ${accessUser.username || '-'}`}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {locale === 'ar'
                            ? `${accessUser.role === 'admin' ? 'مدير' : 'محرر'} - ${accessUser.status === 'active' ? 'نشط' : 'بانتظار الموافقة'}`
                            : `${accessUser.role === 'admin' ? 'Admin' : 'Editor'} - ${accessUser.status === 'active' ? 'Active' : 'Pending Approval'}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {accessUser.permissions?.transactions || accessUser.permissions?.calls
                            ? locale === 'ar'
                              ? 'الصلاحية: وصول كامل'
                              : 'Permission: Full Access'
                            : locale === 'ar'
                              ? 'الصلاحية: المدونة فقط'
                              : 'Permission: Blogs Only'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {accessUser.role !== 'admin' ? (
                          <>
                            {accessUser.status !== 'active' ? (
                              <button
                                type="button"
                                onClick={() => void handleApproveAccess(accessUser.email, accessUser.username)}
                                className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                              >
                                {locale === 'ar' ? 'موافقة' : 'Approve'}
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => void handleRevokeAccess(accessUser.email)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
                            >
                              {locale === 'ar' ? 'سحب الوصول' : 'Revoke Access'}
                            </button>
                          </>
                        ) : (
                          <span className="rounded-lg bg-[#F1EFF0] px-3 py-2 text-xs font-semibold text-slate-600">
                            {locale === 'ar' ? 'الإدارة الرئيسية' : 'Primary Admin'}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-[#160A0A] mb-4">
                {locale === 'ar' ? 'بانر صفحة المدونة' : 'Blogs Page Banner'}
              </h1>
              <p className="text-sm text-slate-600 mb-4">
                {locale === 'ar'
                  ? 'هذا البانر مستقل تمامًا عن المقالات.'
                  : 'This banner is fully separate and not connected to any blog post.'}
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handlePageBannerUpload}
                disabled={isUploadingPageBanner}
                className="w-full md:w-auto rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] disabled:opacity-60"
              />

              {isUploadingPageBanner ? (
                <p className="text-sm text-slate-600 mt-3">
                  {locale === 'ar' ? 'جاري رفع بانر الصفحة...' : 'Uploading blogs page banner...'}
                </p>
              ) : null}

              {blogsPageBanner ? (
                <div className="mt-4 rounded-xl border border-[#CECDCB] p-2 w-fit">
                  <p className="mb-1 text-xs text-slate-500">{locale === 'ar' ? 'معاينة بانر الصفحة' : 'Blogs page banner preview'}</p>
                  <img src={blogsPageBanner} alt="Blogs page banner preview" className="h-[150px] w-[320px] rounded-lg object-cover" />
                </div>
              ) : null}

              {/* Banner card text */}
              <div className="mt-6 border-t border-[#CECDCB] pt-5">
                <p className="text-sm font-semibold text-[#160A0A] mb-3">
                  {locale === 'ar' ? 'نص البطاقة على البانر' : 'Banner Card Text'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Title (English)</p>
                    <input
                      type="text"
                      value={bannerCardTitleEn}
                      onChange={(e) => setBannerCardTitleEn(e.target.value)}
                      placeholder="e.g. Legal Blog"
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">العنوان (عربي)</p>
                    <input
                      type="text"
                      value={bannerCardTitleAr}
                      onChange={(e) => setBannerCardTitleAr(e.target.value)}
                      placeholder="مثال: المدونة القانونية"
                      dir="rtl"
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Subtitle (English)</p>
                    <input
                      type="text"
                      value={bannerCardSubEn}
                      onChange={(e) => setBannerCardSubEn(e.target.value)}
                      placeholder="e.g. Latest legal articles from our team."
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] text-sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">الوصف (عربي)</p>
                    <input
                      type="text"
                      value={bannerCardSubAr}
                      onChange={(e) => setBannerCardSubAr(e.target.value)}
                      placeholder="مثال: مقالات قانونية حديثة من فريقنا."
                      dir="rtl"
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const card: BlogsBannerCard = {
                      titleEn: bannerCardTitleEn.trim(),
                      titleAr: bannerCardTitleAr.trim(),
                      subEn: bannerCardSubEn.trim(),
                      subAr: bannerCardSubAr.trim(),
                    };
                    try {
                      await saveBlogsPageBannerConfigToServer({
                        bannerUrl: blogsPageBanner,
                        card,
                        updatedBy: user?.email || undefined,
                      });
                      setBlogFeedback({ type: 'success', message: locale === 'ar' ? 'تم حفظ نص البطاقة.' : 'Banner card text saved.' });
                    } catch (error) {
                      console.error('Save banner card text error:', error);
                      setBlogFeedback({ type: 'error', message: locale === 'ar' ? 'تعذر حفظ النص على الخادم.' : 'Failed to save card text to server.' });
                    }
                  }}
                  className="mt-3 rounded-xl bg-[#DE3B34] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9B0F09] transition-colors"
                >
                  {locale === 'ar' ? 'حفظ النص' : 'Save Card Text'}
                </button>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#160A0A]">
                  {editingBlogId
                    ? locale === 'ar'
                      ? 'تعديل المقالة'
                      : 'Edit Blog Post'
                    : locale === 'ar'
                      ? 'إضافة مقالة جديدة'
                      : 'Create Blog Post'}
                </h1>

                {editingBlogId ? (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="rounded-xl border border-[#CECDCB] px-4 py-2 text-sm font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors"
                  >
                    {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                ) : isCreateBlogFormOpen ? (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="rounded-xl border border-[#CECDCB] px-4 py-2 text-sm font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors"
                  >
                    {locale === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCreateBlogFormOpen(true)}
                    className="rounded-xl bg-[#DE3B34] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9B0F09] transition-colors"
                  >
                    {locale === 'ar' ? 'فتح نموذج إنشاء المقالة' : 'Open Create Blog Form'}
                  </button>
                )}
              </div>

              {editingBlogId || isCreateBlogFormOpen ? (
                <form className="space-y-4" onSubmit={handleCreateBlog}>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'عنوان المقالة' : 'Blog title'}
                  value={blogTitle}
                  onChange={(event) => setBlogTitle(event.target.value)}
                  className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                />

                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'عنوان المقالة (عربي - اختياري)' : 'Blog title (Arabic - optional)'}
                  value={blogTitleAr}
                  onChange={(event) => setBlogTitleAr(event.target.value)}
                  dir="rtl"
                  className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="date"
                    value={blogDate}
                    onChange={(event) => setBlogDate(event.target.value)}
                    className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                  />
                  <div>
                    <p className="mb-1 text-xs font-semibold text-slate-600">
                      {locale === 'ar' ? 'صورة البطاقة (Grid)' : 'Card Image (Grid)'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, 'card')}
                      disabled={isUploadingImage}
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-slate-600">
                      {locale === 'ar' ? 'صورة البانر (Featured)' : 'Banner Image (Featured)'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, 'banner')}
                      disabled={isUploadingBannerImage}
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold text-slate-600">
                      {locale === 'ar' ? 'صورة البطاقة (العربية)' : 'Card Image (Arabic)'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, 'cardAr')}
                      disabled={isUploadingImageAr}
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-slate-600">
                      {locale === 'ar' ? 'صورة البانر (العربية)' : 'Banner Image (Arabic)'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, 'bannerAr')}
                      disabled={isUploadingBannerImageAr}
                      className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-[#DE3B34] disabled:opacity-60"
                    />
                  </div>
                </div>

                {isUploadingImage ? (
                  <p className="text-sm text-slate-600">
                    {locale === 'ar' ? 'جاري رفع صورة البطاقة...' : 'Uploading card image...'}
                  </p>
                ) : null}

                {isUploadingBannerImage ? (
                  <p className="text-sm text-slate-600">
                    {locale === 'ar' ? 'جاري رفع صورة البانر...' : 'Uploading banner image...'}
                  </p>
                ) : null}

                {isUploadingImageAr ? (
                  <p className="text-sm text-slate-600">
                    {locale === 'ar' ? 'جاري رفع صورة البطاقة العربية...' : 'Uploading Arabic card image...'}
                  </p>
                ) : null}

                {isUploadingBannerImageAr ? (
                  <p className="text-sm text-slate-600">
                    {locale === 'ar' ? 'جاري رفع صورة البانر العربية...' : 'Uploading Arabic banner image...'}
                  </p>
                ) : null}

                {blogImage || blogBannerImage || blogImageAr || blogBannerImageAr ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {blogImage ? (
                      <div className="rounded-xl border border-[#CECDCB] p-2 w-fit">
                        <p className="mb-1 text-xs text-slate-500">{locale === 'ar' ? 'معاينة صورة البطاقة' : 'Card preview'}</p>
                        <img src={blogImage} alt="Blog card preview" className="h-[140px] w-[220px] rounded-lg object-cover" />
                      </div>
                    ) : null}
                    {blogBannerImage ? (
                      <div className="rounded-xl border border-[#CECDCB] p-2 w-fit">
                        <p className="mb-1 text-xs text-slate-500">{locale === 'ar' ? 'معاينة صورة البانر' : 'Banner preview'}</p>
                        <img src={blogBannerImage} alt="Blog banner preview" className="h-[140px] w-[260px] rounded-lg object-cover" />
                      </div>
                    ) : null}
                    {blogImageAr ? (
                      <div className="rounded-xl border border-[#CECDCB] p-2 w-fit">
                        <p className="mb-1 text-xs text-slate-500">{locale === 'ar' ? 'معاينة صورة البطاقة العربية' : 'Arabic card preview'}</p>
                        <img src={blogImageAr} alt="Blog Arabic card preview" className="h-[140px] w-[220px] rounded-lg object-cover" />
                      </div>
                    ) : null}
                    {blogBannerImageAr ? (
                      <div className="rounded-xl border border-[#CECDCB] p-2 w-fit">
                        <p className="mb-1 text-xs text-slate-500">{locale === 'ar' ? 'معاينة صورة البانر العربية' : 'Arabic banner preview'}</p>
                        <img src={blogBannerImageAr} alt="Blog Arabic banner preview" className="h-[140px] w-[260px] rounded-lg object-cover" />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <textarea
                  placeholder={locale === 'ar' ? 'وصف قصير للمقالة' : 'Short description'}
                  value={blogShortDescription}
                  onChange={(event) => setBlogShortDescription(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                />

                <textarea
                  placeholder={locale === 'ar' ? 'وصف قصير للمقالة (عربي - اختياري)' : 'Short description (Arabic - optional)'}
                  value={blogShortDescriptionAr}
                  onChange={(event) => setBlogShortDescriptionAr(event.target.value)}
                  rows={3}
                  dir="rtl"
                  className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                />

                <textarea
                  placeholder={locale === 'ar' ? 'محتوى المقالة الكامل' : 'Full blog content'}
                  value={blogContent}
                  onChange={(event) => setBlogContent(event.target.value)}
                  rows={7}
                  className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                />

                <textarea
                  placeholder={locale === 'ar' ? 'محتوى المقالة الكامل (عربي - اختياري)' : 'Full blog content (Arabic - optional)'}
                  value={blogContentAr}
                  onChange={(event) => setBlogContentAr(event.target.value)}
                  rows={7}
                  dir="rtl"
                  className="w-full rounded-xl border border-[#CECDCB] bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#DE3B34]"
                />

                {blogFeedback ? (
                  <p className={`text-sm ${blogFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {blogFeedback.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="rounded-xl bg-[#DE3B34] px-6 py-3 font-semibold text-white hover:bg-[#9B0F09] transition-colors"
                >
                  {editingBlogId
                    ? locale === 'ar'
                      ? 'حفظ التعديلات'
                      : 'Save Changes'
                    : locale === 'ar'
                      ? 'نشر المقالة'
                      : 'Publish Blog'}
                </button>

                {editingBlogId ? (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="ml-3 rounded-xl border border-[#CECDCB] px-6 py-3 font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors"
                  >
                    {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                ) : null}
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#CECDCB] bg-[#F8F7F7] p-6">
                  <p className="text-sm text-slate-600">
                    {locale === 'ar'
                      ? 'اضغط على زر فتح نموذج إنشاء المقالة لإظهار النموذج.'
                      : 'Click Open Create Blog Form to show the blog creation form.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateBlogFormOpen(true)}
                    className="mt-4 rounded-xl bg-[#DE3B34] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9B0F09] transition-colors"
                  >
                    {locale === 'ar' ? 'فتح النموذج' : 'Open Form'}
                  </button>
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-bold text-[#160A0A]">
                  {locale === 'ar' ? 'المقالات المنشورة' : 'Published Blogs'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateBlogFormOpen(true)}
                    className="rounded-lg border border-[#CECDCB] px-3 py-2 text-xs font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors"
                  >
                    {locale === 'ar' ? 'فتح نموذج إنشاء المقالة' : 'Open Create Blog Form'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleAddKhaleejBlogs()}
                    disabled={isAddingKhaleejBlogs}
                    className="rounded-lg border border-[#CECDCB] px-3 py-2 text-xs font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors disabled:opacity-60"
                  >
                    {isAddingKhaleejBlogs
                      ? locale === 'ar'
                        ? 'جارٍ إضافة مقالات...'
                        : 'Adding Blogs...'
                      : locale === 'ar'
                        ? 'إضافة 5 مقالات من خليج'
                        : 'Add 5 Khaleej Blogs'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRefreshDuplicateAutoImages()}
                    disabled={isRefreshingAutoImages}
                    className="rounded-lg border border-[#CECDCB] px-3 py-2 text-xs font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors disabled:opacity-60"
                  >
                    {isRefreshingAutoImages
                      ? locale === 'ar'
                        ? 'جارٍ تحديث الصور...'
                        : 'Refreshing Images...'
                      : locale === 'ar'
                        ? 'تحديث الصور المكررة تلقائياً'
                        : 'Refresh Duplicate Images'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void loadPublishedBlogs(true)}
                    className="rounded-lg border border-[#CECDCB] px-3 py-2 text-xs font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors"
                  >
                    {locale === 'ar' ? 'تحديث قائمة المقالات' : 'Refresh Blogs List'}
                  </button>
                  <Link href={`/${locale}/blogs`} className="text-sm font-semibold text-[#DE3B34] hover:text-[#9B0F09]">
                    {locale === 'ar' ? 'عرض صفحة المدونة' : 'View Blogs Page'}
                  </Link>
                </div>
              </div>

              {blogs.length === 0 ? (
                <p className="text-slate-600 text-sm">
                  {locale === 'ar' ? 'لا توجد مقالات بعد.' : 'No blogs yet.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blogs.map((blog) => (
                    <article key={blog.id} className="rounded-xl border border-[#CECDCB] p-4">
                      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="overflow-hidden rounded-lg border border-[#CECDCB]">
                          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-[#F1EFF0] text-slate-600">
                            {locale === 'ar' ? 'بانر' : 'Banner'}
                          </p>
                          {!blog.bannerImage ? (
                            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-700 border-t border-[#CECDCB]">
                              {locale === 'ar' ? 'بانر غير مخصص' : 'Missing Banner'}
                            </p>
                          ) : null}
                          <img
                            src={blog.bannerImage || blog.image}
                            alt={`${blog.title} banner`}
                            className="h-28 w-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden rounded-lg border border-[#CECDCB]">
                          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-[#F1EFF0] text-slate-600">
                            {locale === 'ar' ? 'البطاقة' : 'Card'}
                          </p>
                          <img
                            src={blog.image}
                            alt={`${blog.title} card`}
                            className="h-28 w-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{blog.date}</p>
                      <h3 className="text-lg font-semibold text-[#160A0A] mb-2 line-clamp-2">
                        {locale === 'ar' ? blog.titleAr || blog.title : blog.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {locale === 'ar' ? blog.shortDescriptionAr || blog.shortDescription : blog.shortDescription}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleRefreshSingleBlogImage(blog)}
                          disabled={refreshingBlogId === blog.id}
                          className="rounded-lg border border-[#CECDCB] px-3 py-2 text-xs font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors disabled:opacity-60"
                        >
                          {refreshingBlogId === blog.id
                            ? locale === 'ar'
                              ? 'جارٍ التحديث...'
                              : 'Refreshing...'
                            : locale === 'ar'
                              ? 'تحديث الصورة'
                              : 'Refresh Image'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditBlog(blog)}
                          className="rounded-lg border border-[#CECDCB] px-3 py-2 text-xs font-semibold text-[#160A0A] hover:bg-[#F1EFF0] transition-colors"
                        >
                          {locale === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { void handleDeleteBlog(blog.id); }}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
                        >
                          {locale === 'ar' ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
