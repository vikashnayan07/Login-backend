const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const clientEmail = "vikashnayan7.official@gmail.com";
const password = "cnsuztzlxwboyabj";

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
    // Appears in header & footer of e-mails
    name: "Mailgen",
    link: "https://twitter.com/vikashnayan7",
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
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
          text: "Confirm your account",
          link: "https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010",
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
