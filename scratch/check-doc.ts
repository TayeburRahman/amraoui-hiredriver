import mongoose from 'mongoose';
const MONGODB_URL = 'mongodb+srv://tuhinswe3:N36UjRNDtV9h84Q6@cluster0.o8c0x29.mongodb.net/amraoui-hiredriver?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URL)
  .then(async () => {
    const db = mongoose.connection.db;
    const request = await db?.collection('requests').findOne({ _id: new mongoose.Types.ObjectId('6a55c51530bb1ceb813fa015') });
    console.log("Documents:", JSON.stringify(request?.details?.documents, null, 2));
    process.exit(0);
  });
