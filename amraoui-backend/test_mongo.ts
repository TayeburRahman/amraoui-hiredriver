import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Drivers from './src/app/modules/drivers/drivers.model';
import { jwtHelpers } from './src/helpers/jwtHelpers';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL as string);
  console.log("Connected to DB");
  
  const driver = await Drivers.findOne({});
  if (!driver) {
    console.log("No driver found");
    process.exit(0);
  }
  
  const token = jwtHelpers.createToken(
    { authId: driver.authId, role: 'driver', userId: driver._id },
    process.env.JWT_SECRET as string,
    '1d'
  );
  
  console.log("TOKEN=" + token);
  
  process.exit(0);
}

run();
