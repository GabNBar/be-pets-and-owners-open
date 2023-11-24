/// app.js
const { json } = require("body-parser");
const { error } = require("console");
const express = require("express");
const app = express();
const fs = require("fs/promises");

app.get("/", (req, res) => res.send("Hello World!"));

//get owner by id
app.get("/api/owner/:id", (req, res) => {
  console.log(req.params.id, "params", req.query, "query");
  fs.readFile(`data/owners/${req.params.id}.json`, "utf-8").then((owner) => {
    console.log(owner, "owner no parse");
    const parsedOwner = JSON.parse(owner);
    console.log(parsedOwner.name, "parsed owner");
    res.send(parsedOwner);
  });
});

//get array of owners

app.get("/api/owners", (req, res) => {
  const ownersDir = "data/owners/";

  fs.readdir(ownersDir, "utf-8")
    .then((files) => {
      const ownersFile = files.map((file) => file);
      res.send(ownersFile);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// server.js
app.listen(9090, () => {
  console.log(`Server is listening on port 9090...`);
});
