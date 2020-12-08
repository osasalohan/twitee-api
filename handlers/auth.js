const db = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

//gets name from email address, creates new user and sends welcome mail. Returns a token
exports.signup = async function (req, res, next) {
  try {
    let username = req.body.email.split("@")[0];
    username = username[0].toUpperCase() + username.slice(1);
    let user = await db.User.create({ ...req.body, name: username });

    let { id, name, email } = user;

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome To Twitee",
      text: "Thanks for signing up. Enjoy Twitee!",
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    let token = jwt.sign(
      {
        id,
        name,
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      name,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, email is taken";
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

//checks if user exists and password is correct. Returns a token if true else returns error
exports.signin = async function (req, res, next) {
  try {
    let user = await db.User.findOne({
      email: req.body.email,
    });
    let { id, name } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          name,
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        name,
        token,
      });
    } else {
      return next({
        status: 400,
        message: "Invalid email/password",
      });
    }
  } catch (err) {
    return next({
      status: 400,
      message: "Invalid email/password",
    });
  }
};
