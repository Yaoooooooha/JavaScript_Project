import { Outlet, Link } from "react-router-dom";
import React from "react";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <div>
      <div className="nav-squre">
        <header>
          <h1>圖片搜尋網</h1>
        </header>
        <nav>
          <ul>
            <li>
              <Link to="/">首頁</Link>
            </li>
            <li>
              <Link to="/about">關於這個網站</Link>
            </li>
          </ul>
        </nav>
      </div>

      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
