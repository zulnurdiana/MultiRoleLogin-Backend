import express from "express";
import { Login, Me, Logout } from "../controllers/Auth.js";

const route = express.Router();

route.get("/login", Login);
route.get("/me", Me);
route.delete("/logout", Logout);

export default route;
