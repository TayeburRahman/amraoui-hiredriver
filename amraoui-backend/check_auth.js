const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
  const db = mongoose.connection.db;
  const docs = await db.collection('auths').find({}).toArray();
  console.log("Auths:");
  docs.forEach(d => console.log(d.email));
  process.exit(0);
});
