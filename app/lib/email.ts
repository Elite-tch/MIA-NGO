import nodemailer from "nodemailer";

interface SendMailParams {
  formType: string;
  name?: string;
  email: string;
  subject?: string;
  fields: Record<string, string | number | undefined>;
}

/** Initialize reusable Nodemailer transporter */
function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      "Nodemailer configuration error: EMAIL_USER or EMAIL_PASS is missing in environment variables."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

/** Generate a clean branded HTML template for incoming notifications */
function generateHtmlTemplate(params: SendMailParams): string {
  const { formType, name, email, fields } = params;
  const now = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  const fieldRows = Object.entries(fields)
    .filter(([, val]) => val !== undefined && String(val).trim().length > 0)
    .map(
      ([key, val]) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-weight: bold; color: #0D2B59; width: 35%; font-size: 13px; text-transform: capitalize;">
          ${key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
        </td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; color: #334155; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">
          ${String(val)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${formType}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0D2B59;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(13, 43, 89, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0D2B59 0%, #103A75 100%); padding: 28px 24px; text-align: center;">
              <span style="display: inline-block; background: #D81B60; color: #ffffff; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; rounded-full; border-radius: 20px; margin-bottom: 8px;">
                MIA INCOMING NOTIFICATION
              </span>
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                ${formType}
              </h1>
              <p style="color: #93C5FD; font-size: 12px; margin: 6px 0 0 0;">
                Maternal Initiative Africa &bull; Web Submission
              </p>
            </td>
          </tr>

          <!-- Summary Meta Box -->
          <tr>
            <td style="padding: 20px 24px 10px 24px;">
              <div style="background-color: #F0F7FD; border-left: 4px solid #0088D6; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #1E293B;">
                <strong>Sender:</strong> ${name || "Anonymous Submitter"} &bull; <a href="mailto:${email}" style="color: #0088D6; text-decoration: none; font-weight: 600;">${email}</a><br>
                <span style="color: #64748B; font-size: 11px;">Received on ${now}</span>
              </div>
            </td>
          </tr>

          <!-- Fields Table -->
          <tr>
            <td style="padding: 10px 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E2E8F0; border-radius: 8px; border-collapse: separate; overflow: hidden;">
                ${fieldRows}
              </table>
            </td>
          </tr>

          <!-- Quick Action Footer -->
          <tr>
            <td style="padding: 16px 24px 24px 24px; text-align: center; border-top: 1px solid #E2E8F0; background-color: #F8FAFC;">
              <a href="mailto:${email}" style="display: inline-block; background: #D81B60; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; padding: 10px 22px; border-radius: 24px; box-shadow: 0 2px 6px rgba(216, 27, 96, 0.3);">
                Reply Directly to Sender &rarr;
              </a>
              <p style="margin: 14px 0 0 0; font-size: 11px; color: #94A3B8;">
                This message was generated automatically by the Maternal Initiative Africa web portal.
              </p>
            </td>
          </tr>

        </table>
      </body>
    </html>
  `;
}

/** Send an email notification */
export async function sendNotificationEmail(params: SendMailParams): Promise<{ messageId: string }> {
  const transporter = getTransporter();
  const targetRecipient = process.env.EMAIL_TO || process.env.EMAIL_USER || "hello.lintrotechteam@gmail.com";
  const senderEmail = process.env.EMAIL_USER || "hello.lintrotechteam@gmail.com";

  const subject = params.subject
    ? `[MIA] ${params.formType}: ${params.subject}`
    : `[MIA] New Submission: ${params.formType} (${params.name || params.email})`;

  const info = await transporter.sendMail({
    from: `"MIA Portal Notifications" <${senderEmail}>`,
    to: targetRecipient,
    replyTo: params.email,
    subject,
    html: generateHtmlTemplate(params),
  });

  return { messageId: info.messageId };
}
