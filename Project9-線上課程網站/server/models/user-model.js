const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "instructor"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // instance methods
    // 為防止 this 值丟失，不能使用 arrow function expression
    methods: {
      isStudent() {
        return this.role == "student";
      },
      isIsntructor() {
        return this.role == "instructor";
      },
      async comparePassword(password, cbFn) {
        let result;
        try {
          result = await bcrypt.compare(password, this.password);
          return cbFn(null, result);
        } catch (e) {
          return cbFn(e, result);
        }
      },
    },
  }
);

/*-----------
mongoos middleware
-----------*/
// 若使用者為新用戶，或者是正在更改密碼，則將密碼進行雜湊處理
// 為防止 this 值丟失，不能使用 arrow function expression
userSchema.pre("save", async function (next) {
  // this 代表 mongoDB 內的 document
  // isNew 跟 isModified() 是 document 內建的 attribute 跟 method
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
