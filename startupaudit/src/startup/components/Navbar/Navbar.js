// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { IconContext } from "react-icons";
// import { VscAccount } from "react-icons/vsc";
// import { jwtDecode } from "jwt-decode";
// import logo from "../images/logo.png";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Navbar.css";
// import { toast } from "react-toastify";
// import { SidebarData } from "./SidebarData";
// import { FaBars, FaCaretDown } from "react-icons/fa";

// function Navbar() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [sidebar, setSidebar] = useState(false);
//   const [subNav, setSubNav] = useState({});

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setEmail(decodedToken.email);
//       } catch (error) {
//         console.error("Invalid token:", error);
//       }
//     }
//   }, []);

//   const handleLogoutClick = () => {
//     const userConfirmed = window.confirm("Are you sure you want to logout?");
//     if (userConfirmed) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user_id");
//       toast.success("Logged out successfully");
//       navigate("/login");
//     }
//   };

//   const toggleSidebar = () => {
//     setSidebar(!sidebar);
//   };

//   const showSubNav = (index) => {
//     setSubNav((prevSubNav) => ({
//       ...prevSubNav,
//       [index]: !prevSubNav[index],
//     }));
//   };

//   return (
//     <>
//       <IconContext.Provider value={{ color: "#ff3131" }}>
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//           <div className="container">
//             <Link to="/home" className="navbar-brand">
//               <img src={logo} width="150px" height="auto" alt="logo" />
//             </Link>

//             <div className="account-section" onClick={handleLogoutClick}>
//               <IconContext.Provider value={{ size: 24, color: "#ff3131" }}>
//                 <VscAccount />
//               </IconContext.Provider>
//               <span className="email-text ml-4 ">{email}</span>
//               <div className="account-icon" onClick={handleLogoutClick}></div>
//             </div>

//             <div className="menu-icon" onClick={toggleSidebar}>
//               <FaBars />
//             </div>
//           </div>
//         </nav>
//         <div className={sidebar ? "nav-menu active" : "nav-menu"}>
//           <nav className="nav-menu-items">
//             <ul>
//               {SidebarData.map((item, index) => (
//                 <li key={index} className={item.cName}>
//                   {item.subNav ? (
//                     <>
//                       <div onClick={() => showSubNav(index)}>
//                         {item.icon}
//                         <span>{item.title}</span>
//                         <FaCaretDown style={{ marginLeft: "auto" }} />
//                       </div>
//                       {subNav[index] &&
//                         item.subNav.map((subItem, subIndex) => (
//                           <li key={subIndex} className={subItem.cName}>
//                             <Link
//                               to={subItem.path}
//                               onClick={() => setSidebar(false)}
//                             >
//                               {subItem.title}
//                             </Link>
//                           </li>
//                         ))}
//                     </>
//                   ) : (
//                     <Link to={item.path} onClick={() => setSidebar(false)}>
//                       {item.icon}
//                       <span>{item.title}</span>
//                     </Link>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </IconContext.Provider>
//     </>
//   );
// }

// export default Navbar;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { VscAccount } from "react-icons/vsc";
import { jwtDecode } from "jwt-decode";
import logo from "../images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { toast } from "react-toastify";
import { SidebarData } from "./SidebarData";
import { FaBars, FaCaretDown } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [subNav, setSubNav] = useState({});

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
      localStorage.removeItem("user_id");
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  const showSubNav = (index) => {
    setSubNav((prevSubNav) => ({
      ...prevSubNav,
      [index]: !prevSubNav[index],
    }));
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
              <span className="email-text ml-4 ">{email}</span>
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
              {SidebarData.map((item, index) => (
                <li key={index} className={item.cName}>
                  {item.subNav ? (
                    <>
                      <div onClick={() => showSubNav(index)}>
                        {item.icon}
                        <span>{item.title}</span>
                        <FaCaretDown style={{ marginLeft: "auto" }} />
                      </div>
                      {subNav[index] &&
                        item.subNav.map((subItem, subIndex) => (
                          <li
                            key={subIndex}
                            className={`sub-nav-text ${
                              subNav[index] ? "open" : ""
                            }`}
                          >
                            <Link
                              to={subItem.path}
                              onClick={() => setSidebar(false)}
                            >
                              {subItem.icon}
                              <span> {subItem.title}</span>
                            </Link>
                          </li>
                        ))}
                    </>
                  ) : (
                    <Link to={item.path} onClick={() => setSidebar(false)}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )}
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
