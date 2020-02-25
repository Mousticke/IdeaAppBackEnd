import mongoose from "mongoose";

mongoose.Promise = Promise;

//If node process ends
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

const connectMongoDB = async (connection) => {

  mongoose.connection.on("connected", () => {
    console.info(`Mongoose connection open to : ${connection}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.info(`Mongoose connection disconnected on : ${connection}`);
  });

  await mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

  });
};

const closeMongoDB = () => {
  mongoose.connection.close();
}

export { connectMongoDB, closeMongoDB };
