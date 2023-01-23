import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

// (async () => {
//   await db.sync();
// })();

// config
const port = process.env.WEB_PORT;

const app = express();

// session yang di simpan
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// Midlleware
app.use(
  cors({
    // berguna agar FE dapat mengirim req berupa req / cookie credential nya
    credentials: true,
    // domain yang diizinkan mengakses API kita bisa array
    origin: "http://localhost:3000",
  })
);
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      // tergantung http atau https isi auto saja agar dinamis
      secure: "auto",
    },
  })
);
app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// membuat table sessions
// store.sync();

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
