const mongoose = require('mongoose');
const fs = require('fs');
const dns = require('dns');

// Try to use Google DNS to bypass local blocking
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log("DNS servers set to Google DNS");
} catch (e) {
    console.error("Failed to set DNS servers:", e);
}

const uri = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure?retryWrites=true&w=majority";

const logFile = 'debug_log.txt';
if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

log("Starting connection test with Google DNS...");

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
    .then(() => {
        log("Connected successfully!");
        process.exit(0);
    })
    .catch((err) => {
        log("Connection failed: " + err.stack);
        process.exit(1);
    });
