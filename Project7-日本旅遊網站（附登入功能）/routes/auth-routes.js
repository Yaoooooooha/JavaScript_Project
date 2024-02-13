const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

/*-----------
middleware
-----------*/
// 設置靜態文件目錄
router.use(express.static("public"));

/*-----------
routes
-----------*/
// 網站登入頁面
router.get("/login", async (req, res) => {
  return res.render("login", { login: req.isAuthenticated() }); // 傳入 { login: req.isAuthenticated() } 是為了確認 user 是否在登入狀態
});

// 註冊
router.get("/signup", (req, res) => {
  return res.render("signup", { login: req.isAuthenticated() });
});

// 登出
router.get("/logout", (req, res) => {
  // passport 內建的 method
  req.logOut((err) => {
    if (err) return res.send(err);
    // 跳轉回首頁
    return res.redirect("/");
  });
});

// 連接至 google 登入頁面，進行 authentication
router.get(
  "/google",
  // middleware
  passport.authenticate("google", {
    scope: ["profile", "email"], // 要向 Resource Server 拿取的資料
    prompt: "select_account", // 讓用戶在登入時可以選擇帳號
  })
);

// 處理 authentication 結束後，跳轉的 redirect URL
router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/auth/login" }), // 用戶在授權時點取消的話會造成失敗，導回登入頁面
  (req, res) => {
    return res.redirect("/profile");
  }
);

// 處理 Local Login，進行 authentication
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login", // 當 Local Strategy 中的 callback function 中的 done() 的地案個參數回傳 false 時執行
    failureFlash: "登入失敗。帳號或密碼不正確", // 用 flash 紀錄失敗訊息
  }),
  async (req, res) => {
    return res.redirect("/profile");
  }
);

// 處理 signup 頁面中用戶輸入的資訊
router.post("/signup", async (req, res) => {
  // 接收用戶輸入的資訊
  let { name, username, password } = req.body;
  // 檢查密碼長度，避免用戶使用 postman 直接傳送資料，略過 HTML 中的過濾機制
  if (password.length < 8) {
    // 在 request 中儲存 key-value pair 的訊息，並在 redirect 到 signup 頁面後顯示
    req.flash("error_msg", "密碼長度過短，至少需要8個數字或英文字");
    return res.redirect("/auth/signup");
  }

  // 確認信箱是否被註冊過
  const foundUser = await User.findOne({ email: username }).exec(); // login.ejs 跟 signup.ejs 中的 email 欄位名稱都是 username
  console.log(foundUser);
  if (foundUser) {
    // 在 request 中儲存 key-value pair 的訊息，並在 redirect 到 signup 頁面後顯示
    req.flash(
      "error_msg",
      "信箱已經被註冊。請使用另一個信箱，或者嘗試使用此信箱登入系統"
    );
    return res.redirect("/auth/signup");
  }

  // 幫密碼進行 hash 後再儲存到 MongoDB
  let hashedPassword = await bcrypt.hash(password, 12);
  let newUser = new User({ name, email: username, password: hashedPassword });
  await newUser.save();
  // 在 request 中儲存 key-value pair 的訊息，並在 redirect 到 login 頁面後顯示
  req.flash("success_msg", "恭喜註冊成功! 現在可以登入系統了!");
  return res.redirect("/auth/login");
});

module.exports = router;
