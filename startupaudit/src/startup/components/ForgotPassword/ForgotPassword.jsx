import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";

import logo from "../images/logo.png";
import * as API from "../../Endpoints/Endpoints";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your e-mail");
    } else {
      try {
        const response = await fetch(API.RESET_PASSWORD_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Password reset link sent to your email");
          navigate("/login");
        } else {
          toast.error("Login failed: " + data.message);
        }
      } catch (err) {
        toast.error("Error: " + err.message);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row cdvfdfd">
          <div className="col-lg-10 col-md-12 login-box">
            <div className="row">
              <div className="col-lg-6 col-md-6 log-det">
                <div className="small-logo">
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "150px", height: "auto" }}
                  />
                </div>
                <p className="dfmn">
                  "Forgot your password? No worries! Reset it now to regain
                  access to your account and continue exploring our platform's
                  personalized services."
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="text-box-cont">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="input-group center">
                      <button
                        className="btn btn-round btn-signup"
                        type="submit"
                      >
                        Send Link
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-6 col-md-6 box-de">
                <div className="inn-cover">
                  <div className="ditk-inf">
                    <div className="small-logo"></div>
                    <h2 className="w-100 text-light">
                      Can't remember your password?
                    </h2>
                    <p>
                      "Let’s get you back on track! Reset your password now to
                      quickly restore access to your account and enjoy all the
                      personalized services our platform has to offer."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
