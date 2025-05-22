const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        console.log("Connecting to MongoDB.....");
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB Connected Succesfully! :)");
        
        
        
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);        
    }
}

module.exports = connectToMongoDB;