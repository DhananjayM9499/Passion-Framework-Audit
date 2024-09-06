import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";
import { VscAccount } from "react-icons/vsc";
import { jwtDecode } from "jwt-decode"; // Corrected import
import logo from "../images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { toast } from "react-toastify";
import { SidebarData } from "./SidebarData";
import { FaBars, FaCaretDown } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Access current route
  const [userName, SetUserName] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [subNav, setSubNav] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        SetUserName(decodedToken.userName);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleLogoutClick = () => {
    const userConfirmed = window.confirm("Are you sure you want to logout?");
    if (userConfirmed) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user_id");
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    // Navigate to the profile page
    navigate("/profile"); // Adjust the path as needed
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

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state
  };

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine the name of the active route
  const routeNames = {
    "/home": "Home",
    "/organization": "Organization",
    "/organization/add": "Organization",
    "/organization/:organizationid": "Organization",
    "/environment": "Environment",
    "/environment/add": "Environment",
    "/environment/:environmentid": "Environment",
    "/stakeholder": "Stakeholder",
    "/stakeholder/add": "Stakeholder",
    "/stakeholder/:stakeholderid": "Stakeholder",
    "/vulnerabilities": "Vulnerabilities",
    "/vulnerabilities/add": "Vulnerabilities",
    "/vulnerabilities/:vulnerabilityid": "Vulnerabilities",
    "/technology": "Technology",
    "/technology/add": "Technology",
    "/technology/:technologyid": "Technology",
    "/projecttype": "Project Type",
    "/projecttype/add": "Project Type",
    "/projecttype/:projecttypeid": "Project Type",
    "/projectcategory": "Project Category",
    "/projectcategory/add": "Project Category",
    "/projectcategory/:projectcategoryid": "Project Category",
    "/responsibilitycenter": "Responsibility Center",
    "/responsibilitycenter/add": "Responsibility Center",
    "/responsibilitycenter/:responsibilitycenterid": "Responsibility Center",
    "/responsibilitygroup": "Responsibility Group",
    "/responsibilitygroup/add": "Responsibility Group",
    "/responsibilitygroup/:responsibilitygroupid": "Responsibility Group",
    "/thememaster": "Theme Master",
    "/thememaster/add": "Theme Master",
    "/thememaster/:thememasterid": "Theme Master",
    "/themeactivity": "Theme Activity",
    "/themeactivity/add": "Theme Activity",
    "/themeactivity/:themeactivityid": "Theme Activity",
    "/activitygroup": "Activity Group",
    "/activitygroup/add": "Activity Group",
    "/activitygroup/:activitygroupid": "Activity Group",
    "/governancegroup": "Governance Group",
    "/governancegroup/add": "Governance Group",
    "/governancegroup/:groupid": "Governance Group",
    "/thrustarea": "Thrust Area",
    "/thrustarea/add": "Thrust Area",
    "/thrustarea/:thrustid": "Thrust Area",
    "/governancecontrol": "Governance Control",
    "/governancecontrol/add": "Governance Control",
    "/governancecontrol/:controlid": "Governance Control",
    "/projectdetails": "Project Details",
    "/projectdetails/add": "Project Details",
    "/projectdetails/:projectdetailsid": "Project Details",
    "/objecttype/:objecttypeid": "Object Type",
    "/objecttype": "Object Type",
    "/objecttype/add": "Object Type",
    "/object": "Object",
    "/object/add": "Object",
    "/object/:objectid": "Object",
    "/evidence": "Evidence",
    "/evidence/add": "Evidence",
    "/evidence/:evidenceid": "Evidence",
    "/assessment": "Assessment",
    "/assessment/add": "Assessment",
    "/assessment/:assessmentid": "Assessment",
    "/audit": "Audit",
    "/audit/add": "Audit",
    "/audit/:governanceauditid": "Audit",
    "/auditplan": "Audit Plan",
    "/auditplan/add": "Audit plan",
    "/auditplan/:auditplanid": "Audit Plan",
    "/auditscore": "Audit Score",
  };

  const activeRoute = routeNames[location.pathname] || "Home";

  return (
    <>
      <IconContext.Provider value={{ color: "#ff3131" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link to="/home" className="navbar-brand">
              <img src={logo} width="70px" height="auto" alt="logo" />
            </Link>
            <div className="active-route">{activeRoute}</div>{" "}
            {/* Display active route */}
            <div
              className="account-section"
              onClick={toggleDropdown}
              ref={dropdownRef}
            >
              {/* Account icon and dropdown toggle */}
              <IconContext.Provider value={{ size: 24, color: "#ff3131" }}>
                <VscAccount />
              </IconContext.Provider>{" "}
              &nbsp;
              <span className="email-text ml-4">{userName}</span>
              {isDropdownOpen && (
                <div className="dropdown-menu show mt-2">
                  {" "}
                  {/* Add show class conditionally */}
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    Profile{" "}
                    <MdManageAccounts
                      size={24}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                    />
                  </div>
                  <div className="dropdown-item" onClick={handleLogoutClick}>
                    Logout{" "}
                    <IoLogOutOutline
                      size={24}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                    />
                  </div>
                </div>
              )}
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
