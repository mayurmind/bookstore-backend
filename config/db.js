import mongoose from "mongoose"; 
import dotenv from "dotenv";  
dotenv.config();

const connectDB=async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
}

export default connectDB;