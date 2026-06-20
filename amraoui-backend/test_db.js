const mongoose = require('mongoose');
const uri = "mongodb+srv://tayeb2:ipwpdW4wJdnArOyj@cluster0.hluu9.mongodb.net/amraoui_backend?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed", err);
    process.exit(1);
  });
