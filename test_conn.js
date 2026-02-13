const mongoose = require('mongoose');
const dns = require('dns');

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.error("Failed to set DNS servers:", e);
}

require('dotenv').config({ path: '.env.local' });

const uri = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure";


async function test() {
    console.log("Testing connection to:", uri.replace(/:([^@]+)@/, ':****@'));
    try {
        await mongoose.connect(uri, { family: 4 });
        console.log("SUCCESS: Connected to MongoDB!");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: Connection failed!");
        console.error(err);
        process.exit(1);
    }
}

test();
