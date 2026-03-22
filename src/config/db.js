const mongoose=require("mongoose");


function connectToDB() {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("DB Connected!!")
    }).catch(err=>{
        console.log("Error connecting to DB");
        process.exit(1);
    })
}

module.exports=connectToDB;