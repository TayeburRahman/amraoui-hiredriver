export const driverActivationEmailBody = (data: {
  name: string;
  activationCode: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo  Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 8px auto;" />
          <div style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">Vehiqqo </div>
        </div>

        <h3 style="color: #2563EB; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Welcome to Vehiqqo </h3>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering as a driver. Please verify your email with this code:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563EB; padding: 12px 24px; background: #EFF6FF; border-radius: 8px; border: 1px dashed #BFDBFE; display: inline-block;">${data.activationCode}</span>
        </div>
        <p>This code expires in 3 minutes.</p>
        <p>After verification, upload your documents to complete your application.</p>

        <!-- Footer -->
        <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748B;">
          Please contact support at <a href="mailto:partner@vehiqqo.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">partner@vehiqqo.com</a> if you have questions.
        </p>
      </div>
    </body>
  </html>
`;

export const driverDocumentsSubmittedEmailBody = (data: { name: string }) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo  Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 8px auto;" />
          <div style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">Vehiqqo </div>
        </div>

        <h3 style="color: #2563EB; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Documents Submitted</h3>
        <p>Hello ${data.name},</p>
        <p>Your documents were submitted successfully. Please wait while our admin team verifies them.</p>
        <p>You will receive another email once your account is approved or if further action is needed.</p>

        <!-- Footer -->
        <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748B;">
          Please contact support at <a href="mailto:partner@vehiqqo.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">partner@vehiqqo.com</a> if you have questions.
        </p>
      </div>
    </body>
  </html>
`;

export const driverApprovedEmailBody = (data: { name: string }) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo  Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 8px auto;" />
          <div style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">Vehiqqo </div>
        </div>

        <h3 style="color: #16A34A; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Account Approved</h3>
        <p>Hello ${data.name},</p>
        <p>Great news! Your driver account has been approved. You can now log in and start accepting missions.</p>

        <!-- Footer -->
        <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748B;">
          Please contact support at <a href="mailto:partner@vehiqqo.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">partner@vehiqqo.com</a> if you have questions.
        </p>
      </div>
    </body>
  </html>
`;

export const driverDeclinedEmailBody = (data: {
  name: string;
  reason?: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo  Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 8px auto;" />
          <div style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">Vehiqqo </div>
        </div>

        <h3 style="color: #DC2626; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Application Declined</h3>
        <p>Hello ${data.name},</p>
        <p>Unfortunately, your driver application was declined by our admin team.</p>
        ${data.reason ? `<p style="padding: 12px; background: #FEF2F2; border-left: 4px solid #EF4444; color: #991B1B; border-radius: 4px; margin-top: 16px; margin-bottom: 16px;"><strong>Reason:</strong> ${data.reason}</p>` : ""}
        
        <!-- Footer -->
        <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748B;">
          Please contact support at <a href="mailto:partner@vehiqqo.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">partner@vehiqqo.com</a> if you have questions.
        </p>
      </div>
    </body>
  </html>
`;

export const adminNewDriverDocumentsEmailBody = (data: {
  name: string;
  email: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
          <img src="https://amraoui-hiredriver.vercel.app/logo.png" alt="Vehiqqo  Logo" style="height: 40px; width: auto; display: block; margin: 0 auto 8px auto;" />
          <div style="font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">Vehiqqo </div>
        </div>

        <h3 style="color: #2563EB; font-size: 20px; margin-top: 0; margin-bottom: 16px;">New Driver Documents</h3>
        <p>Driver <strong>${data.name}</strong> (${data.email}) submitted documents for review.</p>
        <p>Please log in to the admin dashboard to approve or decline this driver.</p>

        <!-- Footer -->
        <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 13px; color: #64748B;">
          Please contact support at <a href="mailto:partner@vehiqqo.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">partner@vehiqqo.com</a> if you have questions.
        </p>
      </div>
    </body>
  </html>
`;
