// Database Connection Checker Script
// =================================
// Purpose: Test MongoDB connection and verify database data
// Usage: Run this script to check if database is working correctly
// Command: node check_db.js

// Import required MongoDB/Mongoose library
const mongoose = require('mongoose');

// MongoDB Atlas connection string for the Trekking Adventure database
// Using SRV connection for better reliability and automatic server discovery
const MONGODB_URI = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure";

// Define flexible schemas for database operations
// Using strict: false allows reading any document structure
const DestinationSchema = new mongoose.Schema({ isActive: Boolean }, { strict: false });
const UpcomingTripSchema = new mongoose.Schema({}, { strict: false });

// Main database checking function
async function checkDatabase() {
    try {
        // Connect to MongoDB Atlas
        console.log("🔗 Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Successfully connected to database");

        // Get or create model references
        // This prevents model redefinition errors if script runs multiple times
        const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
        const UpcomingTrip = mongoose.models.UpcomingTrip || mongoose.model('UpcomingTrip', UpcomingTripSchema);

        // Count active destinations (only those marked as active)
        console.log("\n📊 Checking destination counts...");
        const destCount = await Destination.countDocuments({ isActive: true });
        console.log("📍 Active Destinations:", destCount);

        // Count total destinations (including inactive ones)
        const allDestCount = await Destination.countDocuments();
        console.log("📍 Total Destinations:", allDestCount);

        // Count all upcoming trips
        console.log("\n📅 Checking upcoming trips...");
        const tripCount = await UpcomingTrip.countDocuments();
        console.log("🚀 Upcoming Trips:", tripCount);

        // Get sample data for verification
        console.log("\n🔍 Verifying data structure...");
        
        // Get one sample trip to check data integrity
        const trips = await UpcomingTrip.find().limit(1).lean();
        console.log("📋 Sample Trip Data:");
        console.log(JSON.stringify(trips, null, 2));

        // Get one sample active destination to check data integrity
        const dests = await Destination.find({ isActive: true }).limit(1).lean();
        console.log("\n📋 Sample Destination Data:");
        console.log(JSON.stringify(dests, null, 2));

        console.log("\n✅ Database check completed successfully!");
        process.exit(0);
        
    } catch (error) {
        console.error("\n❌ Database check failed:");
        console.error("Error details:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
}

// Execute the database check
console.log("🚀 Starting database connection test...");
checkDatabase();
