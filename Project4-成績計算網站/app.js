/*====================
開頭動畫
====================*/
let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");
let animation = document.querySelector("section.animation-wrapper");

// 新增一個 time_line 物件
const time_line = new TimelineMax();

// .fromTo(控制的對象, duration, 原始狀態, 動畫結束後的狀態, 提前幾秒開始)
time_line
  .fromTo(hero, 1, { height: "0%" }, { height: "100%", ease: Power2.easeInOut })
  .fromTo(
    hero,
    1.2,
    { width: "80%" },
    { width: "100%", ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1,
    { x: "-100%" },
    { x: "0%", ease: Power2.easeInOut },
    "-=1.2"
  )
  .fromTo(animation, 0.3, { opacity: 1 }, { opacity: 0 });

// 動畫跑完之後，讓滑鼠點不到動畫個 tag
setTimeout(() => {
  animation.style.pointerEvents = "none";
}, 2500);

/*====================
網站內容
====================*/

/*-----------
function
-----------*/
// 避免在點選表單內的按鈕後重整網站
function setBtn() {
  let _allBtns = document.querySelectorAll("button");
  _allBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}

// 更新靜態的 NodeList
function reloadQuery(_var, _object) {
  _var = document.querySelectorAll(_object);
  return _var;
}

// 製作學分跟成績的對照陣列
function creditGradeArrCreator(_allCreditInputs, _allGradeSelects) {
  _allCreditInputs = reloadQuery(_allCreditInputs, "input.class-credit");
  _allGradeSelects = reloadQuery(_allGradeSelects, "select");
  let _pointArr = [];
  let _creditGradeArr = [];
  for (let i = 0; i < _allGradeSelects.length; i++) {
    let _grade = _allGradeSelects[i].value;
    // 帶成績對照到的 gpa 分數(也可以用 Switch Case 來寫)
    if (_grade === "A") {
      _pointArr.push(4);
    } else if (_grade === "A-") {
      _pointArr.push(3.66);
    } else if (_grade === "B+") {
      _pointArr.push(3.33);
    } else if (_grade === "B") {
      _pointArr.push(3);
    } else if (_grade === "B-") {
      _pointArr.push(2.66);
    } else if (_grade === "C+") {
      _pointArr.push(2.33);
    } else if (_grade === "C") {
      _pointArr.push(2);
    } else if (_grade === "C-") {
      _pointArr.push(1.66);
    } else if (_grade === "D+") {
      _pointArr.push(1.33);
    } else if (_grade === "D") {
      _pointArr.push(1);
    } else if (_grade === "F") {
      _pointArr.push(0);
    } else {
      _pointArr.push(-1);
    }
  }
  for (let i = 0; i < _allCreditInputs.length; i++) {
    _creditGradeArr.push([Number(_allCreditInputs[i].value), _pointArr[i]]);
  }
  return _creditGradeArr;
}

// gpa 計算器
function gpaCalculator(_allCreditInputs, _allGradeSelects) {
  // 刷新陣列
  let _creditGradeArr = creditGradeArrCreator(
    _allCreditInputs,
    _allGradeSelects
  );
  // 計算 GPA
  let _gpa = 0.0;
  let _totalCredit = 0;
  for (let i = 0; i < _creditGradeArr.length; i++) {
    let _credit = _creditGradeArr[i][0];
    let _grade = _creditGradeArr[i][1];
    if (_credit != 0 && _grade != -1) {
      // 計算 gpa
      _gpa += _credit * _grade;
      _totalCredit += _credit;
    }
  }
  _gpa /= _totalCredit;
  changeGpaDisplay(_gpa);
}

// 改變頁面顯示的 _gpa
function changeGpaDisplay(_gpa) {
  let _gpaDisplay = document.querySelector("h2.result-gpa");
  if (isNaN(_gpa)) {
    _gpa = 0;
  } else {
    _gpa = Math.round(_gpa * 100) / 100; // 顯示到小數點後第二位（也可以用 _gpa.toFixed(2);）
  }
  _gpaDisplay.textContent = _gpa;
}

// 重新排列網站中 form 順序的函數，有 "new" 跟 "sorting" 兩種模式
function resetOrder(_sortArr, _mode) {
  let _childernForm = allInputs.children;
  let _repeatTimes = _sortArr.length;
  let _storeSetting = [];

  // 在 sorting 模式下，按照 _sortArr 裡面的順序排序對應的 form tag
  if (_mode == "sorting") {
    // 先將 gpa 分數兌換成等第(也可以用 Switch Case 來寫)
    for (let i = 0; i < _repeatTimes; i++) {
      let _grade = _sortArr[i][1];
      if (_grade === 4) {
        _sortArr[i][1] = "A";
      } else if (_grade === 3.66) {
        _sortArr[i][1] = "A-";
      } else if (_grade === 3.33) {
        _sortArr[i][1] = "B+";
      } else if (_grade === 3) {
        _sortArr[i][1] = "B";
      } else if (_grade === 2.66) {
        _sortArr[i][1] = "B-";
      } else if (_grade === 2.33) {
        _sortArr[i][1] = "C+";
      } else if (_grade === 2) {
        _sortArr[i][1] = "C";
      } else if (_grade === 1.66) {
        _sortArr[i][1] = "C-";
      } else if (_grade === 1.33) {
        _sortArr[i][1] = "D+";
      } else if (_grade === 1) {
        _sortArr[i][1] = "D";
      } else if (_grade === 0) {
        _sortArr[i][1] = "F";
      } else if (_grade === -1) {
        _sortArr[i][1] = "";
      }
    }
    //  在將 _sortArr 裡面的順序排序對應的 form tag
    for (let i = 0; i < _repeatTimes; i++) {
      for (let j = i; j < _childernForm.length; j++) {
        if (
          _sortArr[i][0] == _childernForm[j].children[0].children[2].value &&
          _sortArr[i][1] == _childernForm[j].children[0].children[3].value
        ) {
          // 調整 form 的順序
          allInputs.insertBefore(_childernForm[j], _childernForm[i]);
          // 加入動畫
          _childernForm[i].style.animation = "scaleUp 0.5s ease forwards";
          break;
        }
      }
    }
  }
  if (_mode == "new") {
    // 把畫面上的 form 刪掉，避免重複添加 event listener
    for (let i = 0; i < _repeatTimes; i++) {
      _storeSetting.push([
        _childernForm[0],
        _childernForm[0].children[0].children[3].value,
      ]);
      _childernForm[0].remove();
    }
    // 新增 form
    for (let i = 0; i < _repeatTimes + 1; i++) {
      if (i != _repeatTimes) {
        // 把被刪掉的 form 補回來
        let _newForm = _storeSetting[i][0].cloneNode(true);
        _newForm.style.animation = "unset"; // 去除動畫
        allInputs.appendChild(_newForm);
        _newForm.children[0].children[3].value = _storeSetting[i][1];
      } else {
        // 用複製的方法新增一行 form
        let _newForm = oldForm.cloneNode(true);
        _newForm.reset(); // 刪掉原本填好的值
        allInputs.appendChild(_newForm);
        _newForm.children[0].children[3].style.backgroundColor = "grey"; // 避免 grade 那欄複製到不同的顏色
        _newForm.style.animation = "scaleUp 0.5s ease forwards"; // 添加動畫
      }
    }
    setBtn(); // 避免在點選表單內的按鈕後重整網站
    main(); // 重新設定新表單的規則
  }
}

// 升序排序函數
function sortingAsc() {
  let _allCreditInputs, _allGradeSelects;
  // 取得 credit 跟 grade 的對照表
  let _creditGradeArr = creditGradeArrCreator(
    _allCreditInputs,
    _allGradeSelects
  );
  // 排序
  for (let i = 0; i < _creditGradeArr.length; i++) {
    let _highestGrade = _creditGradeArr[i][1];
    let _highestCredit = _creditGradeArr[i][0];
    let _targetIndex = i;
    for (let j = i + 1; j < _creditGradeArr.length; j++) {
      let _compareGrade = _creditGradeArr[j][1];
      let _compareCredit = _creditGradeArr[j][0];
      if (_highestGrade < _compareGrade) {
        _targetIndex = j;
        _highestGrade = _compareGrade;
      } else if (
        _highestGrade == _compareGrade &&
        _highestCredit < _compareCredit
      ) {
        _targetIndex = j;
        _highestCredit = _compareCredit;
      }
    }
    let _temp = _creditGradeArr[i];
    _creditGradeArr[i] = _creditGradeArr[_targetIndex];
    _creditGradeArr[_targetIndex] = _temp;
  }
  // 排除掉沒設定 grade 的 form
  let _finalCreditGradeArr = [];
  for (let i = 0; i < _creditGradeArr.length; i++) {
    if (_creditGradeArr[i][1] == -1) {
      continue;
    }
    _finalCreditGradeArr.push(_creditGradeArr[i]);
  }
  return _finalCreditGradeArr;
}

/*-----------
code
-----------*/
// 避免點按 Enter 後會送出資料並清空表格
addEventListener("keypress", (e) => {
  if (e.key == "enter") {
    e.preventDefault();
  }
});

// 避免在點選表單內的按鈕後重整網站
setBtn();

// 主要的設定
function main() {
  // 在不同的 grade 選擇設定不同的顏色
  let _allGradeSelects = document.querySelectorAll("select");
  _allGradeSelects.forEach((_select) => {
    _select.addEventListener("change", (e) => {
      let _grade = e.target.value;
      if (_grade[0] === "D" || _grade[0] === "F") {
        _select.style.backgroundColor = "red";
      } else if (_grade === "C") {
        _select.style.backgroundColor = "orange";
      } else if (_grade === "") {
        _select.style.backgroundColor = "grey";
      } else {
        _select.style.backgroundColor = "green";
      }
      // gpa 試算
      gpaCalculator(_allCreditInputs, _allGradeSelects);
    });
  });

  // 設定處理 credit 欄位的變化
  let _allCreditInputs = document.querySelectorAll("input.class-credit");
  _allCreditInputs.forEach((_grade) => {
    _grade.addEventListener("input", (e) => {
      // 避免學分數超出設定的範圍
      let _credit = e.target.value;
      if (_credit > 6) {
        _grade.value = 6;
        alert("Credit's maximum is 6.");
      } else if (_credit < 0) {
        _grade.value = 0;
        alert("Credit's minimum is 0.");
      } // 避免出現奇怪的輸（e、- 等等）
      else if (_credit == "") {
        _grade.value = 0;
      }
      // gpa 試算
      gpaCalculator(_allCreditInputs, _allGradeSelects);
    });
  });

  // 垃圾桶按鈕
  let _allDelBtns = document.querySelectorAll("button.trash-button");
  _allDelBtns.forEach((_delBtn) => {
    _delBtn.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.style.animation =
        "scaleDown 0.5s ease backwards"; // 添加動畫
      setTimeout(() => {
        e.target.parentElement.parentElement.remove();
      }, 450);
    });
  });
}

