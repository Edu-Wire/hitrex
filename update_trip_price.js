
const mongoose = require('mongoose');
const dns = require('dns');

try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    console.warn("Failed to set DNS servers", e);
}

const MONGODB_URI = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure?retryWrites=true&w=majority";

const upcomingTripSchema = new mongoose.Schema(
    {
        id: String,
        name: String,
        location: String,
        date: String,
        duration: String,
        image: String,
        description: String,
        pickupPoints: String,
        price: Number,
        offer: Number,
    },
    { timestamps: true }
);

const UpcomingTrip = mongoose.models.UpcomingTrip || mongoose.model("UpcomingTrip", upcomingTripSchema);

async function updateTrip() {
    try {
        console.log("Connecting...");
        const options = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            family: 4,
        };
        await mongoose.connect(MONGODB_URI, options);
        console.log("Connected to MongoDB");

        // Find the Ardennes trip
        const trip = await UpcomingTrip.findOne({ name: { $regex: /Ardennes/i } });
        if (!trip) {
            console.log("Trip not found");
            return;
        }
        console.log(`Found trip: ${trip.name}, Current Price: ${trip.price}`);

        // Update Price
        trip.price = 299;
        trip.offer = 10;
        await trip.save();

        console.log("Trip updated.");

        const updatedTrip = await UpcomingTrip.findById(trip._id);
        console.log(`Updated Trip Price: ${updatedTrip.price}`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
}

updateTrip();
