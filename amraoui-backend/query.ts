import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://tayeb2:ipwpdW4wJdnArOyj@cluster0.hluu9.mongodb.net/amraoui_backend?retryWrites=true&w=majority');
  const db = mongoose.connection.db;
  if (!db) return;
  const req = await db.collection('requests').findOne({ _id: new mongoose.Types.ObjectId('6a605b45a1d7a57d72c9dd8d') });
  
  if (req && req.customerId) {
    const cust = await db.collection('customers').findOne({ _id: req.customerId });
    console.log("CUSTOMER DOC:", cust);
  } else {
    console.log("NO customerId or req");
  }
  process.exit(0);
}
run();
