import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  // cek apakah user ada atau tidak
  if (!user) return res.status(404).json({ msg: "User not exist" });
  // cek apakah password match dengan DB
  let matchPassword = await argon2.verify(user.password, req.body.password);
  if (!matchPassword)
    return res.status(401).json({ msg: "Password doesn't match" });
  // jika password match set session
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  // jika berhasil maka respon
  res.status(200).json({ uuid, name, email, role });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ msg: "Login first" });
  } else {
    const user = await Users.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.session.userId,
      },
    });
    // cek apakah user ada atau tidak
    if (!user) return res.status(404).json({ msg: "User not exist" });
    res.status(200).json(user);
  }
};

export const Logout = (req, res) => {
  // eksperiment
  if (!req.session.userId) {
    return res.status(400).json({ msg: "Login first" });
  } else {
    // hancurkan session nya
    req.session.destroy((err) => {
      if (err) return res.status(401).json({ msg: "Must login first" });
      res.status(200).json({ msg: "Logout successfully" });
    });
  }
};
