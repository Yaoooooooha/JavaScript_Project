import React from "react";
import { TimelineMax, Power2 } from "gsap";

function HomePage() {
  const screenWidth = window.screen.width; // 螢幕寬度
  const screenHeight = window.screen.height; // 螢幕高度
  let xPx = 0; // 水平滑動 px
  let yPx = 0; // 垂直滑動 px
  let xPrecentage = xPx / screenWidth; // 水平滑動 %
  let yPrecentage = yPx / screenHeight; // 垂直滑動 %
  let cardIsExtended = false;

  const wheelHandler = (e) => {
    // 如果卡片是展開的狀態，先合起來
    if (cardIsExtended) {
      closeCard();
    }

    // 累積滑動 px
    xPx += e.deltaX;
    yPx += e.deltaY;
    // 避免出現小於零的情況
    if (xPx < 0) {
      xPx = 0;
    }
    if (yPx < 0) {
      yPx = 0;
    }
    // 滑動速度
    let _wheelSpeed = 1;
    // 累積滑動 %
    xPrecentage = (xPx / screenWidth) * _wheelSpeed;
    yPrecentage = (yPx / screenHeight) * _wheelSpeed;

    // 讓 cover-page 抬升
    let coverPage = document.querySelector(".cover-page");
    coverPage.style.bottom = `${yPrecentage * 200}%`;

    // 讓所有的 timelineItems 依序放大
    let _timelineItems = document.querySelectorAll(".timeline-items");
    for (let i = 0; i < _timelineItems.length; i++) {
      // 滑到最後一張照片就不再滑動
      if (yPrecentage <= _timelineItems.length) {
        // 放大到正常大小跟透明度
        if (yPrecentage < i + 1 && yPrecentage >= i) {
          // 調整大小
          _timelineItems[i].style.transform = `scale(${yPrecentage - i})`;
          // 調整透明度
          _timelineItems[i].style.opacity = yPrecentage - i;
        }

        // 放大到 1 倍之後，再放大就開始淡出跟快速放大
        let _disSpeed = 7; // 淡出跟快速放大的速度
        if (yPrecentage >= i + 1 && yPrecentage <= i + 2) {
          // 調整透明度，成指數成長
          _timelineItems[i].style.opacity = Math.pow(
            i + 2 - yPrecentage,
            _disSpeed
          );
          // 調整大小，成指數成長
          _timelineItems[i].style.transform = `scale(${Math.pow(
            yPrecentage - i,
            _disSpeed
          )})`;
        }

        // 避免滑動太快沒有偵測到變化，在超過滑動的數值後，就直接設為最小
        if (yPrecentage <= i) {
          // 調整大小
          _timelineItems[i].style.transform = `scale(0)`;
          // 調整透明度
          _timelineItems[i].style.opacity = 0;
        }

        // 讓使用者在照片放大到 0.4 倍後可以點到圖片
        if (yPrecentage >= i + 0.4) {
          _timelineItems[
            i
          ].children[0].children[0].children[0].style.pointerEvents = "auto";
          _timelineItems[i].children[0].children[0].children[0].style.cursor =
            "pointer";
        }

        // 讓使用者在照片縮小到 0.4 倍以下後點不到照片
        // 讓使用者在照片放大到 1.2 倍後點不到圖片
        if (yPrecentage <= i + 0.4 || yPrecentage >= i + 1.2) {
          _timelineItems[
            i
          ].children[0].children[0].children[0].style.pointerEvents = "none";
          _timelineItems[i].children[0].children[0].children[0].style.cursor =
            "auto";
        }
      } else {
        console.log(e.deltaY, yPrecentage);
        // 不再累計 xPx 跟 yPx
        // 因為是放在 for 回圈裡，所以要除以 _timelineItems.length
        xPx -= e.deltaX / _timelineItems.length;
        yPx -= e.deltaY / _timelineItems.length;
        console.log(e.deltaY, yPrecentage);
      }
    }
  };

  const clickHandler = (e) => {
    cardIsExtended = true;
    // 隱藏 card-title
    let cardTitles = document.querySelectorAll("h3.card-title");
    cardTitles.forEach((cardTitle) => {
      cardTitle.style.opacity = 0;
    });
    // 設定成無法點到照片
    e.target.style.pointerEvents = "none";
    e.target.style.cursor = "auto";

    /* 把照片設定到正常大小 */
    let _timelineItems = document.querySelectorAll(".timeline-items");
    for (let i = 0; i < _timelineItems.length; i++) {
      // 挑出當前的照片所在的 timelineItem
      if (yPrecentage >= i + 0.4 && yPrecentage <= i + 1.4) {
        const time_line = new TimelineMax();
        // 調整 timelineItem 的大小跟透明度
        time_line.fromTo(
          _timelineItems[i],
          1,
          {
            opacity: "100%",
            // 取得當前的 scale
            scale:
              yPrecentage - i < 1
                ? `${yPrecentage - i}`
                : `${Math.pow(yPrecentage - i, 7)}}`,
          },
          { opacity: "1", scale: "1", ease: Power2.easeInOut }
        );
      }
    }

    /* 卡片動畫 */
    let cardContent = e.target.nextSibling;
    // 新增一個 time_line 物件
    const time_line = new TimelineMax();
    // .fromTo(控制的對象, duration, 原始狀態, 動畫結束後的狀態, 提前幾秒開始)
    time_line
      .fromTo(
        cardContent,
        0.3,
        { height: "0" },
        { height: "70vh", ease: Power2.easeInOut }
      )
      .fromTo(
        cardContent,
        1,
        { width: "0" },
        { width: "50vw", ease: Power2.easeInOut }
      );
  };

  // 收起卡片
  const closeCard = () => {
    cardIsExtended = false;

    /* 把照片設定到正常大小 */
    let _timelineItems = document.querySelectorAll(".timeline-items");
    for (let i = 0; i < _timelineItems.length; i++) {
      // 挑出當前的照片所在的 timelineItem
      if (yPrecentage >= i + 0.4 && yPrecentage <= i + 1.4) {
        const time_line = new TimelineMax();
        // 調整 timelineItem 的大小跟透明度
        time_line.fromTo(
          _timelineItems[i],
          0.15,
          {
            opacity: "1",

            scale: "1",
          },
          // 調整回原先的大小跟透明度
          {
            opacity:
              yPrecentage - i < 1
                ? `${yPrecentage - i}`
                : `${Math.pow(i + 2 - yPrecentage, 7)}`,
            scale:
              yPrecentage - i < 1
                ? `${yPrecentage - i}`
                : `${Math.pow(yPrecentage - i, 7)}}`,
            ease: Power2.easeInOut,
          }
        );
      }
    }

    /* 卡片動畫 */
    let cardContents = document.querySelectorAll(".card-content");
    cardContents.forEach((cardContent) => {
      // 新增一個 time_line 物件
      const time_line = new TimelineMax();
      // .fromTo(控制的對象, duration, 原始狀態, 動畫結束後的狀態, 提前幾秒開始)
      time_line
        .fromTo(
          cardContent,
          1,
          { width: "50vw" },
          { width: "0", ease: Power2.easeInOut }
        )
        .fromTo(
          cardContent,
          0.1,
          { height: "70vh" },
          { height: "0", ease: Power2.easeInOut }
        );
    });

    // 顯示 card-title
    let cardTitles = document.querySelectorAll("h3.card-title");
    // 先等卡片收完再顯示
    setTimeout(() => {
      cardTitles.forEach((cardTitle) => {
        cardTitle.style.opacity = 1;
      });
    }, 1000);
  };

  const photos = [
    "assets/1.png",
    "assets/2.png",
    "assets/3.png",
    "assets/4.png",
    "assets/5.png",
    "assets/6.png",
    "assets/7.png",
    "assets/8.png",
    "assets/9.png",
    "assets/10.png",
  ];

  // 將所有 timelineObject 放進 arr 中，供前端顯示適用
  let timelineObjectsArr = [];
  for (let i in photos) {
    let _photo = photos[i];
    timelineObjectsArr.push({
      id: i,
      photo: _photo,
      title: "標題",
      content: "卡片內容",
    });
  }

  return (
    <div>
      <section className="tunnel-container" onWheel={wheelHandler}>
        <div className="cover-page">
          <h2>
            Happy Birthday !!
            <br />
            💗 Rene Beauty Babe 💗
          </h2>
          <p>^ Scroll to see more ^</p>
        </div>
        {/* Your timeline items here */}
        {timelineObjectsArr.map((timelineObj) => {
          return (
            <div className="timeline-items">
              <div className="container">
                <div className="card" onClick={clickHandler}>
                  <img src={timelineObj.photo} alt="img" />
                  <div className="card-content">
                    <h2 className="card-title">{timelineObj.title}</h2>
                    <p>{timelineObj.content}</p>
                  </div>
                </div>
                <h3 className="card-title">{timelineObj.title}</h3>
              </div>
            </div>
          );
        })}
        {/* Add more items as needed */}
        <div className="line"></div>
      </section>
    </div>
  );
}

export default HomePage;