main();

// 加號按鈕
let addBtn = document.querySelector("button.plus-btn");
let allInputs = document.querySelector("div.all-inputs");
let oldForm = document.querySelector("form");
addBtn.addEventListener("click", (_allForm) => {
  resetOrder(reloadQuery(_allForm, "form"), "new");
});

// 升序按鈕
let ascendingBtn = document.querySelector("button.sort-ascending");
// 點按後排序
ascendingBtn.addEventListener("click", () => {
  let _creditGradeArrAsc = sortingAsc();
  resetOrder(_creditGradeArrAsc, "sorting");
});

// 降序按鈕
let descendingBtn = document.querySelector("button.sort-descending");
// 點按後排序
descendingBtn.addEventListener("click", () => {
  let _creditGradeArrAsc = sortingAsc();
  let _creditGradeArrDsc = [];
  // 把升序排序後的結果反過來
  for (let i = 0; i < _creditGradeArrAsc.length; i++) {
    _creditGradeArrDsc.push(
      _creditGradeArrAsc[_creditGradeArrAsc.length - i - 1]
    );
  }
  resetOrder(_creditGradeArrDsc, "sorting");
});

// 重置按鈕
let resetBtn = document.querySelector("button.reset-form");
// 點按後重置表單
resetBtn.addEventListener("click", () => {
  for (let i = 0; i < allInputs.children.length; i++) {
    allInputs.children[i].reset();
    allInputs.children[i].children[0].children[3].style.backgroundColor =
      "grey";
  }
});
