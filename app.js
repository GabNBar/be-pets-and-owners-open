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

//GET /owners/:id/pets - responds with an array containing the data of all pets belonging to the relevant owner

app.get("/api/owners/:id/pets", (req, res) => {
  console.log(req.params.id, "url");

  const petsDir = "data/pets/";

  fs.readdir(petsDir, "utf-8")
    .then((pets) => {
      const readPromises = pets.map((pet) => {
        return fs
          .readFile(`${petsDir}/${pet}`, "utf-8")
          .then((aPet) => {
            const parsedPet = JSON.parse(aPet);
            if (parsedPet.owner === req.params.id) {
              return parsedPet.name;
            }
            return null;
          })
          .catch((error) => {
            console.error(`Error reading file ${pet}:`, error);
            return null;
          });
      });

      return Promise.all(readPromises);
    })
    .then((allPetsByOwner) => {
      const validPets = allPetsByOwner.filter((pet) => pet !== null);

      console.log(validPets);
      res.send(validPets);
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
