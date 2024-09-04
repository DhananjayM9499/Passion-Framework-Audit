import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import logo from "../images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null);
  const [userId, setUserId] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    // Function to validate the token
    const validateToken = async () => {
      try {
        const response = await axios.post(API.VALIDATE_TOKEN_API, { token });

        if (response.data.valid) {
          setIsValid(true); // Token is valid
        } else {
          setIsValid(false); // Token is invalid
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsValid(false); // Set to false on error
      }
    };

    validateToken();
  }, [token]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        setUserId(decodedToken.user_id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill all the fields");
    } else {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      try {
        const response = await fetch(API.UPDATE_PASSWORD_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, password }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Password Update successful! Please log in.");
          navigate("/login");
        } else {
          toast.error("Update  failed: " + data.message);
        }
      } catch (err) {
        toast.error("Error: " + err.message);
      }
    }
  };

  if (isValid === null) {
    return <div>Loading...</div>; // Loading state
  }

  if (!isValid) {
    return <div>Invalid or expired reset link.</div>; // Invalid token message
  }

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
                  Reset your password and regain access to all the personalized
                  services and features our platform has to offer.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="text-box-cont">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="input-group center">
                      <button
                        className="btn btn-round btn-signup"
                        type="submit"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-6 col-md-6 box-de">
                <div className="inn-cover">
                  <div className="ditk-inf">
                    <div className="small-logo"></div>
                    <h2 className="w-100 text-light">Reset Your Password</h2>
                    <p>
                      Forgot your password? No worries! Enter your details to
                      reset your password and get back to exploring our platform
                      with access to exclusive features and personalized
                      services just for you.
                    </p>

                    <Link to="/login">
                      <button type="button" className="btn btn-outline-light">
                        Login
                      </button>
                    </Link>
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

export default ResetPassword;
