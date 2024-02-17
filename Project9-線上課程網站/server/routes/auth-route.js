const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").User; // 不用輸入 /index.js 就會自連結
const jwt = require("jsonwebtoken");

/*-----------
middleware
-----------*/
router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

/*-----------
routes
-----------*/
// 處理註冊資料
router.post("/register", async (req, res) => {
  //確認數據是否符合規範
  let { error } = registerValidation(req.body); // 用 validation.js 裡面使用 joi 套件製作的檢查流程
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("此信箱已經被註冊，請嘗試別的信箱或直接登入");

  // 製作新用戶
  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "成功註冊會員",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("註冊失敗，無法儲存使用者");
  }
});

// 處理登入資料
router.post("/login", async (req, res) => {
  //確認數據是否符合規範
  let { error } = loginValidation(req.body); // 用 validation.js 裡面使用 joi 套件製作的檢查流程
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("無法找到使用者，請確認信箱是否正確");
  }

  // Instance Method
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      // 製作 json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET); // 簽名
      return res.send({
        message: "登入成功",
        token: "JWT " + token, // JWT 後面要打空格，不然會有 bug
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
