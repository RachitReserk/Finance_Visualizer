import mongoose from 'mongoose'

export async function connect() {
    try {
        const connection = mongoose.connection
        connection.on('connected',() => {
            console.log("MongoDB connected")
        })
        connection.on('error',() => {
            console.log("MongoDB connection error")
        })
        await mongoose.connect(process.env.MONGO_URI!)
    } catch(error) {
        console.log({error:error,message:"Error in dbConfig"})
    }
}