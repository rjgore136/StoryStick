import mongoose from "mongoose";


export const connectDB = async(url)=> {
    try {
        await mongoose.connect(url)
        console.log("Database connection successfull!");
        
    } catch (e) {
        console.log(e.message);
    }
}