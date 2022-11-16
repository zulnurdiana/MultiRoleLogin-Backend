import { Sequelize } from "sequelize";

const db = new Sequelize("fullstack_auth", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
