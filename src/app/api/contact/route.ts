import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const CONTACT_TO_EMAIL = ['info@almahy.com', 'almahylegalservices@gmail.com'];

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
      {
        success: false,
        message: 'Email service is not configured. Please set RESEND_API_KEY and RESEND_FROM_EMAIL.',
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const phone = String(body?.phone || '').trim();
    const topic = String(body?.topic || '').trim();
    const message = String(body?.message || '').trim();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !isEmail || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid name, email, and message.' },
        { status: 400 }
      );
    }

    const rows: Array<[string, string, string | null]> = [
      ['Name', name, null],
      ['Email', email, `mailto:${email}`],
      ['Phone', phone || '—', phone ? `tel:${phone.replace(/\s+/g, '')}` : null],
      ['Topic', topic || '—', null],
    ];

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
              <!-- Header -->
              <tr>
                <td style="background-color:#160A0A;padding:28px 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#C9A24B;font-weight:bold;">Almahy Legal Service</p>
                        <p style="margin:6px 0 0;font-size:22px;color:#ffffff;font-weight:bold;">New Contact Enquiry</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Gold divider -->
              <tr><td style="height:4px;background-color:#C9A24B;line-height:4px;font-size:0;">&nbsp;</td></tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#57534e;">
                    You received a new message through the website contact form.
                  </p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeece9;border-radius:10px;overflow:hidden;">
                    ${rows
                      .map(([label, value, href], i) => {
                        const safeVal = escapeHtml(value);
                        const cell = href
                          ? `<a href="${escapeHtml(href)}" style="color:#160A0A;text-decoration:none;font-weight:bold;">${safeVal}</a>`
                          : `<span style="color:#160A0A;font-weight:bold;">${safeVal}</span>`;
                        return `
                    <tr>
                      <td style="padding:14px 18px;width:110px;background-color:#faf9f7;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8a8580;font-weight:bold;border-bottom:${i === rows.length - 1 ? '0' : '1px solid #eeece9'};">${label}</td>
                      <td style="padding:14px 18px;font-size:15px;border-bottom:${i === rows.length - 1 ? '0' : '1px solid #eeece9'};">${cell}</td>
                    </tr>`;
                      })
                      .join('')}
                  </table>

                  <p style="margin:28px 0 8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8a8580;font-weight:bold;">Message</p>
                  <div style="border-left:3px solid #C9A24B;background-color:#faf9f7;border-radius:0 8px 8px 0;padding:16px 18px;font-size:15px;line-height:1.7;color:#292524;white-space:pre-wrap;">${escapeHtml(
                    message
                  )}</div>

                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                    <tr>
                      <td style="border-radius:8px;background-color:#C9A24B;">
                        <a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:12px 26px;font-size:14px;font-weight:bold;color:#160A0A;text-decoration:none;">Reply to ${escapeHtml(name)}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:#160A0A;padding:20px 32px;">
                  <p style="margin:0;font-size:12px;color:#a8a29e;">Submitted ${escapeHtml(submittedAt)} (Dubai time)</p>
                  <p style="margin:6px 0 0;font-size:12px;color:#78716c;">This message was sent from the Almahy website contact form.</p>
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
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New contact inquiry from ${name}${topic ? ` — ${topic}` : ''}`,
      html,
    });

    if (sendResult.error) {
      const apiMessage =
        typeof sendResult.error === 'object' && sendResult.error !== null && 'message' in sendResult.error
          ? String((sendResult.error as { message?: string }).message || 'Failed to send your message.')
          : 'Failed to send your message.';
      return NextResponse.json({ success: false, message: apiMessage }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: sendResult.data?.id || null });
  } catch (error) {
    console.error('Contact form email error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send your message.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
