
const mongoose = require('mongoose');
const fs = require('fs');

// DNS Fix
const dns = require('dns');
try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch (e) { }

const MONGODB_URI = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure?retryWrites=true&w=majority";

const upcomingTripSchema = new mongoose.Schema({
    id: String, name: String, location: String, date: String, duration: String, image: String, description: String, pickupPoints: String, price: Number, offer: Number,
}, { timestamps: true });

const UpcomingTrip = mongoose.models.UpcomingTrip || mongoose.model("UpcomingTrip", upcomingTripSchema);

async function listPrices() {
    let output = "";
    const log = (str) => { console.log(str); output += str + "\n"; };

    try {
        const options = { bufferCommands: false, maxPoolSize: 10, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, family: 4 };
        await mongoose.connect(MONGODB_URI, options);
        log("Connected.");

        const trips = await UpcomingTrip.find({});
        log(`Count: ${trips.length}`);

        trips.forEach(t => {
            log(`Name: ${t.name}, ID: ${t.id}, Price: ${t.price}, Offer: ${t.offer}`);
        });

        fs.writeFileSync('prices_debug.txt', output);
    } catch (e) {
        log(e.toString());
        fs.writeFileSync('prices_debug.txt', output);
    } finally {
        if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    }
}

listPrices();
