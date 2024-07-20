import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import { jwtDecode } from "jwt-decode";

function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        localStorage.setItem("user_id", decodedToken.userId);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <div>
      <Navbar />

      <div className="home">
        <div className="home-content">
          <h1 className="welcome-message">
            Welcome to Passion Framework Audit
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
