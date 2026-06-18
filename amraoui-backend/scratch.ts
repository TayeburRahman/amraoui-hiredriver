import { MongoClient } from 'mongodb';

async function main() {
  const uri = 'mongodb://localhost:27017/amraoui';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('test'); // Check if it's test or amraoui. The backend says "Connected on Successfully"
    const missions = db.collection('requests');
    
    console.log("=== INSPECTION MISSIONS ===");
    const ins = await missions.find({ type: 'INSPECTION' }).limit(1).toArray();
    console.log(JSON.stringify(ins, null, 2));

    console.log("\n=== HIRE_DRIVER MISSIONS ===");
    const hd = await missions.find({ type: 'HIRE_DRIVER' }).limit(1).toArray();
    console.log(JSON.stringify(hd, null, 2));
  } finally {
    await client.close();
  }
}
main().catch(console.error);
