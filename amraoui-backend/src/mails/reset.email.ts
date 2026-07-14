interface ResetEmailTemplateData {
  name: string;
  verifyCode: string;
  verifyExpire: number;
}

const resetEmailTemplate = (data: ResetEmailTemplateData): string => `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
            <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo  Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 8px auto;" />
            <div style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">Vehiqqo </div>
          </div>

          <h3 style="color: #2563EB; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h3>
          <p>Hello ${data.name},</p>
          <p>We have received a request to reset your password. Please use the code below to proceed with resetting your password:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563EB; padding: 12px 24px; background: #EFF6FF; border-radius: 8px; border: 1px dashed #BFDBFE; display: inline-block;">${data.verifyCode}</span>
          </div>
          <p>This code will be valid for the next ${data.verifyExpire} minutes and can only be used once. If you attempt to reset your password again, you will need a new code.</p>
          <p>If you did not request a password reset, please disregard this email.</p>

          <!-- Footer -->
          <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748B;">
            Please contact support at <a href="mailto:partner@vehiqqo.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">partner@vehiqqo.com</a> if you have questions.
          </p>
        </div>
      </body>
    </html>
  `;

export { resetEmailTemplate };
