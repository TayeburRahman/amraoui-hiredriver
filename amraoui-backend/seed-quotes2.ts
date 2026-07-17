import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const RequestSchema = new mongoose.Schema({}, { strict: false });
const RequestModel = mongoose.model('Request', RequestSchema, 'requests');

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);
  
  // Add some fake admin quotes to pending quote requests
  await RequestModel.updateMany(
    { missionId: { $in: ['VQ-00037', 'VQ-00035', 'VQ-00034', 'VQ-00029'] } },
    { 
      $set: { 
        'adminQuote.amount': 150,
        'adminQuote.driverPrice': 100,
        'adminQuote.message': 'Test quote.',
        status: 'CUSTOMER_REVIEWING_QUOTE'
      } 
    }
  );
  
  console.log('Done updating statuses with mock quotes.');
  mongoose.disconnect();
}
run();
