import mongoose from 'mongoose';
import config from './src/config';
import Requests from './src/app/modules/requests/requests.model';

async function main() {
  await mongoose.connect(config.database_url as string);
  console.log('Connected to DB');

  const requests = await Requests.find().sort({ createdAt: -1 }).limit(10);
  console.log(`\nLast 10 requests:`);
  requests.forEach(r => console.log(`- Mission ID: ${r.missionId}, CustomerId: ${r.customerId}, Email: ${r.details?.email}, Status: ${r.status}, Created: ${r.createdAt}`));

  process.exit(0);
}

main().catch(console.error);
