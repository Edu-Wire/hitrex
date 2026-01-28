// const mongoose = require('mongoose');

// const MONGODB_URI = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure";

// const DestinationSchema = new mongoose.Schema({ isActive: Boolean }, { strict: false });
// const UpcomingTripSchema = new mongoose.Schema({}, { strict: false });

// async function check() {
//     await mongoose.connect(MONGODB_URI);
//     console.log("Connected");

//     const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
//     const UpcomingTrip = mongoose.models.UpcomingTrip || mongoose.model('UpcomingTrip', UpcomingTripSchema);

//     const destCount = await Destination.countDocuments({ isActive: true });
//     const allDestCount = await Destination.countDocuments();
//     const tripCount = await UpcomingTrip.countDocuments();

//     console.log("Active Destinations:", destCount);
//     console.log("Total Destinations:", allDestCount);
//     console.log("Upcoming Trips:", tripCount);

//     const trips = await UpcomingTrip.find().limit(1).lean();
//     console.log("Sample Trip:", JSON.stringify(trips, null, 2));

//     const dests = await Destination.find({ isActive: true }).limit(1).lean();
//     console.log("Sample Destination:", JSON.stringify(dests, null, 2));

//     process.exit();
// }

// check().catch(err => {
//     console.error(err);
//     process.exit(1);
// });
