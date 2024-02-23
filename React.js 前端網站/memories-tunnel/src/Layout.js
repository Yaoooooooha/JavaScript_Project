import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="nav-squre">
      <nav>
        <ul>
          <li>
            {/* a tag 改成 Link，href 改成 to */}
            <Link to="/">照片回憶</Link>
          </li>
          <li>
            <Link to="/card">卡片回憶</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
