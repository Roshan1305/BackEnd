const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 9000;

const nodemailer = require("nodemailer");
app.use(express.json());

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "examcontr@gmail.com",
    pass: "Examco13",
  },
  requireTLS: true,
  port: 587,
});
// async function myCustomMethod(ctx) {
//   let cmd = await ctx.sendCommand(
//     "AUTH PLAIN " +
//       Buffer.from(
//         "\u0000" +
//           ctx.auth.credentials.user +
//           "\u0000" +
//           ctx.auth.credentials.pass,
//         "utf-8"
//       ).toString("base64")
//   );

//   if (cmd.status < 200 || cmd.status >= 300) {
//     throw new Error("Failed to authenticate user: " + cmd.text);
//   }
// }

// let transporter = nodemailer.createTransport({
//   host: "smtp.example.com",
//   port: 465,
//   secure: true,
//   auth: {
//     type: "custom",
//     method: "MY-CUSTOM-METHOD", // forces Nodemailer to use your custom handler
//     user: "username",
//     pass: "verysecret",
//   },
//   customAuth: {
//     "MY-CUSTOM-METHOD": myCustomMethod,
//   },
// });
mongoose.connect(
  "mongodb+srv://adminexam:examadmin21@cluster0.fyujg.mongodb.net/ExamResponseDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", function (error) {
  console.error("Database connection error:", error);
});

mongoose.connection.once("open", function () {
  console.log("Database connected");
});
app.use(cors());

const answerSchema = new mongoose.Schema({
  answer1: String,
  answer2: String,
  answer3: String,
  answer4: String,
  answer5: String,
  answer6: String,
  answer7: String,
  answer8: String,
  answer9: String,
  answer10: String,
  email: String,
});
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  regno: Number,
  isSubmitted: { type: Boolean, default: false },
  answer: answerSchema,
  code: Number,
  isVerified: { type: Boolean, default: false },
});

const Answer = new mongoose.model("Answer", answerSchema);
const User = new mongoose.model("User", userSchema);
app.post("/user", (req, res) => {
  console.log(req.body);

  var minm = 100000;
  var maxm = 999990;
  var random = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  User.findOne({ email: req.body.email }, (err, found) => {
    if (!err) {
      console.log(found);
      if (found == null) {
        const user = new User({
          name: req.body.name,
          regno: req.body.reg,
          email: req.body.email,
          isSubmitted: false,
          code: random,
        });
        obj = user;
        user.save();
        res.send("Got it");
      } else {
        res.send("already");
        found.code = random;
        found.save();
      }
    } else {
      res.send("hi");
    }
  });
  console.log(random);
  if (req.body.email != "admin") {
    var mailOptions = {
      from: "examcontr@gmail.com",
      to: req.body.email,
      subject: "Launcher Downloading Link..",
      text: "Hello",
      html:
        "<div> Hi '" +
        req.body.name +
        "' Your Verification code is '" +
        random +
        "'</div>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
});
app.post("/getanswer", (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.em }, (err, found) => {
    found.isSubmitted = true;
    found.save();
    const answer = new Answer({
      answer1: req.body.answero1,
      answer2: req.body.answero2,
      answer3: req.body.answero3,
      answer4: req.body.answero4,
      answer5: req.body.answero5,
      answer6: req.body.answero6,
      answer7: req.body.answero7,
      answer8: req.body.answero8,
      answer9: req.body.answero9,
      answer10: req.body.answero10,
      email: req.body.em,
    });
    answer.save();
  });
});
app.post("/submitted", (req, res) => {
  User.findOne({ email: req.body.email }, (err, found) => {
    if (found != null) {
      console.log(found);
      console.log("Hi");
      res.send(found.isSubmitted);
    } else {
      res.send(false);
    }
  });
});
app.get("/answer", (req, res) => {
  Answer.find({}, (err, found) => {
    res.send(found);
  });
});
app.post("/verify", (req, res) => {
  User.findOne({ email: req.body.em }, (err, found) => {
    if (!err) {
      if (found.code == req.body.code) {
        found.isVerified = true;
        found.save();
        res.send(true);
      } else {
        res.send(false);
      }
    } else {
      console.log(err);
    }
  });
});
app.post("/sendverify", (req, res) => {
  User.findOne({ email: req.body.em }, (err, found) => {
    if (!err) {
      res.send(found.isVerified);
    } else {
      console.log(err);
    }
  });
});
app.post("/user-det", (req, res) => {
  console.log("yesssss");
  User.findOne({ email: req.body.em }, (err, found) => {
    if (!err) {
      console.log(found);
      res.send(found);
    } else {
      console.log(err);
    }
  });
});
app.listen(port, () => console.log("Listening on Port:${port}"));
