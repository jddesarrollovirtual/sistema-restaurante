import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant';
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB successfully');
    } catch (err) {
        console.error('❌ Could not connect to MongoDB:', err);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
