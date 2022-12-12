import express from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();

server.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`I'm running at http://localhost:${port}`);
});
