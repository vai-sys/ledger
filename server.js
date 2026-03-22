const dotenv=require("dotenv");
const app=require("./src/app")
const connectToDB=require("./src/config/db.js")
dotenv.config();

connectToDB();


port=process.env.PORT
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})