const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

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
