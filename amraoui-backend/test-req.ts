import mongoose from "mongoose";
import config from "./src/config";
import Requests from "./src/app/modules/requests/requests.model";

async function main() {
  await mongoose.connect(config.database_url as string);
  const req = await Requests.findById("6a2916a3541aedf03e0184e8");
  
  // if required drivers == assigned drivers, force update status to ASSIGNED
  if (req && req.assignedDriverIds && req.assignedDriverIds.length >= (req.details?.driverCount || 1)) {
    req.status = 'ASSIGNED' as any;
    req.driverQuotes.forEach((quote: any) => {
      if (quote.status === 'PENDING') {
        quote.status = 'REJECTED';
      }
    });
    await req.save();
    console.log("Updated status to ASSIGNED");
  }
  
  mongoose.disconnect();
}
main();
