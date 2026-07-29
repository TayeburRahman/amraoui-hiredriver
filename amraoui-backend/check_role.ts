import mongoose from 'mongoose';
import config from './src/config';
import User from './src/app/modules/auth/auth.model';

async function main() {
  await mongoose.connect(config.database_url as string);
  console.log('Connected to DB');

  const user = await User.findOne({ email: 'tayebrayhan101@gmail.com' });
  console.log(user?.role);

  process.exit(0);
}

main().catch(console.error);

