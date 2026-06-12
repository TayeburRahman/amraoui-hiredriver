import mongoose from "mongoose";
import config from "./src/config";
import Requests from "./src/app/modules/requests/requests.model";

async function main() {
  await mongoose.connect(config.database_url as string);
  const req = await Requests.findById("6a2916a3541aedf03e0184e8").lean();
  console.log(JSON.stringify(req, null, 2));
  mongoose.disconnect();
}
main();
