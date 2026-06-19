import mongoose from 'mongoose';
import config from './src/config';
import Requests from './src/app/modules/requests/requests.model';
import User from './src/app/modules/auth/auth.model';
import Customer from './src/app/modules/customers/customers.model';

async function main() {
  await mongoose.connect(config.database_url as string);
  console.log('Connected to DB');

  const customer = await Customer.findOne({ email: 'tayebrayhan101@gmail.com' });
  if (!customer) {
    console.log('Customer not found by email.');
    process.exit(0);
  }

  console.log(`Customer found: ${customer._id}`);

  const requests = await Requests.find({ customerId: customer._id });
  console.log(`\nFound ${requests.length} requests linked to customerId:`);
  requests.forEach(r => console.log(`- Mission ID: ${r.missionId}, Status: ${r.status}, Created: ${r.createdAt}`));

  const anonRequests = await Requests.find({ "details.email": "tayebrayhan101@gmail.com" });
  console.log(`\nFound ${anonRequests.length} requests with matching email in details:`);
  anonRequests.forEach(r => console.log(`- Mission ID: ${r.missionId}, CustomerId: ${r.customerId || 'null'}, Status: ${r.status}, Created: ${r.createdAt}`));

  process.exit(0);
}

main().catch(console.error);
