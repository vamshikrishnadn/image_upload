const mongoose = require('mongoose');
const config = require('../../config');

const Connect = async () => {
  try {
    const con = await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`Mongodb Connected: ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = Connect;
