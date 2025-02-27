const express = require("express");
const app = express();
const pagesRouter = require("./routes/pagesRouter");
const path = require("path");
require("dotenv").config();

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", pagesRouter);

// app.all("/*", (req, res) => {
//   res.send("Invalid page");
// });

app.listen(process.env.EX_PORT, () => {
  console.log(`listening on port ${process.env.EX_PORT}`);
});
