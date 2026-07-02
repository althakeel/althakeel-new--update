import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const NOTIFY_EMAILS = ['info@almahy.com', 'almahylegalservices@gmail.com'];

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  if (!resend || !resendFromEmail) {
    return NextResponse.json(
      { success: false, message: 'Email service is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmail) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Dubai',
    });

    const html = `
    <body style="margin:0;padding:0;background-color:#f2f0ee;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f0ee;padding:32px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(22,10,10,0.08);font-family:Arial,Helvetica,sans-serif;">
              <tr>
                <td style="background-color:#160A0A;padding:28px 32px;">
                  <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#C9A24B;font-weight:bold;">Almahy Legal Service</p>
                  <p style="margin:6px 0 0;font-size:22px;color:#ffffff;font-weight:bold;">New Newsletter Subscriber</p>
                </td>
              </tr>
              <tr><td style="height:4px;background-color:#C9A24B;line-height:4px;font-size:0;">&nbsp;</td></tr>
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#57534e;">
                    A new visitor subscribed to the newsletter through the website.
                  </p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeece9;border-radius:10px;overflow:hidden;">
                    <tr>
                      <td style="padding:14px 18px;width:110px;background-color:#faf9f7;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8a8580;font-weight:bold;">Email</td>
                      <td style="padding:14px 18px;font-size:15px;">
                        <a href="mailto:${escapeHtml(email)}" style="color:#160A0A;text-decoration:none;font-weight:bold;">${escapeHtml(email)}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color:#160A0A;padding:20px 32px;">
                  <p style="margin:0;font-size:12px;color:#a8a29e;">Subscribed ${escapeHtml(submittedAt)} (Dubai time)</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    `;

    const sendResult = await resend.emails.send({
      from: resendFromEmail,
      to: NOTIFY_EMAILS,
      replyTo: email,
      subject: `New newsletter subscriber: ${email}`,
      html,
    });

    if (sendResult.error) {
      const apiMessage =
        typeof sendResult.error === 'object' && sendResult.error !== null && 'message' in sendResult.error
          ? String((sendResult.error as { message?: string }).message || 'Failed to subscribe.')
          : 'Failed to subscribe.';
      return NextResponse.json({ success: false, message: apiMessage }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: sendResult.data?.id || null });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    const message = error instanceof Error ? error.message : 'Failed to subscribe.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
