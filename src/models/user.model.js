const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required for creating a user"],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please use a valid email address"
    ],
    unique :[true , "email already exists."]
  },
  name:{
    type:String,
    required :[true," Name is required for creting an account "]
  },
  password :{
    type:String ,
    required :[true , "Password is required for creating an account"] ,
    minLength :[6 , "password should contain more than 6 characters "],
    select :false 
  }
},{
    timestamps: true
});

userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    return next();
  }
  const hash=await bcrypt.hash(this.password,10)
  this.password=hash;

  return next()

    
})
userSchema.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password);


}

module.exports = mongoose.model("User", userSchema);