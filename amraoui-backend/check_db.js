const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
  const db = mongoose.connection.db;
  const docs = await db.collection('requests').find({}).toArray();
  console.log("Total missions:", docs.length);
  const m = docs[0];
  console.log("Sample mission details:", JSON.stringify(m.details));
  process.exit(0);
});
