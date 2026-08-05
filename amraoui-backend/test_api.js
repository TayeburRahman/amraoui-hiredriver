const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tayeb2:ipwpdW4wJdnArOyj@cluster0.hluu9.mongodb.net/amraoui_backend?retryWrites=true&w=majority').then(async () => {
  const db = mongoose.connection.db;
  const driver = await db.collection('drivers').findOne({});
  const res = await fetch(`https://backend.vehiqqo.com/api/v1/requests/driver/${driver._id}`, { headers: { authorization: 'Bearer test' } }); // It might fail if JWT is required. Let's just use the service function directly.
  console.log(driver._id);
  process.exit(0);
});

/// add driver update api 
/// add payment api 
/// add