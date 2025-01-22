import mongoose from "mongoose"

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("DB connected");
    })
    console.log()
    await mongoose.connect(`mongodb+srv://arihant200514:rBv1xB3MXicOCbeC@dass.ubpho.mongodb.net/buy-sell`)
}

export default connectDB;