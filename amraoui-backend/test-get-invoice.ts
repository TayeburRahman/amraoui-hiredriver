import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const RequestSchema = new mongoose.Schema({ invoiceUrl: String }, { strict: false });
const RequestModel = mongoose.model('Request', RequestSchema, 'requests');

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);
  const doc = await RequestModel.findOne({ invoiceUrl: { $exists: true, $ne: '' } });
  console.log('Invoice URL:', doc?.invoiceUrl);
  mongoose.disconnect();
}
run();
