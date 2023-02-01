const express = require("express");
const UserRepo = require("../repos/user-repo");
const userRepo = require("../repos/user-repo");
const router = express.Router();

router.get("/users", async (req, res) => {
  const users = await userRepo.find();
  res.send(users);
});
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await UserRepo.findById(id);
  if (user) res.send(user);
  else res.sendStatus(404);
});
router.post("/users", async (req, res) => {
  const { bio, username } = req.body;
  const user = await UserRepo.insert(bio, username);
  if (user) res.send(user);
  else res.sendStatus(404);
});
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, username } = req.body;
  const user = await UserRepo.update(id, bio, username);
  if (user) res.send(user);
  else res.sendStatus(404);
});
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await UserRepo.delete(id);
  if (user) res.send(user);
  else res.sendStatus(404);
});

module.exports = router;
