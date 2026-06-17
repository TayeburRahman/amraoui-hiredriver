const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
  const Requests = require('./src/app/modules/requests/requests.model.ts').default; // this might fail if typescript
  // wait, just update it natively:
  const db = mongoose.connection.db;
  const docs = await db.collection('requests').find({status: 'IN_PROGRESS'}).toArray();
  if (docs.length > 0) {
    console.log(docs[0]._id);
  } else {
    console.log("no in progress");
  }
  process.exit(0);
});
