import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const RequestSchema = new mongoose.Schema({}, { strict: false });
const RequestModel = mongoose.model('Request', RequestSchema, 'requests');

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);
  
  // Add some fake admin quotes to pending quote requests
  await RequestModel.updateMany(
    { status: 'PENDING_ADMIN_QUOTE', missionId: { $in: ['VQ-00037', 'VQ-00035', 'VQ-00034', 'VQ-00029'] } },
    { 
      $set: { 
        adminQuote: { amount: 150, estimatedTime: '2 Days', message: 'Estimated cost based on route.', driverPrice: 100 }
      } 
    }
  );
  
  console.log('Done updating requests with mock quotes.');
  mongoose.disconnect();
}
run();
