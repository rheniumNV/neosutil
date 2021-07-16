require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const boolParser = require("express-query-boolean");
const router = require("./router");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(boolParser());

router(app);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("error").send();
});

app.use((_req, res, _next) => {
  console.warn("routing not found");
  res.status(404).send("NotFound").send();
});

app.set("port", process.env.PORT || 5000);
const server = app.listen(app.get("port"), () => {
  const { host, port } = server.address();
  console.info("Example app listening at http://%s:%s", host, port);
});
