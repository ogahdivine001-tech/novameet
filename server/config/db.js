const mongoose = require("mongoose");
const dns = require("dns");

// Some Windows setups (certain routers, ISPs, VPNs, or antivirus software)
// cause Node's built-in DNS resolver to fail on mongodb+srv SRV lookups even
// though the OS resolver succeeds. Explicitly pointing Node at public DNS
// servers works around this without requiring a non-SRV connection string.
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
