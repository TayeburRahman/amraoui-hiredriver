export const driverActivationEmailBody = (data: {
  name: string;
  activationCode: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
        <h1 style="color: #2563EB;">Welcome to Amraoui HireDriver</h1>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering as a driver. Please verify your email with this code:</p>
        <h2 style="letter-spacing: 4px; color: #2563EB;">${data.activationCode}</h2>
        <p>This code expires in 3 minutes.</p>
        <p>After verification, upload your documents to complete your application.</p>
      </div>
    </body>
  </html>
`;

export const driverDocumentsSubmittedEmailBody = (data: { name: string }) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
        <h1 style="color: #2563EB;">Documents Submitted</h1>
        <p>Hello ${data.name},</p>
        <p>Your documents were submitted successfully. Please wait while our admin team verifies them.</p>
        <p>You will receive another email once your account is approved or if further action is needed.</p>
      </div>
    </body>
  </html>
`;

export const driverApprovedEmailBody = (data: { name: string }) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
        <h1 style="color: #16A34A;">Account Approved</h1>
        <p>Hello ${data.name},</p>
        <p>Great news! Your driver account has been approved. You can now log in and start accepting missions.</p>
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
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
        <h1 style="color: #DC2626;">Application Declined</h1>
        <p>Hello ${data.name},</p>
        <p>Unfortunately, your driver application was declined by our admin team.</p>
        ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
        <p>Please contact support if you have questions.</p>
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
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
        <h1 style="color: #2563EB;">New Driver Documents</h1>
        <p>Driver <strong>${data.name}</strong> (${data.email}) submitted documents for review.</p>
        <p>Please log in to the admin dashboard to approve or decline this driver.</p>
      </div>
    </body>
  </html>
`;
