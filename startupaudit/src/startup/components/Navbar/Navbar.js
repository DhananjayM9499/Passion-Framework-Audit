// import { Link, useNavigate } from "react-router-dom";
// import { IconContext } from "react-icons";
// import { VscAccount } from "react-icons/vsc";
// import logo from "../images/logo.png";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Navbar.css";
// import { toast } from "react-toastify";
// import { SidebarData } from "./SidebarData";

// function Navbar() {
//   const navigate = useNavigate();

//   const handleLogoutClick = () => {
//     const userConfirmed = window.confirm("Are you sure you want to logout?");
//     if (userConfirmed) {
//       // Clear token from local storage
//       localStorage.removeItem("token");

//       // Optionally, show a toast notification for logout success
//       toast.success("Logged out successfully");

//       // Navigate to the login page
//       navigate("/login");
//     }
//   };

//   return (
//     <>
//       <IconContext.Provider value={{ color: "#ff3131" }}>
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//           <div className="container">
//             <Link to="/home" className="navbar-brand">
//               <img src={logo} width="150px" height="auto" alt="" />
//             </Link>

//             <div className="account-icon" onClick={handleLogoutClick}>
//               <VscAccount size={24} />
//             </div>
//           </div>

//           <div className="sidebar">
//             <nav className="nav-menu active">
//               <ul className="nav-menu-items">
//                 {SidebarData.map(({ cName, path, icon, title }, index) => (
//                   <li key={index} className={cName}>
//                     <Link to={path}>
//                       {icon}
//                       <span>{title}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           </div>
//         </nav>
//       </IconContext.Provider>
//     </>
//   );
// }

// export default Navbar;
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { IconContext } from "react-icons";
// import { VscAccount } from "react-icons/vsc";
// import { jwtDecode } from "jwt-decode"; // Import jwt-decode
// import logo from "../images/logo.png";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Navbar.css";
// import { toast } from "react-toastify";
// import { SidebarData } from "./SidebarData";

// function Navbar() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     // Retrieve the token from local storage
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token); // Decode the token
//         setEmail(decodedToken.email); // Set the email from the token
//       } catch (error) {
//         console.error("Invalid token:", error);
//       }
//     }
//   }, []);
//   console.log(email);
//   const handleLogoutClick = () => {
//     const userConfirmed = window.confirm("Are you sure you want to logout?");
//     if (userConfirmed) {
//       // Clear token from local storage
//       localStorage.removeItem("token");

//       // Optionally, show a toast notification for logout success
//       toast.success("Logged out successfully");

//       // Navigate to the login page
//       navigate("/login");
//     }
//   };

//   return (
//     <>
//       <IconContext.Provider value={{ color: "#ff3131" }}>
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//           <div className="container">
//             <Link to="/home" className="navbar-brand">
//               <img src={logo} width="150px" height="auto" alt="" />
//             </Link>

//             <div className="account-section">
//               <span className="email-text">{email}</span>
//               <div className="account-icon" onClick={handleLogoutClick}>
//                 <VscAccount size={24} />
//               </div>
//             </div>
//           </div>

//           <div className="sidebar">
//             <nav className="nav-menu active">
//               <ul className="nav-menu-items">
//                 {SidebarData.map(({ cName, path, icon, title }, index) => (
//                   <li key={index} className={cName}>
//                     <Link to={path}>
//                       {icon}
//                       <span>{title}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           </div>
//         </nav>
//       </IconContext.Provider>
//     </>
//   );
// }

// export default Navbar;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { VscAccount } from "react-icons/vsc";
import { jwtDecode } from "jwt-decode"; // Corrected import
import logo from "../images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { toast } from "react-toastify";
import { SidebarData } from "./SidebarData";
import { FaBars } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleLogoutClick = () => {
    const userConfirmed = window.confirm("Are you sure you want to logout?");
    if (userConfirmed) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <>
      <IconContext.Provider value={{ color: "#ff3131" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link to="/home" className="navbar-brand">
              <img src={logo} width="150px" height="auto" alt="logo" />
            </Link>

            <div className="account-section" onClick={handleLogoutClick}>
              <IconContext.Provider value={{ size: 24, color: "#ff3131" }}>
                <VscAccount />
              </IconContext.Provider>
              <span className="email-text">{email}</span>
              <div className="account-icon" onClick={handleLogoutClick}></div>
            </div>

            <div className="menu-icon" onClick={toggleSidebar}>
              <FaBars />
            </div>
          </div>
        </nav>
        <div className={sidebar ? "nav-menu active" : "nav-menu"}>
          <nav className="nav-menu-items">
            <ul>
              {SidebarData.map(({ cName, path, icon, title }, index) => (
                <li key={index} className={cName}>
                  <Link to={path} onClick={() => setSidebar(false)}>
                    {icon}
                    <span>{title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
