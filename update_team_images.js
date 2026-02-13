const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure";

const TeamMemberSchema = new mongoose.Schema({}, { strict: false });

async function updateTeamImages() {
    try {
        console.log("🔗 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected.");

        const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);

        const members = await TeamMember.find();
        console.log(`Found ${members.length} team members.`);

        if (members.length === 0) {
            console.log("No team members found in DB. Creating them...");
            await TeamMember.create([
                {
                    name: "Uzair Ahmed",
                    role: "Founder",
                    image: "/images/about/member1.png",
                    bio: "Uzair Ahmed is a professionally qualified accountant with a deep-rooted passion for travel, nature, and adventure...",
                    details: "With over 15 years of hiking experience...",
                    order: 1
                },
                {
                    name: "Mustafa Simsek",
                    role: "Co-Founder",
                    image: "/images/about/member2.png",
                    bio: "Mustafa Simsek is a professionally trained lawyer with a lifelong passion for mountains, hiking, and mountaineering...",
                    details: "One of the defining milestones of his early mountaineering career was successfully climbing Mount Ararat...",
                    order: 2
                }
            ]);
            console.log("✅ Created team members.");
        } else {
            console.log("Updating existing team members...");
            // Update Uzair
            await TeamMember.updateOne(
                { name: /Uzair/i },
                { $set: { image: "/images/about/member1.png" } }
            );
            // Update Mustafa
            await TeamMember.updateOne(
                { name: /Mustafa/i },
                { $set: { image: "/images/about/member2.png" } }
            );
            console.log("✅ Updated image paths in DB.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed:", error);
        process.exit(1);
    }
}

updateTeamImages();
