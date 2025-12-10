import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  const handleClick = (path) => {
    setActiveMenu(path);
  };

  return (
    <div className="main-sidebar">
      <aside id="sidebar-wrapper">
        <div
          className="sidebar-brand"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            textAlign: "center",
            marginTop: "20px",
            height: "100%",
          }}
        >
          <Link
            to="/dashboard"
            onClick={() => handleClick("/dashboard")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            {/* <img
              src="../assets/img/avatar/avatar-1.png"
              alt="Stisla"
              style={{
                height: "80px",
                width: "auto",
                borderRadius: "50%",
                marginBottom: "2px",
              }}
            /> */}
            <span style={{ color: "black", fontSize: "16px" }}>Stisla</span>
          </Link>
        </div>

        <ul className="sidebar-menu">
          <li
            className={`nav-item ${
              activeMenu === "/dashboard" ? "active" : ""
            }`}
          >
            <Link to="/" onClick={() => handleClick("/dashboard")}>
              <i className="fas fa-fire"></i>
              <span>General Dashboard</span>
            </Link>
          </li>
          <li
            className={`nav-item ${activeMenu === "/userlist" ? "active" : ""}`}
          >
            <Link to="/userlist" onClick={() => handleClick("/userlist")}>
              <i className="fas fa-users"></i>
              <span>Users</span>
            </Link>
          </li>
            
   

        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
