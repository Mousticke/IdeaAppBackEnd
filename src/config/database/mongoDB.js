import mongoose from 'mongoose';

mongoose.Promise = Promise;

// If node process ends
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        process.exit(0);
    });
});

export const connectMongoDB = async (connection) => {
    mongoose.connection.on('connected', () => {
        console.info(`Mongoose connection open to : ${connection}`);
    });

    await mongoose.connect(connection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,

    });
};

export const closeMongoDB = () => {
    mongoose.connection.close();
};
