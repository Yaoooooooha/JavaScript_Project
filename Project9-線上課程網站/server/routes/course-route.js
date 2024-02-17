const router = require("express").Router();
const Course = require("../models").Course;
const courseValidation = require("../validation").courseValidation;

/*-----------
middleware
-----------*/
router.use((req, res, next) => {
  console.log("course route正在接受一個request...");
  next();
});

/*-----------
routes
-----------*/
// 獲得系統中的所有課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      // Course 裡面有儲存 instructor 的 user _id，可以透過 .populate() 來獲取 MongoDB 內該用戶的資料
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師 id 來尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    // Course 裡面有儲存 instructor 的 user _id，可以透過 .populate() 來獲取 MongoDB 內該用戶的資料
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// 用學生 id 來尋找註冊過的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    // Course 裡面有儲存 instructor 的 user _id，可以透過 .populate() 來獲取 MongoDB 內該用戶的資料
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// 用課程名稱尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      // Course 裡面有儲存 instructor 的 user _id，可以透過 .populate() 來獲取 MongoDB 內該用戶的資料
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程 id 尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      // Course 裡面有儲存 instructor 的 user _id，可以透過 .populate() 來獲取 MongoDB 內該用戶的資料
      .populate("instructor", ["email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增課程
router.post("/", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body); // 用 validation.js 裡面使用 joi 套件製作的檢查流程
  if (error) return res.status(400).send(error.details[0].message);

  // 確認用戶是講師
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發佈新課程。若你已經是講師，請透過講師帳號登入");
  }

  let { title, description, price } = req.body;
  try {
    // 新增課程資料到 MongoDB
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send("成功創建新課程");
  } catch (e) {
    return res.status(500).send("無法創建課程");
  }
});

// 讓學生透過課程 id 來註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    course.students.push(req.user._id);
    await course.save();
    return res.send("註冊完成");
  } catch (e) {
    return res.send(e);
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body); // 用 validation.js 裡面使用 joi 套件製作的檢查流程
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法更新課程內容");
    }

    // 使用者必須是此課程講師，才能編輯課程
    // _id 是 reference data type，要比較值是否相等的話要使用 .equals()
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "成功更新課程資訊",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程的講師才能編輯課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程。無法刪除課程");
    }

    // 使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已被刪除");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
