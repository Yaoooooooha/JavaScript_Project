import React from "react";

const Picture = ({ data }) => {
  return (
    <div className="picture">
      <p>拍攝者：{data.photographer}</p>
      <div className="imageContainer">
        <img src={data.src.large} alt="" />
      </div>
      <p>
        <a target="_blank" href={data.src.large}>
          下載圖片
        </a>
        {/*設定 target="_blank" 可以用新視窗開啟連結 */}
      </p>
    </div>
  );
};

export default Picture;
