import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  if (!resend || !resendFromEmail) {
    return NextResponse.json(
      {
        success: false,
        message: 'Resend is not configured. Please set RESEND_API_KEY and RESEND_FROM_EMAIL.',
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '').trim();
    const locale = String(body?.locale || 'en') === 'ar' ? 'ar' : 'en';
    const invitationType = String(body?.type || 'approved') === 'invite' ? 'invite' : 'approved';

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmail) {
      return NextResponse.json({ success: false, message: 'A valid email is required.' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const loginUrl = `${appUrl}/${locale}/login`;

    const subject =
      invitationType === 'invite'
        ? locale === 'ar'
          ? 'دعوة للوصول إلى لوحة الإدارة'
          : 'Invitation to access the admin panel'
        : locale === 'ar'
          ? 'تمت الموافقة على وصولك إلى لوحة الإدارة'
          : 'Your admin panel access has been approved';

    const html =
      invitationType === 'invite'
        ? locale === 'ar'
          ? `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #160A0A; direction: rtl; text-align: right;">
              <h2 style="margin: 0 0 12px;">دعوة للوصول إلى لوحة الإدارة</h2>
              <p>مرحباً،</p>
              <p>تمت دعوتك لطلب الوصول إلى لوحة الإدارة.</p>
              <p>قم بإنشاء حساب أو تسجيل الدخول باستخدام نفس البريد من الرابط التالي:</p>
              <p>
                <a href="${loginUrl}" style="color: #DE3B34; font-weight: 700;">${loginUrl}</a>
              </p>
              <p>بعد تسجيل الدخول، سيظهر طلبك بانتظار موافقة المدير.</p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #160A0A;">
              <h2 style="margin: 0 0 12px;">Invitation to access admin panel</h2>
              <p>Hello,</p>
              <p>You are invited to request access to the admin panel.</p>
              <p>Create an account or sign in with this same email using the link below:</p>
              <p>
                <a href="${loginUrl}" style="color: #DE3B34; font-weight: 700;">${loginUrl}</a>
              </p>
              <p>After login, your request will appear for admin approval.</p>
            </div>
          `
        : locale === 'ar'
          ? `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #160A0A; direction: rtl; text-align: right;">
              <h2 style="margin: 0 0 12px;">تمت الموافقة على الوصول</h2>
              <p>مرحباً،</p>
              <p>تمت الموافقة على بريدك الإلكتروني للوصول إلى لوحة الإدارة.</p>
              ${username ? `<p><strong>اسم المستخدم:</strong> ${username}</p>` : ''}
              ${password ? `<p><strong>كلمة المرور:</strong> ${password}</p>` : ''}
              <p>
                يمكنك تسجيل الدخول من هنا:
                <a href="${loginUrl}" style="color: #DE3B34; font-weight: 700;">${loginUrl}</a>
              </p>
              <p>شكراً لك.</p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #160A0A;">
              <h2 style="margin: 0 0 12px;">Access Approved</h2>
              <p>Hello,</p>
              <p>Your email has been approved to access the admin panel.</p>
              ${username ? `<p><strong>Username:</strong> ${username}</p>` : ''}
              ${password ? `<p><strong>Password:</strong> ${password}</p>` : ''}
              <p>
                You can log in here:
                <a href="${loginUrl}" style="color: #DE3B34; font-weight: 700;">${loginUrl}</a>
              </p>
              <p>Thank you.</p>
            </div>
          `;

    const sendResult = await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject,
      html,
    });

    if (sendResult.error) {
      const apiMessage =
        typeof sendResult.error === 'object' && sendResult.error !== null && 'message' in sendResult.error
          ? String((sendResult.error as { message?: string }).message || 'Failed to send invitation email.')
          : 'Failed to send invitation email.';

      return NextResponse.json(
        {
          success: false,
          message: apiMessage,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: sendResult.data?.id || null });
  } catch (error) {
    console.error('Resend invitation email error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send invitation email.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
