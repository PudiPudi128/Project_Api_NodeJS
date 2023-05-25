const mongoose = require('mongoose');


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("mongo connect projects_toys atlas");
}