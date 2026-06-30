import mongoose from 'mongoose';
import config from './src/config';
import { AdminService } from './src/app/modules/admin/admin.service';

async function main() {
  await mongoose.connect(config.database_url as string);
  console.log('Connected to DB.');

  const uniqueEmail = `test_customer_${Date.now()}@example.com`;
  const payload = {
    name: 'TestFirst',
    family_name: 'TestLast',
    company: 'TestCompany LLC',
    tax_number: 'TEST-123456',
    phone_number: '+33612345678',
    email: uniqueEmail,
    password: 'Password123!',
    confirmPassword: 'Password123!',
    message: 'Test Notes',
  };

  console.log('Attempting to create customer manually via AdminService.createCustomer...');
  try {
    const result = await AdminService.createCustomer(payload);
    console.log('Success! Created customer:', result);
  } catch (error) {
    console.error('Error creating customer:', error);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
