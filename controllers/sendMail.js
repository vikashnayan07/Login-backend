const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const dotenv = require("dotenv");
dotenv.config();

const clientEmail = process.env.EMAIL;
const password = process.env.PASS;

let nodeConfig = {
  service: "gmail",
  auth: {
    user: clientEmail,
    pass: password,
  },
};
let transporter = nodemailer.createTransport(nodeConfig);
let mailGenerator = new Mailgen({
  theme: "default",
  product: {
  
    name: "Mailgen",
    link: "https://twitter.com/vikashnayan7",
  },
});

const registerToMail = (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  var email = {
    body: {
      name: username,
      intro:
        text || "Welcome to Mailgen! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Mailgen, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Follow my x account",
          link: "https://x.com/vikashnayan7",
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = mailGenerator.generate(email);

  const info = {
    from: clientEmail, // sender address
    to: userEmail, // list of receivers
    subject: subject || "Hello ✔", // Subject line
    html: emailBody, // html body
  };

  transporter
    .sendMail(info)
    .then(() => {
      return res.status(201).send({ msg: "Received an email" });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};
module.exports = registerToMail;
