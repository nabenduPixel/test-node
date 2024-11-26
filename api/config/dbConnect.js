const mongoose = require("mongoose");
global.mongoose = mongoose;
mongoose.set('strictQuery', false);

// const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = 'mongodb+srv://sudhunabendu:2Aly1bLp41VaIVPs@cluster0.fwvqxqi.mongodb.net/altabookingTest?retryWrites=true&w=majority';

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env",
    );
}

let cached = global.mongoose;

if (!cached.conn) {
    cached = { conn: null, promise: null };
    global.mongoose = cached;
}

async function dbConnect() {     
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            useNewUrlParser: true, useUnifiedTopology: true
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('database connected');
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = dbConnect;   