const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../services/email.service");
const tokenBlackListModel=require("../models/blackList.model")

async function userRegisterController(req, res) {
  try {
    const { email, password, name } = req.body;

    const isExists = await User.findOne({ email });

    if (isExists) {
      return res.status(422).json({
        message: "User already exists with email",
        status: "failed"
      });
    }

    const user = await User.create({
      email,
      password,
      name
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("token", token);

    await sendRegistrationEmail(user.email, user.name);

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Email or password is invalid"
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email or password is invalid"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("token", token, {
      httpOnly: true
    });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}


async function userLogout(req,res){
   const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}



module.exports = {
  userRegisterController,
  userLoginController,
  userLogout
};