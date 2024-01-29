/*====================
網站設定
====================*/

/*-----------
function
-----------*/
// 讀取最高分
function loadHighestScore() {
  // 還沒有任何最高分的紀錄
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

// 設定最高分
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

// 暫停遊戲
function togglePause() {
  alert("Pause Game");
}

/*-----------
code
-----------*/
// 創建遊戲區塊
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d"); // 回傳一個 canvas 的 drawing context，可以用來在 canvas 內畫圖
let unit = 20; // 每一格的大小
let row = canvas.height / unit; // 16格
let column = canvas.width / unit; // 16格

let highestScore;
loadHighestScore();
let score = 0;
// 顯示內容
document.getElementById("score").innerHTML = "Score: " + score;
document.getElementById("bestScore").innerHTML =
  "Highest Score: " + highestScore;

// 設定暫停功能
// 點暫停按鈕可暫停
window.addEventListener("click", (e) => {
  if (e.target.id == "pause") {
    togglePause();
  }
});
// 點空白鍵可暫停
window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    togglePause();
  }
});

/*====================
遊戲設定
====================*/

/*-----------
function
-----------*/
// 建立蛇：在 snake array 中儲存每個身體所在的 x, y 座標值
function createSnake() {
  let _headX = 80;
  let _headY = 20;
  // 頭座標
  snake[0] = {
    x: _headX,
    y: _headY,
  };
  // 身體座標
  snake[1] = {
    x: _headX - unit,
    y: _headY,
  };
  // 身體座標
  snake[2] = {
    x: _headX - unit * 2,
    y: _headY,
  };
  // 身體座標
  snake[3] = {
    x: _headX - unit * 3,
    y: _headY,
  };
}

// 每隔 x 秒讓蛇移動一格
function move() {
  // 每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return; // 避免執行剩餘的 code
    }
  }

  // 將 canvas 重置為初始值，清除之前蛇的顏色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // 重新畫上果實，因為位置被清掉了
  myFruit.drawFruit();

  // 畫蛇
  for (let i = 0; i < snake.length; i++) {
    // 蛇超出邊界的設定
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // 設定蛇的顏色
    if (i == 0) {
      ctx.fillStyle = "pink"; // 頭的顏色
    } else {
      ctx.fillStyle = "gray"; // 身體的顏色
    }
    ctx.strokeStyle = "white"; // 外誆的顏色
    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // 畫身體
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // 畫外誆
  }

  // 以 dierction 變數方向，決定蛇要往哪移動
  let _snakeX = snake[0].x; // 蛇頭當前的 x 座標
  let _snakeY = snake[0].y; // 蛇頭當前的 y 座標
  if (dierction == "Left") {
    _snakeX -= unit;
  } else if (dierction == "Up") {
    _snakeY -= unit;
  } else if (dierction == "Right") {
    _snakeX += unit;
  } else if (dierction == "Down") {
    _snakeY += unit;
  }
  // 更新蛇頭的位置
  let _newHead = {
    x: _snakeX,
    y: _snakeY,
  };
  snake.unshift(_newHead);

  // 確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.createFruit(); // 生成新果實
    score++;
    setHighestScore(score); // 確認是否要更新最高分數
    // 更新顯示內容
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("bestScore").innerHTML =
      "Highest Score: " + highestScore;
  } else {
    // 沒吃到果實的話，就要在蛇移動時刪掉最後一節身體，避免蛇無限增長
    snake.pop();
  }

  // 避免重複添加 Event Listener
  window.removeEventListener("keydown", changeDirection);
  // 重新添加 Event Listener，因為在 changeDirection() 函數中為了避免錯誤已經刪除了
  window.addEventListener("keydown", changeDirection);
}

// 確認不會發生 180 度轉向的事情
function changeDirection(e) {
  if (e.key == "ArrowRight" && dierction != "Left") {
    dierction = "Right";
  } else if (e.key == "ArrowDown" && dierction != "Up") {
    dierction = "Down";
  } else if (e.key == "ArrowLeft" && dierction != "Right") {
    dierction = "Left";
  } else if (e.key == "ArrowUp" && dierction != "Down") {
    dierction = "Up";
  }

  // 每次按下上下左右鍵之後，在下一幀被畫出來之前，不接受任何 keydown 事件
  // 防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

/*-----------
class
-----------*/
// 設定果實的 class
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit; // 果實的 x 座標
    this.y = Math.floor(Math.random() * row) * unit; // 果實的 y 座標
  }

  // 畫果實
  drawFruit() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  // 生成新果實
  createFruit() {
    let _overlapping = false;
    let _newX;
    let _newY;

    // 確認果實是否與蛇重疊
    function checkOverlap(_newX, _newY) {
      for (let i = 0; i < snake.length; i++) {
        if (_newX == snake[i].x && _newY == snake[i].y) {
          _overlapping = true;
          return;
        } else {
          _overlapping = false;
        }
      }
    }

    // 生成新果實
    do {
      _newX = Math.floor(Math.random() * column) * unit;
      _newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(_newX, _newY);
    } while (_overlapping);

    this.x = _newX;
    this.y = _newY;
    this.drawFruit();
  }
}

/*-----------
code
-----------*/
let snake = []; // 紀錄蛇座標的 array
let myGame = setInterval(move, 50); // 每隔 0.05 讓蛇前移動一格

// 初始設定
createSnake(); // 創建蛇
let myFruit = new Fruit(); // 創建果實
window.addEventListener("keydown", changeDirection); // 監聽使用者的操控
let dierction = "Right"; // 初始先設定成向右移動
