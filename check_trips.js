
const mongoose = require('mongoose');

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

const dns = require('dns');

try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    console.warn("Failed to set DNS servers", e);
}

async function checkTrips() {
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

        const trips = await UpcomingTrip.find({});
        console.log(`Found ${trips.length} trips.`);

        trips.forEach(trip => {
            console.log(`Trip: ${trip.name} (${trip.id})`);
            console.log(`  Price: ${trip.price} (Type: ${typeof trip.price})`);
            console.log(`  Offer: ${trip.offer} (Type: ${typeof trip.offer})`);
            console.log('---');
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

checkTrips();
