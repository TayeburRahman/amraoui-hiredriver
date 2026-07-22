require('dotenv').config({ path: './amraoui-backend/.env' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://tayebur101:j6b445C5R1kX3fO9@cluster0.e8s1j41.mongodb.net/vehiqqo_backend');
  const db = mongoose.connection.db;
  const req = await db.collection('requests').findOne({ _id: new mongoose.Types.ObjectId('6a605b45a1d7a57d72c9dd8d') });
  console.log(JSON.stringify(req.details, null, 2));
  process.exit(0);
}
run();
