import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserId = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  // destruction
  const { name, email, password, confPassword, role } = req.body;
  // cek apakah password tidak sama dengan konfirm
  if (password !== confPassword)
    return res.status(201).json({ msg: "Password doesn't match" });
  // jika password match hash password nya
  let hashPassword = await argon2.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(200).json({ msg: "User created" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  // cek apakah user ada atau tidak
  if (!user) return res.status(404).json({ msg: "User not exist" });
  let hashPassword;
  // destruction
  const { name, email, password, confPassword, role } = req.body;

  // cek apakah password sama
  if (password !== confPassword)
    return res.status(201).json({ msg: "Password doesn't match" });

  // jika password kosong atau null maka pake password sebelum nya
  if (password === "" || password === null) {
    // set password yang ada sebelum nya
    hashPassword = user.password;
  } else {
    // jika ada make hash ulang
    hashPassword = await argon2.hash(password);
  }
  try {
    // update ke DB
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(201).json({ msg: "User has been updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  // cek apakah user ada atau tidak
  if (!user) return res.status(404).json({ msg: "User not exist" });
  try {
    // delete ke DB
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(201).json({ msg: "User has been deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
