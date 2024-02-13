const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

// 設定 Google Strategy 的登入方式
passport.use(
  // 新增 GoogleStrategy 物件，傳入 (object, function)
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth2.0 用戶端 id
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth2.0 用戶端 secret
      callbackURL: "/auth/google/redirect", // redirect URL
    },
    // middleware
    // 處理 Resource Server 回傳給 Client Server 的 token 跟 data
    async (accessToken, refreshToken, profile, done) => {
      // 確認 MongoDB 中有沒有該使用者的資料
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        done(null, foundUser); // done() 的第一個參數為 null，第二個為用戶資料
      } else {
        // 創建 user 的 document
        let newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value, // 頭貼
          email: profile.emails[0].value,
        });
        // 儲存到 MongoDB
        let savedUser = await newUser.save();
        done(null, savedUser);
      }
    }
  )
);

// 設定 Local Strategy 的登入方式
passport.use(
  // 新增 GoogleStrategy 物件，傳入 function(username, password, done)
  // 注意，login.ejs 跟 signup.ejs 中的 email 欄位名稱要設定為 username，密碼欄位名稱要設定為 password
  new LocalStrategy(async (username, password, done) => {
    // 確認信箱是否被註冊過
    let foundUser = await User.findOne({ email: username });
    // 尚未註冊過
    if (!foundUser) {
      done(null, false);
      // 有用 Google 帳號註冊過
    } else if (!foundUser.password && foundUser.googleID) {
      done(null, false);
      // 有用 Local 帳號註冊過
    } else {
      // 確認密碼是否正確
      bcrypt.compare(password, foundUser.password, (err, result) => {
        if (result) {
          done(null, foundUser);
        } else {
          done(null, false);
        }
      });
    }
  })
);

// 在 Strategy 中的 done 被執行後被呼叫
passport.serializeUser((user, done) => {
  // 將 doncument 在 mongoDB 中的 id，儲存在 session
  // 並且將 id 簽名後，以 Cookie 的形式給使用者
  done(null, user._id);
  // 接著執行 redirect URL 的 request
});

// 在執行完 redirect URL 的 request 被呼叫
passport.deserializeUser(async (_id, done) => {
  //使用 serializeUser() 儲存的 id，去找到資料庫內的資料
  let foundUser = await User.findOne({ _id });
  // 將 req.user 這個屬性設定為 foundUser
  done(null, foundUser);
  // 接著繼續執行 redirect URL 的 route
});
