import mongoose from 'mongoose';
import config from './src/config';
import Requests from './src/app/modules/requests/requests.model';

async function main() {
  await mongoose.connect(config.database_url as string);
  console.log('Connected to DB');

  const req = await Requests.findOne({ missionId: 'MS-00017' });
  console.log(JSON.stringify(req?.details, null, 2));

  process.exit(0);
}

main().catch(console.error);
