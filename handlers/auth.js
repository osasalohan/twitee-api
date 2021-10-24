const db = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

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
    await authSchema.validateAsync(req.body);

    let username = req.body.email.split("@")[0];
    username = username[0].toUpperCase() + username.slice(1);
    let user = await db.User.create({ ...req.body, name: username });

    let { id, name, email, posts } = user;

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
        posts,
      },
      process.env.SECRET_KEY
    );
    res.status(200).json({
      id,
      name,
      posts,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, email is taken";
    }
    next({
      status: 400,
      message: err.message,
    });
  }
};

//checks if user exists and password is correct. Returns a token if true else returns error
exports.signin = async function (req, res, next) {
  try {
    await authSchema.validateAsync(req.body);

    let user = await db.User.findOne({
      email: req.body.email,
    });
    let { id, name, posts } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          name,
          posts,
        },
        process.env.SECRET_KEY
      );
      res.status(200).json({
        id,
        name,
        posts,
        token,
      });
    } else {
      next({
        status: 400,
        message: "Invalid email/password",
      });
    }
  } catch (err) {
    next({
      status: 400,
      message: "Invalid email/password",
    });
  }
};
