import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "../../lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { formType = "General Contact Inquiry", name, email, subject, message, ...extraFields } = body;

    // Basic validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Assemble fields dictionary
    const fields: Record<string, string | number | undefined> = {
      "Form Type": formType,
      "Full Name": name || "Not provided",
      "Email Address": email,
      ...(subject ? { Subject: subject } : {}),
      ...(message ? { Message: message } : {}),
    };

    // Append any extra fields (e.g., organization, country, orgType, scope, cadre, workplace, experience, interest)
    for (const [key, value] of Object.entries(extraFields)) {
      if (value !== undefined && value !== null && String(value).trim().length > 0) {
        fields[key] = String(value);
      }
    }

    await sendNotificationEmail({
      formType,
      name,
      email,
      subject: subject || (name ? `${name} - ${formType}` : formType),
      fields,
    });

    return NextResponse.json({
      success: true,
      message: "Your submission has been sent successfully. Our team will be in touch shortly.",
    });
  } catch (error) {
    console.error("[api/contact] Email delivery failed:", error);
    return NextResponse.json(
      {
        error:
          "Unable to send message due to a delivery error. Please try again or contact us directly at hello.lintrotechteam@gmail.com.",
      },
      { status: 500 }
    );
  }
}
