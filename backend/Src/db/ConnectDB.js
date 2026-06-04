import mongoose from "mongoose";

const db = async() => {
  try {
    const ConectSchema = await mongoose.connect(process.env.db_url)

    console.log("Database is connectedx successfully \n",ConectSchema.connection.host)
    
  } catch (error) {
    console.log("DataBase connection faild  " , error)
  }
}

export default db ;