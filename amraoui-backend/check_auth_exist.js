const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Auth = require('./src/app/modules/auth/auth.model.ts'); // fails with TS

mongoose.connect(process.env.MONGO_URL).then(async () => {
  const db = mongoose.connection.db;
  const auth = await db.collection('auths').findOne({ email: 'nanosoft.sta@gmail.com' });
  console.log("Auth found exact:", auth);

  // also check with regex
  const regexAuth = await db.collection('auths').findOne({ email: /nanosoft/i });
  console.log("Auth found regex:", regexAuth);

  process.exit(0);
});
