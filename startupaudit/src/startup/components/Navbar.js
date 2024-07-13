import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { FaBars, FaTimes } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import logo from "../images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogoutClick = () => {
    const userConfirmed = window.confirm("Are you sure you want to logout?");
    if (userConfirmed) {
      alert("Logged out");
      // Perform logout logic here
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#ff3131" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <img src={logo} width="150px" height="auto" />
            </Link>

            <div className="account-icon" onClick={handleLogoutClick}>
              <VscAccount size={24} />
            </div>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
