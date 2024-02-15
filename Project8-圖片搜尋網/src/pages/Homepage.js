import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "../components/Search";
import Picture from "../components/Picture";

const Homepage = () => {
  let [input, setInput] = useState(""); // 儲存用戶輸入的 State
  let [data, setData] = useState(null); // 儲存搜尋結果的 State
  let [page, setPage] = useState(1); // 儲存圖片顯示頁數的 State
  let [currentSearch, setCurrentSearch] = useState(""); // 儲存用戶搜尋關鍵字的 State
  const auth = process.env.REACT_APP_PEXELS_API_KEY; // PEXELS 的 API 金鑰（要以 REACT_APP_ 作為開頭，不然會出現錯誤）
  const initialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15"; // 初始頁面
  let searchURL = `https://api.pexels.com/v1/search?query=${input}&per_page=15&page=1`; // 依照不同的 input 調整 GET Request

  // 搜尋功能
  const search = async (url) => {
    // 沒有輸入任何關鍵字時，顯示初始頁面
    if (input == "") {
      url = initialURL;
    }
    // 向 Pexels 發出 GET Request
    let result = await axios.get(url, {
      headers: { Authorization: auth }, // 在 header 中的 Authorization 屬性中傳送 API 金鑰
    });
    // 儲存搜尋到的圖片資料，並渲染改變的 Components
    setData(result.data.photos);
    setCurrentSearch(input);
  };

  // 顯示更多圖片
  const morePicture = async () => {
    let newURL;
    // 用戶沒有搜尋
    if (currentSearch === "") {
      newURL = `https://api.pexels.com/v1/curated?page=${page + 1}&per_page=15`;
      // 用戶有搜尋
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${
        page + 1
      }`;
    }
    // 調整顯示頁數的 State
    setPage(page + 1);
    // 向 Pexels 發出 GET Request
    let result = await axios.get(newURL, {
      headers: { Authorization: auth },
    });
    // 把搜尋到的圖片資料跟先前的圖片資料連再一起，並渲染改變的 Components
    setData(data.concat(result.data.photos));
  };

  // 在頁面第一次 render 時執行
  useEffect(() => {
    search(initialURL);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        // 傳遞 search function 給 Search Components
        // 用 arrow expression 的方式傳遞，可以傳遞參數
        search={() => {
          search(searchURL);
        }}
        // 傳遞 setInput function 給 Search Components
        setInput={setInput}
      />
      {/* 展示搜尋到的圖片 */}
      <div className="pictures">
        {data && // data 值為 null 時就不執行 && 右邊的程式（因為在 JSX 中，不能直接使用 if statement）
          // 用每個搜尋到的照片的資料，製作多個 Picture Components
          data.map((d) => {
            return <Picture data={d} />;
          })}
      </div>
      <div className="morePicture">
        <button onClick={morePicture}>更多圖片</button>
      </div>
    </div>
  );
};

export default Homepage;
