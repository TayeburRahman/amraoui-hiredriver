import mongoose from 'mongoose';
import Auth from '../app/modules/auth/auth.model';
import Admin from '../app/modules/admin/admin.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGO_URL = process.env.MONGO_URL;

async function seedAdmin() {
  if (!MONGO_URL) {
    console.error("MONGO_URL is not set in .env");
    process.exit(1);
  }

  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGO_URL);
    console.log("Connected successfully!");

    const adminEmail = "admin@amraoui.com";
    const adminPassword = "AdminPassword123!";

    const existingAuth = await Auth.findOne({ email: adminEmail });
    if (existingAuth) {
      console.log(`Admin user with email ${adminEmail} already exists! Deleting to re-create...`);
      await Admin.deleteOne({ authId: existingAuth._id });
      await Auth.deleteOne({ _id: existingAuth._id });
    }

    console.log("Creating Auth user...");
    const newAuth = new Auth({
      name: "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      is_block: false,
    });

    const savedAuth = await newAuth.save();
    console.log("Auth user created!");

    console.log("Creating Admin profile...");
    await Admin.create({
      authId: savedAuth._id,
      name: "Super Admin",
      email: adminEmail,
      phone_number: "+33 6 00 00 00 00",
      address: "Paris, France",
      date_of_birth: "1990-01-01",
    });

    console.log("Admin Profile created successfully!");
    console.log(`\n--- LOGIN CREDENTIALS ---`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role: SUPER_ADMIN`);
    console.log(`Dashboard: http://localhost:3000/login`);
    console.log(`-------------------------\n`);

  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from Database.");
  }
}

seedAdmin();
