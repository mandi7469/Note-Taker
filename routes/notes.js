const notes = require("express").Router();

// Helper function to generate unique ids
const uuid = require("../helpers/uuid");

// Helper functions for reading and writing to the JSON file
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");
const { json } = require("express");

// GET Route for retrieving all the notes
notes.get("/", (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// DELETE Route for a specific note
notes.delete("/:id", (req, res) => {
  const id = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((notes) => notes.id !== id);

      writeToFile("./db/db.json", result);

      res.json(`Note ${id} has been deleted`);
    });
});

// POST Route for submitting a note
notes.post("/", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit notes`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting a note");
  }
});

module.exports = notes;
