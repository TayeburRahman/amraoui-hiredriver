const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tayeb2:ipwpdW4wJdnArOyj@cluster0.hluu9.mongodb.net/amraoui_backend?retryWrites=true&w=majority').then(() => {
  const db = mongoose.connection.db;
  db.collection('requests').find({}, { projection: { adminQuote: 1, type: 1, status: 1 } }).sort({createdAt: -1}).limit(5).toArray().then(console.log).finally(() => process.exit(0));
});
