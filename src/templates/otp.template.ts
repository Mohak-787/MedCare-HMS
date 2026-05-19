import { OtpPurpose } from "../constants/otp.constant";

export const otpTextTemplate = (otp: string, purpose: OtpPurpose): string => {
  return `Your OTP for ${purpose} is ${otp}. Please do not share this code with anyone.`;
};

export const otpHtmlTemplate = (otp: string, purpose: OtpPurpose): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025); overflow: hidden;">
          
          <!-- Header Branding -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: left;">
              <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
                Med<span style="color: #0d9488;">Care</span> <span style="font-size: 10px; font-weight: 600; color: #64748b; letter-spacing: 1px; text-transform: uppercase; border-left: 1px solid #cbd5e1; padding-left: 8px; margin-left: 6px; vertical-align: middle;">HMS</span>
              </span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 32px 24px 32px; text-align: left;">
              <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0;">Verification Code</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Please use the following one-time password to complete your <strong>${purpose}</strong> request. This code is only valid for a limited time.
              </p>

              <!-- OTP Code Display -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">One-Time Password</div>
                    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 32px; font-weight: 800; color: #0d9488; letter-spacing: 6px; padding-left: 6px;">${otp}</div>
                  </td>
                </tr>
              </table>

              <!-- Expiry Notification -->
              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0 0 24px 0;">
                This code is valid for <strong>2 minutes</strong>. For your security, do not share this code with anyone.
              </p>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0 0 20px 0;">
              
              <!-- Footer info -->
              <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; margin: 0;">
                If you did not request this verification code, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
