import express from "express";
import {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/User.js";

// middleware mengharuskan user login dahulu
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const route = express.Router();

route.get("/users", verifyUser, adminOnly, getUsers);
route.get("/users/:id", verifyUser, adminOnly, getUserId);
route.post("/users", verifyUser, adminOnly, createUser);
route.put("/users/:id", verifyUser, adminOnly, updateUser);
route.delete("/users/:id", verifyUser, adminOnly, deleteUser);

export default route;
