const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
const { nanoid } = require("nanoid");
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(data);
});

app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  newNote.id = nanoid();
  const data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  data.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(data));
  res.json(newNote);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.delete("/api/notes/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const newData = data.filter((note) => req.params.id !== note.id);
  fs.writeFileSync("./db/db.json", JSON.stringify(newData));
  res.json(req.params.id);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
