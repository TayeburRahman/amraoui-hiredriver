import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const RequestSchema = new mongoose.Schema({}, { strict: false });
const RequestModel = mongoose.model('Request', RequestSchema, 'requests');

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);
  const reqs = await RequestModel.find({ status: { $in: ['PENDING_ADMIN_QUOTE', 'CUSTOMER_REVIEWING_QUOTE', 'OPEN_FOR_DRIVERS', 'ADMIN_REVIEWING_DRIVERS', 'ASSIGNED'] } }).limit(5);
  reqs.forEach(r => console.log(r.get('details')?.duration, r.get('details')?.distance));
  mongoose.disconnect();
}
run();