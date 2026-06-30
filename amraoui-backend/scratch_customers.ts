import mongoose from 'mongoose';
import config from './src/config';
import Customers from './src/app/modules/customers/customers.model';
import Auth from './src/app/modules/auth/auth.model';

async function main() {
  await mongoose.connect(config.database_url as string);
  console.log('Connected to DB successfully.');

  const count = await Customers.countDocuments();
  console.log('Total Customers:', count);

  const list = await Customers.find().populate('authId').limit(5);
  console.log('Sample Customers:', JSON.stringify(list, null, 2));

  const authCount = await Auth.countDocuments({ role: 'CUSTOMERS' });
  console.log('Total Auth CUSTOMERS:', authCount);

  const authList = await Auth.find({ role: 'CUSTOMERS' }).limit(5);
  console.log('Sample Auth CUSTOMERS:', JSON.stringify(authList, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
