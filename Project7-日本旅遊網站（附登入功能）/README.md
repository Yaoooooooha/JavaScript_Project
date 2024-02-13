# 日本旅遊網站（附登入功能）

是 Project2 日本旅遊網站的進階版，實作出用戶登錄功能。
使用者除了可以在網站上看到最新的日本旅遊資訊之外，還可以再登入之後，撰寫自己的旅遊日記。

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Project Goals](#project-goals)
  - [Skills Learned](#skills-learned)
- [Refferences](#refferences)

## Getting Started

### Prerequisites

```bash
# Clone the repository
git clone https://github.com/Yaoooooooha/JavaScript_Project/Project7-日本旅遊網（附登入功能）.git

# Navigate to the project directory
cd Project7-日本旅遊網（附登入功能）

# Install dependencies
npm install express mongoose ejs method-override # MVC Web Design
npm install express-session dotenv # session
npm install bcrypt connect-flash # local login / signup
npm install passport passport-google-oauth20 passport-local # passport for google OAuth / lacal

# launch
node index.js
```

### Project Goals

- 熟悉 HTML / SCSS / JavaScript 語法
- 熟悉 Express.js 以及 Mongoose 語法
- 練習前後端串接
- 實作登入 / 註冊系統
- 確實實踐 RWD

### Skills Learned

- 彈出式導覽列
- EJS 實作
  - 拆分重複性部件，再 includes 到每個頁面
  - 依照登入與否顯示不同的導覽列
  - 用傳入的參數製作頁面元素
- OAuth / 本地登入實作
  - 用 passport 套件實現 Google 的 OAuth 登入以及本地登入
- RESTful Routing / Express.js 實作
  - 處理 GET Request，渲染不同的頁面
  - 處理 POST Request，接收用戶傳入的表單資料
  - 處裡 DELETE Request，刪除用戶所選取的資料
- Mongoose 實作
  - 設計 Schema 以及限制，並將其跟 Model 連接
  - 依照 Schema 製作新的 Documents
  - 儲存 / 查詢 / 刪除 Documents
- 在前端表單中傳送隱藏資料給後端處理

## Refferences

- 圖片來源 [Unsplash](https://unsplash.com/)
- icon 來源 [Font Awesome](https://fontawesome.com/icons)
