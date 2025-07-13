// src/api/events.js
const fs = require("fs");
const path = require("path");
const { readFileData, writeFileData } = require("../utils/file");

const dbPath = path.resolve(__dirname, "../db.json");

const events = async (req, res) => {
  const data = await readFileData(dbPath);
  writeFileData(dbPath, data);
  return res.status(200).json(data);
};

module.exports = events;
