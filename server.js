const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(cors());

app.use(morgan("tiny"));

const PORT = 8000;

app.get("/", (req, res) => {
  res.status(201).send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
