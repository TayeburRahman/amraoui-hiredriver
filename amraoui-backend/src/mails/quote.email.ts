import config from '../config';

export const customerQuoteEmailBody = (data: {
  name: string;
  requestId: string;
  vehicle: string;
  baseAmount: number;
  totalAmount: number;
  message: string;
  expenses: any[];
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h1 style="color: #2563EB; margin-top: 0;">Your Quote is Ready</h1>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Good news! We have reviewed your request and prepared a quote for your transport/inspection.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Request Summary</h3>
          <p style="margin: 4px 0;"><strong>Request ID:</strong> ${data.requestId}</p>
          <p style="margin: 4px 0;"><strong>Vehicle:</strong> ${data.vehicle}</p>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 4px 0; font-size: 14px; color: #64748b;">Base transport fee: <strong>€${data.baseAmount}</strong></p>
            ${data.expenses && data.expenses.length > 0 ? `
              <div style="margin-top: 12px; margin-bottom: 12px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; font-weight: bold;">Extra Expenses:</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tbody>
                    ${data.expenses.map(exp => `
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">
                          <strong>${exp.type || 'Expense'}</strong>
                          ${exp.adminNote ? `<br/><span style="font-size: 12px; color: #94a3b8;">${exp.adminNote}</span>` : ''}
                        </td>
                        <td style="padding: 4px 0; color: #64748b; text-align: right; border-bottom: 1px solid #f1f5f9;">€${exp.amount || 0}</td>
                      </tr>
                      ${exp.proofUrl ? `
                      <tr>
                        <td colspan="2" style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <img src="${exp.proofUrl.startsWith('http') ? exp.proofUrl : `${config.base_url || 'http://localhost:5000'}${exp.proofUrl.startsWith('/') ? '' : '/'}${exp.proofUrl}`}" alt="Proof" style="max-height: 100px; max-width: 150px; object-fit: contain; border-radius: 4px; border: 1px solid #cbd5e1;" />
                        </td>
                      </tr>
                      ` : ''}
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
            <p style="margin: 12px 0 0 0; font-size: 16px;"><strong>Final Quoted Amount:</strong> <span style="color: #2563EB; font-size: 20px; font-weight: bold;">€${data.totalAmount}</span></p>
          </div>
        </div>

        <p>Please log in to your Customer Portal to review the details and accept or reject this quote, or simply <strong>reply to this email</strong> to discuss further.</p>
        
        <div style="margin-top: 30px;">
          <a href="http://localhost:3001/dashboard/orders" style="background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Customer Portal</a>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">
          If you have any questions, please contact our support team.
        </p>
      </div>
    </body>
  </html>
`;

export const customerDriverAssignedEmailBody = (data: {
  name: string;
  requestId: string;
  driverName: string;
  driverPhone: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
        <h1 style="color: #10B981;">Driver Assigned!</h1>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Great news! A driver has been assigned to your mission (<strong>${data.requestId}</strong>).</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; margin: 20px 0; border-radius: 6px;">
          <p><strong>Driver Name:</strong> ${data.driverName}</p>
          <p><strong>Driver Phone:</strong> ${data.driverPhone}</p>
        </div>
        <p>You can check the progress in your Customer Portal.</p>
        <div style="margin-top: 30px;">
          <a href="http://localhost:3001/dashboard/orders" style="background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Customer Portal</a>
        </div>
      </div>
    </body>
  </html>
`;

export const customerMissionCompleteEmailBody = (data: {
  name: string;
  requestId: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px;">
        <h1 style="color: #10B981;">Mission Completed!</h1>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Your request (<strong>${data.requestId}</strong>) has been successfully completed by the driver.</p>
        <p>Thank you for using our services. You can view the final details and inspection reports in your Customer Portal.</p>
        <div style="margin-top: 30px;">
          <a href="http://localhost:3001/dashboard/orders" style="background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Customer Portal</a>
        </div>
      </div>
    </body>
  </html>
`;
