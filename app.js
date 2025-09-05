require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const loginRoutes = require("./Routes/authRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const sessionRoutes = require("./Routes/sessionRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const mailRoutes = require("./Routes/mailRoutes");
const pricingRoutes = require("./Routes/pricingRoutes");

const fileUpload = require("express-fileupload");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow any origin dynamically
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

app.use("/admin", loginRoutes);
app.use("/admin", chatRoutes);
app.use("/admin", sessionRoutes);
app.use("/admin", mailRoutes);
app.use("/admin", blogRoutes);
app.use("/admin", pricingRoutes);

module.exports = app;
