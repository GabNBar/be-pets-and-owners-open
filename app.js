/// app.js
const express = require("express");
const app = express();
const fs = require("fs/promises");

app.get("/", (req, res) => res.send("Hello World!"));

//get owner by id
app.get("/api/owner/:id", (req, res) => {
  console.log(req.params.id, "params", req.query, "query");
  fs.readFile(`data/owners/${req.params.id}.json`, "utf-8").then((owner) => {
    console.log(owner);
    res.send("into owne1rs");
  });
});

//get array of owners

// server.js
app.listen(9090, () => {
  console.log(`Server is listening on port 9090...`);
});
