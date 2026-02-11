
const mongoose = require('mongoose');
const fs = require('fs');

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
    let output = "";
    const log = (msg) => {
        console.log(msg);
        output += msg + "\n";
    };

    try {
        log("Connecting...");
        const options = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            family: 4, // Force IPv4
        };
        await mongoose.connect(MONGODB_URI, options);
        log("Connected to MongoDB");

        const trips = await UpcomingTrip.find({});
        log(`Found ${trips.length} trips.`);

        trips.forEach(trip => {
            log(`Trip: ${trip.name} (${trip.id})`);
            log(`  Price: ${trip.price} (Type: ${typeof trip.price})`);
            log(`  Offer: ${trip.offer} (Type: ${typeof trip.offer})`);
            log('---');
        });

    } catch (error) {
        log("Error: " + error.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        fs.writeFileSync('db_check_output.txt', output);
    }
}

checkTrips();
