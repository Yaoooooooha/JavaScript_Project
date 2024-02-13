/*====================
Packages
====================*/

/*-----------
node_modules
-----------*/
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

/*-----------
routes
-----------*/
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");

/*====================
Pre-setting
====================*/

/*-----------
PassportJS
-----------*/
// 立即執行 passport 中設定的 strategy
require("./config/passport");

/*-----------
MongoDB
-----------*/
// 連結MongoDB
mongoose
  .connect("mongodb://localhost:27017/project7DB")
  .then(() => {
    console.log("Connecting to project7DB...");
  })
  .catch((e) => {
    console.log(e);
  });

/*-----------
middleware
-----------*/
// 設置靜態文件目錄
app.use(express.static("public"));
// 設定 Middlewares 以及排版引擎
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 設定 session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
// 設定 passport
app.use(passport.initialize()); // 讓 passport 開始運行認證功能
app.use(passport.session()); // 讓 passport 可以使用 session
//設定 flash
app.use(flash());
app.use((req, res, next) => {
  // res.locals 中的屬性會被自動帶入 render() 裡面作為傳入參數
  // 我們會在 message.ejs 中用到
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
// 設定routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

/*====================
Routes
====================*/
app.get("/", (req, res) => {
  return res.render("index", { login: req.isAuthenticated() }); // 傳入 { login: req.isAuthenticated() } 是為了確認 user 是否在登入狀態
});

/*====================
After-setting
====================*/

// 啟動 Server
app.listen(8080, () => {
  console.log("Server running on port 8080.");
});
