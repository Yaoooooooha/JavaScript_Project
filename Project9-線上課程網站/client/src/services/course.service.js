import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";

// 負責連接到對應的 Crouse-Route
class CourseService {
  // Instance Methods
  post(title, description, price) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL,
      // 要提交的資料
      { title, description, price },
      // JWT
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  // 使用學生 id，找到學生註冊的課程
  getEnrolledCourses(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/student/" + _id, {
      // JWT
      headers: {
        Authorization: token,
      },
    });
  }
  // 使用 instructor id，來找到講師擁有的課程
  get(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/instructor/" + _id, {
      // JWT
      headers: {
        Authorization: token,
      },
    });
  }
  // 使用課程名稱來找到課程
  getCourseByName(name) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/findByName/" + name, {
      // JWT
      headers: {
        Authorization: token,
      },
    });
  }
  // 學生註冊課程
  enroll(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        // JWT
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new CourseService();
