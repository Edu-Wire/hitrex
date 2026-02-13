const mongoose = require('mongoose');
const uri = "mongodb+srv://eduwireinfo:TP6fseKwMQCTfwGH@cluster0.4t1nynz.mongodb.net/Trekking-adventure";
mongoose.connect(uri)
    .then(() => {
        console.log("Connected");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
