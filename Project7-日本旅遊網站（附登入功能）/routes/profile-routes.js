const express = require("express");
const router = express.Router();
const Post = require("../models/post-model");
const methodOverride = require("method-override");

/*-----------
middleware
-----------*/
// 設置靜態文件目錄
router.use(express.static("public"));
// 可以接收自己的 Delete Request
router.use(methodOverride("_method"));
// 確認使用者是否已經登入
const authCheck = (req, res, next) => {
  // 在執行 serializeUser() 後，req.isAuthenticated() 會被設定為 ture，代表已經登入
  if (req.isAuthenticated()) {
    next();
  } else {
    // 要求使用者登入
    return res.redirect("/auth/login");
  }
};

/*-----------
routes
-----------*/
// profile 首頁
router.get("/", authCheck, async (req, res) => {
  // 尋找作者為用戶的 post
  let postFound = await Post.find({ author: req.user._id });
  return res.render("profile", {
    user: req.user,
    login: req.isAuthenticated(),
    posts: postFound,
    editMode: false,
    postModel: Post,
  }); // deSerializeUser()
});

// 新增 post 的頁面
router.get("/post", authCheck, (req, res) => {
  return res.render("post", { user: req.user, login: req.isAuthenticated() });
});

// 處理用戶新增 post 的輸入
router.post("/post", authCheck, async (req, res) => {
  // 獲取用戶傳入的資料
  let { title, content } = req.body;
  // 新增 post 並存入 MongoDB
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    return res.redirect("/profile");
  } catch (e) {
    req.flash("error_msg", "標題與內容都需要填寫。");
    return res.redirect("/profile/post");
  }
});

// 旅遊日誌編輯頁面
router.get("/edit-post", authCheck, async (req, res) => {
  // 尋找作者為用戶的 post
  let postFound = await Post.find({ author: req.user._id });
  return res.render("profile", {
    user: req.user,
    login: req.isAuthenticated(),
    posts: postFound,
    editMode: true,
  });
});

// 刪除旅遊日誌
router.delete("/edit-post", authCheck, async (req, res) => {
  // 接收在 profile.js 中隨著 form 傳遞的隱藏資料
  checkboxArr = JSON.parse(req.body.additionalData);
  // 解析隱藏資料，決定要把哪些 post 從 MongoDB 中刪除
  for (let _checkbox of checkboxArr) {
    // 確認 MongoDB 中有該 post，且用戶選擇刪除
    let _postFound = await Post.find({ _id: _checkbox.id });
    if (_postFound && _checkbox.checked == true) {
      count = await Post.deleteOne({ _id: _checkbox.id });
    }
  }
  return res.redirect("/profile");
});

module.exports = router;
