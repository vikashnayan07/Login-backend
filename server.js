const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectToMongoDb } = require("./config/db");
const dotenv = require("dotenv");

const router = require("./router/route");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(201).send("Hello");
});

app.use("/api", router);

connectToMongoDb(process.env.mongoURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Invalid database connection:", error);
  });
