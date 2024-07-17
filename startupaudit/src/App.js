import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./startup/components/Login/Login";
import Signup from "./startup/components/Login/Signup";
import Home from "./startup/components/Home/Home";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./startup/components/Routes/PrivateRoute"; // Import the ProtectedRoute component
import Organization from "./startup/GovernanceAudit/Organization/Organization";
import AddEdit from "./startup/GovernanceAudit/Organization/AddEdit";

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-left" autoClose={2000} />
      <Router>
        <div>
          <Routes>
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/organization"
              element={
                <PrivateRoute>
                  <Organization />
                </PrivateRoute>
              }
            />
            <Route
              path="/organization/add"
              element={
                <PrivateRoute>
                  <AddEdit />
                </PrivateRoute>
              }
            />

            <Route
              path="/organization/:edit"
              element={
                <PrivateRoute>
                  <AddEdit />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
