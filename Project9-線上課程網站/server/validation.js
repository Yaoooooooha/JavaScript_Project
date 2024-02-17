const Joi = require("joi");

/*-------------------
檢查資料是否符合設定的標準
-------------------*/

// 註冊資歷
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(8).max(255).required(),
    role: Joi.string().required().valid("student", "instructor"),
  });

  return schema.validate(data);
};

// 登入資料
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(data);
};

// 新增課程資料
const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(200000).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
