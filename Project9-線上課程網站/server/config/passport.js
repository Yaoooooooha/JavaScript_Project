const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").User;

module.exports = (passport) => {
  let opts = {};
  // 將位於 header 的 JWT 抽取出來
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  // 儲存 secret
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    // jwt_payload 是在 auth-route.js 中所存入的 tokenObject
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        // 確認用戶是否存在
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          return done(null, foundUser); // 設定 req.user = foundUser
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
