import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

function Home() {
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
