import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Products.findAll({
        attributes: ["uuid", "name", "price"],
        // relasi antar tabel
        include: [
          {
            model: Users,
            attributes: ["name", "email", "role"],
          },
        ],
      });
    } else {
      response = await Products.findAll({
        attributes: ["uuid", "name", "price"],
        // relasi antar tabel
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email", "role"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    let product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // cek apakah ada product dengan id
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let response;
    if (req.role === "admin") {
      response = await Products.findOne({
        attributes: ["uuid", "name", "price"],
        // cari berdasarkan id barang
        where: {
          id: product.id,
        },
        // relasi antar tabel
        include: [
          {
            model: Users,
            attributes: ["name", "email", "role"],
          },
        ],
      });
    } else {
      response = await Products.findOne({
        attributes: ["uuid", "name", "price"],
        // jika login sebagai user maka saya akan select berdasarkan id product dan user yang sedang login
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        // relasi antar tabel
        include: [
          {
            model: Users,
            attributes: ["name", "email", "role"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Products.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(200).json({ msg: "Product has been created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // cek apakah ada product dengan id
    if (!product) return res.status(404).json({ msg: "Product not found" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Products.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Access Forbidden ! (Admin Only)" });
      await Products.update(
        { name, price },
        {
          // jika login sebagai user maka saya akan select berdasarkan id product dan user yang sedang login
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product has been updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    let product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    // cek apakah ada product dengan id
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (req.role === "admin") {
      await Products.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Access Forbidden ! (Admin Only)" });
      await Products.destroy({
        // jika login sebagai user maka saya akan select berdasarkan id product dan user yang sedang login
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Product has been deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
