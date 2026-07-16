import mongoose from 'mongoose';
import config from './src/config';
import Drivers from './src/app/modules/drivers/drivers.model';

async function test() {
  await mongoose.connect(config.database_url as string);
  console.log("Connected");
  try {
    const driver = new Drivers({
      authId: new mongoose.Types.ObjectId(),
      name: "Test Driver",
      email: "testdriver@test.com",
      status: "pending",
      documents_submitted: false,
      documents_submitted_at: null,
    });
    await driver.validate();
    console.log("Validation passed");
  } catch (e: any) {
    console.error("Validation failed:", e);
  }
  await mongoose.disconnect();
}

test();
