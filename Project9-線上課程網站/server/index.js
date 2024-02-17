/*====================
Packages
====================*/

/*-----------
node_modules
-----------*/
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const cors = require("cors");

/*-----------
routes
-----------*/
// 不用輸入 /index.js 就會自連結
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;

/*====================
Pre-setting
====================*/

/*-----------
PassportJS
-----------*/
// 立即執行 passport 中設定的 strategy
require("./config/passport")(passport);

/*-----------
MongoDB
-----------*/
// 連結MongoDB
mongoose
  .connect("mongodb://localhost:27017/mernDB")
  .then(() => {
    console.log("連結到mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

/*-----------
middleware
-----------*/
// 設置靜態文件目錄
app.use(express.static("public"));
// 處理 HTTP Request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// 設定routes
app.use("/api/user", authRoute);
// course route 應該被 jwt 保護
// 如果 request header 內部沒有 jwt，則 request 就會被視為是 unauthorized
app.use(
  "/api/courses",
  // middleware，用來認證用戶是否通過 JWT Athentication
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

/*====================
After-setting
====================*/

app.listen(8080, () => {
  console.log("後端伺服器聆聽在port 8080...");
});
