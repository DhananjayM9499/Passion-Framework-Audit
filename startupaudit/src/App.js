import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./startup/components/Login/Login";
import Signup from "./startup/components/Login/Signup";
import Home from "./startup/components/Home/Home";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./startup/components/Routes/PrivateRoute"; // Import the ProtectedRoute component
//***********Organization****************** */
import Organization from "./startup/GovernanceAudit/Organization/Organization";
import AddEditOrganization from "./startup/GovernanceAudit/Organization/AddEditOrganization";
/*******************ENVIRONMENT*************** */
import Environment from "./startup/GovernanceAudit/Environment/Environment";
import AddEditEnvironment from "./startup/GovernanceAudit/Environment/AddEditEnvironment";
import GovernanceGroup from "./startup/GovernanceAudit/Governance/GovernanceGroup/GovernanceGroup";
import ThrustArea from "./startup/GovernanceAudit/Governance/ThrustArea/ThrustArea";
import GovernanceControl from "./startup/GovernanceAudit/Governance/GovernanceControl/GovernanceControl";

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-left" autoClose={1000} />
      <Router>
        <div>
          <Routes>
            {/*************Component Routes******************** */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/**********************************************Organization APIS********************************************* */}
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
                  <AddEditOrganization />
                </PrivateRoute>
              }
            />

            <Route
              path="/organization/:organizationid"
              element={
                <PrivateRoute>
                  <AddEditOrganization />
                </PrivateRoute>
              }
            />

            {/*******************************************ENVIRONMENT APIS************************************************* */}
            <Route
              path="/environment"
              element={
                <PrivateRoute>
                  <Environment />
                </PrivateRoute>
              }
            />
            <Route
              path="/environment/add"
              element={
                <PrivateRoute>
                  <AddEditEnvironment />
                </PrivateRoute>
              }
            />
            <Route
              path="/environment/:environmentid"
              element={
                <PrivateRoute>
                  <AddEditEnvironment />
                </PrivateRoute>
              }
            />
            {/*******************************************ENVIRONMENT APIS************************************************* */}

            <Route
              path="/framework"
              element={
                <PrivateRoute>
                  <GovernanceGroup />
                </PrivateRoute>
              }
            />
            {/*******************************************ENVIRONMENT APIS************************************************* */}

            <Route
              path="/thrustarea"
              element={
                <PrivateRoute>
                  <ThrustArea />
                </PrivateRoute>
              }
            />
            {/*******************************************ENVIRONMENT APIS************************************************* */}

            <Route
              path="/control"
              element={
                <PrivateRoute>
                  <GovernanceControl />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
