import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/Product.js";
import { verifyUser } from "../middleware/AuthUser.js";

const route = express.Router();

route.get("/products", verifyUser, getProducts);
route.get("/products/:id", verifyUser, getProductById);
route.post("/products", verifyUser, createProduct);
route.put("/products/:id", verifyUser, updateProduct);
route.delete("/products/:id", verifyUser, deleteProduct);

export default route;
