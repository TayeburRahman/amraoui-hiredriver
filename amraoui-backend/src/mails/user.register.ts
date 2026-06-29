export const registrationSuccessEmailBody = (userData: any) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <img src="https://i.ibb.co.com/60MBG4Xp/logo.png" alt="Vehiqqo Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 8px auto;" />
          <div style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">Vehiqqo</div>
        </div>

        <h3 style="color: #2563EB; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Welcome to Vehiqqo</h3>
        <p>Hello ${userData?.user?.name},</p>
        <p>Thank you for registering with Vehiqqo. To activate your account, please use the following activation code:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563EB; padding: 12px 24px; background: #EFF6FF; border-radius: 8px; border: 1px dashed #BFDBFE; display: inline-block;">${userData?.activationCode}</span>
        </div>
        <p>Please enter this code on the activation page within the next 5 minutes.</p>
        <p>If you didn't register for Vehiqqo, please ignore this email.</p>

        <!-- Footer -->
        <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748B;">
          Please contact support at <a href="mailto:driver@vehiqqo.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">driver@vehiqqo.com</a> if you have questions.
        </p>
      </div>
    </body>
  </html>
`;
