import Users from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(400).json({ msg: "Login first" });
  }
  const user = await Users.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  // cek apakah user ada atau tidak
  if (!user) return res.status(404).json({ msg: "User not exist" });
  // digunakan untuk setiap controller
  req.userId = user.id;
  req.role = user.role;
  next();
};

// posisi sudah pasti login
export const adminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  // cek apakah user ada atau tidak
  if (!user) return res.status(404).json({ msg: "User not exist" });
  // cek apakah admin atau bukan
  if (user.role !== "admin")
    return res.status(403).json({ msg: "Access Forbidden" });
  next();
};
