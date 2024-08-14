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
import Environment from "./startup/GovernanceAudit/Master/Environment/Environment";
import AddEditEnvironment from "./startup/GovernanceAudit/Master/Environment/AddEditEnvironment";
/*******************GOVERNANCE*************** */
import GovernanceGroup from "./startup/GovernanceAudit/Master/Governance/GovernanceGroup/GovernanceGroup";
import ThrustArea from "./startup/GovernanceAudit/Master/Governance/ThrustArea/ThrustArea";
import GovernanceControl from "./startup/GovernanceAudit/Master/Governance/GovernanceControl/GovernanceControl";

/*******************STAKEHOLDER*************** */
import Stakeholder from "./startup/GovernanceAudit/Master/Stakeholder/Stakeholder";
import AddEditStakeholder from "./startup/GovernanceAudit/Master/Stakeholder/AddEditStakeholder";

/*******************VULNERABILITIES*************** */
import Vulnerabilities from "./startup/GovernanceAudit/Master/Vulnerabilities/Vulnerabilities";
import AddEditVulnerabilities from "./startup/GovernanceAudit/Master/Vulnerabilities/AddEditVulnerabilities";

/*******************TECHNOLOGY*************** */
import Technology from "./startup/GovernanceAudit/Master/Technology/Technology";
import AddEditTechnology from "./startup/GovernanceAudit/Master/Technology/AddEditTechnology";
import AddEditProjectType from "./startup/GovernanceAudit/Master/Project/ProjectType/AddEditProjectType";
import ProjectType from "./startup/GovernanceAudit/Master/Project/ProjectType/ProjectType";
import ProjectCategory from "./startup/GovernanceAudit/Master/Project/ProjectCategory/ProjectCategory";
import AddEditProjectCategory from "./startup/GovernanceAudit/Master/Project/ProjectCategory/AddEditProjectCategory";
import ResponsibilityCenter from "./startup/GovernanceAudit/Master/ResponsibilityCenter/ResponsibilityCenter";
import AddEditResponsibilityCenter from "./startup/GovernanceAudit/Master/ResponsibilityCenter/AddEditResponsibilityCenter";
import ResponsibilityGroup from "./startup/GovernanceAudit/Master/ResponsibilityGroup/ResponsibilityGroup";
import AddEditResponsibilityGroup from "./startup/GovernanceAudit/Master/ResponsibilityGroup/AddEditResponsibilityGroup";
import ThemeMaster from "./startup/GovernanceAudit/Master/ThemeMaster/ThemeMaster";
import AddEditThemeMaster from "./startup/GovernanceAudit/Master/ThemeMaster/AddEditThemeMaster";
import ThemeActivity from "./startup/GovernanceAudit/Master/ThemeActivity/ThemeActivity";
import AddEditThemeActivity from "./startup/GovernanceAudit/Master/ThemeActivity/AddEditThemeActivity";
import ActivityGroup from "./startup/GovernanceAudit/Master/ActivityGroup/ActivityGroup";
import AddEditActivityGroup from "./startup/GovernanceAudit/Master/ActivityGroup/AddEditActivityGroup";
import AddEditGovernanceGroup from "./startup/GovernanceAudit/Master/Governance/GovernanceGroup/AddEditGovernanceGroup";
import AddEditThrust from "./startup/GovernanceAudit/Master/Governance/ThrustArea/AddEditThrust";
import AddEditGovernanceControl from "./startup/GovernanceAudit/Master/Governance/GovernanceControl/AddEditGovernanceControl";
import ProjectDetails from "./startup/GovernanceAudit/Project/ProjectDetails";
import AddEditProjectDetails from "./startup/GovernanceAudit/Project/AddEditProjectDetails";
import Object from "./startup/GovernanceAudit/Master/Object/Object";
import AddEditObjectType from "./startup/GovernanceAudit/Master/ObjectType/AddEditObjectType";
import ObjectType from "./startup/GovernanceAudit/Master/ObjectType/ObjectType";
import AddEditObject from "./startup/GovernanceAudit/Master/Object/AddEditObject";
import Evidence from "./startup/GovernanceAudit/Evidence/Evidence";
import AddEditEvidence from "./startup/GovernanceAudit/Evidence/AddEditEvidence";
import Assessment from "./startup/GovernanceAudit/Assessment/Assessment";
import AddEditAssessment from "./startup/GovernanceAudit/Assessment/AddEditAssessment";
import Audit from "./startup/GovernanceAudit/Audit/Audit";
import AddEditAudit from "./startup/GovernanceAudit/Audit/AddEditAudit";

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

            {/**********************************************Organization URLS********************************************* */}
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

            {/*******************************************ENVIRONMENT URLS************************************************* */}
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

            {/*************************************************STAKEHOLDER URLS*********************************************** */}

            <Route
              path="/stakeholder"
              element={
                <PrivateRoute>
                  <Stakeholder />
                </PrivateRoute>
              }
            />
            <Route
              path="/stakeholder/add"
              element={
                <PrivateRoute>
                  <AddEditStakeholder />
                </PrivateRoute>
              }
            />
            <Route
              path="/stakeholder/:stakeholderid"
              element={
                <PrivateRoute>
                  <AddEditStakeholder />
                </PrivateRoute>
              }
            />
            {/*******************************************VULNERABILITIES URLS************************************************** */}
            <Route
              path="/vulnerabilities"
              element={
                <PrivateRoute>
                  <Vulnerabilities />
                </PrivateRoute>
              }
            />
            <Route
              path="/vulnerabilities/add"
              element={
                <PrivateRoute>
                  <AddEditVulnerabilities />
                </PrivateRoute>
              }
            />
            <Route
              path="/vulnerabilities/:vulnerabilityid"
              element={
                <PrivateRoute>
                  <AddEditVulnerabilities />
                </PrivateRoute>
              }
            />
            {/*******************************************TECHNOLOGIES URLS************************************************** */}
            <Route
              path="/technology"
              element={
                <PrivateRoute>
                  <Technology />
                </PrivateRoute>
              }
            />
            <Route
              path="/technology/add"
              element={
                <PrivateRoute>
                  <AddEditTechnology />
                </PrivateRoute>
              }
            />
            <Route
              path="/technology/:technologyid"
              element={
                <PrivateRoute>
                  <AddEditTechnology />
                </PrivateRoute>
              }
            />
            {/****************************************PROJECT TYPE******************************* */}

            <Route
              path="/projecttype"
              element={
                <PrivateRoute>
                  <ProjectType />
                </PrivateRoute>
              }
            />
            <Route
              path="/projecttype/add"
              element={
                <PrivateRoute>
                  <AddEditProjectType />
                </PrivateRoute>
              }
            />
            <Route
              path="/projecttype/:projecttypeid"
              element={
                <PrivateRoute>
                  <AddEditProjectType />
                </PrivateRoute>
              }
            />
            {/****************************************PROJECT CATEGORY******************************* */}

            <Route
              path="/projectcategory"
              element={
                <PrivateRoute>
                  <ProjectCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/projectcategory/add"
              element={
                <PrivateRoute>
                  <AddEditProjectCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/projectcategory/:projectcategoryid"
              element={
                <PrivateRoute>
                  <AddEditProjectCategory />
                </PrivateRoute>
              }
            />
            {/*****************************************Responsibility Center*********************************************** */}
            <Route
              path="/responsibilitycenter"
              element={
                <PrivateRoute>
                  <ResponsibilityCenter />
                </PrivateRoute>
              }
            />

            <Route
              path="/responsibilitycenter/:responsibilitycenterid"
              element={
                <PrivateRoute>
                  <AddEditResponsibilityCenter />
                </PrivateRoute>
              }
            />
            <Route
              path="/responsibilitycenter/add"
              element={
                <PrivateRoute>
                  <AddEditResponsibilityCenter />
                </PrivateRoute>
              }
            />
            {/*****************************************Responsibility Group*********************************************** */}
            <Route
              path="/responsibilitygroup"
              element={
                <PrivateRoute>
                  <ResponsibilityGroup />
                </PrivateRoute>
              }
            />

            <Route
              path="/responsibilitygroup/:responsibilitygroupid"
              element={
                <PrivateRoute>
                  <AddEditResponsibilityGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/responsibilitygroup/add"
              element={
                <PrivateRoute>
                  <AddEditResponsibilityGroup />
                </PrivateRoute>
              }
            />
            {/*****************************************THEME MASTER URLS******************************************************** */}
            <Route
              path="/thememaster"
              element={
                <privateRoute>
                  <ThemeMaster />
                </privateRoute>
              }
            />
            <Route
              path="/thememaster/add"
              element={
                <privateRoute>
                  <AddEditThemeMaster />
                </privateRoute>
              }
            />
            <Route
              path="/thememaster/:thememasterid"
              element={
                <privateRoute>
                  <AddEditThemeMaster />
                </privateRoute>
              }
            />
            {/************************************THEME ACTIVITY************************************************************ */}
            <Route
              path="/themeactivity"
              element={
                <privateRoute>
                  <ThemeActivity />
                </privateRoute>
              }
            />
            <Route
              path="/themeactivity/add"
              element={
                <privateRoute>
                  <AddEditThemeActivity />
                </privateRoute>
              }
            />

            <Route
              path="/themeactivity/:themeactivityid"
              element={
                <privateRoute>
                  <AddEditThemeActivity />
                </privateRoute>
              }
            />
            {/***************************ACTIVITY GROUP URLS************************************************ */}
            <Route
              path="/activitygroup"
              element={
                <privateRoute>
                  <ActivityGroup />
                </privateRoute>
              }
            />
            <Route
              path="/activitygroup/add"
              element={
                <privateRoute>
                  <AddEditActivityGroup />
                </privateRoute>
              }
            />
            <Route
              path="/activitygroup/:activitygroupid"
              element={
                <privateRoute>
                  <AddEditActivityGroup />
                </privateRoute>
              }
            />
            {/*******************************************GOVERNANCE GROUP URLS************************************************* */}

            <Route
              path="/governancegroup"
              element={
                <PrivateRoute>
                  <GovernanceGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/governancegroup/add"
              element={
                <PrivateRoute>
                  <AddEditGovernanceGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="/governancegroup/:groupid"
              element={
                <PrivateRoute>
                  <AddEditGovernanceGroup />
                </PrivateRoute>
              }
            />
            {/*******************************************THRUST AREA URLS************************************************* */}

            <Route
              path="/thrustarea"
              element={
                <PrivateRoute>
                  <ThrustArea />
                </PrivateRoute>
              }
            />
            <Route
              path="/thrustarea/add"
              element={
                <PrivateRoute>
                  <AddEditThrust />
                </PrivateRoute>
              }
            />
            <Route
              path="/thrustarea/:thrustid"
              element={
                <PrivateRoute>
                  <AddEditThrust />
                </PrivateRoute>
              }
            />
            {/*******************************************GOVERNANCE CONTROL URLS************************************************* */}

            <Route
              path="/governancecontrol"
              element={
                <PrivateRoute>
                  <GovernanceControl />
                </PrivateRoute>
              }
            />
            <Route
              path="/governancecontrol/add"
              element={
                <PrivateRoute>
                  <AddEditGovernanceControl />
                </PrivateRoute>
              }
            />
            <Route
              path="/governancecontrol/:controlid"
              element={
                <PrivateRoute>
                  <AddEditGovernanceControl />
                </PrivateRoute>
              }
            />

            {/****************************************************PROJECT URLS********************************************************* */}

            <Route
              path="/projectdetails"
              element={
                <PrivateRoute>
                  <ProjectDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/projectdetails/add"
              element={
                <PrivateRoute>
                  <AddEditProjectDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/projectdetails/:projectdetailsid"
              element={
                <PrivateRoute>
                  <AddEditProjectDetails />
                </PrivateRoute>
              }
            />
            {/******************************************************OBJECT TYPE URLS********************************************************** */}

            <Route
              path="/objecttype"
              element={
                <PrivateRoute>
                  <ObjectType />
                </PrivateRoute>
              }
            />

            <Route
              path="/objecttype/add"
              element={
                <PrivateRoute>
                  <AddEditObjectType />
                </PrivateRoute>
              }
            />
            <Route
              path="/objecttype/:objecttypeid"
              element={
                <PrivateRoute>
                  <AddEditObjectType />
                </PrivateRoute>
              }
            />

            {/******************************************************OBJECT URLS********************************************************** */}
            <Route
              path="/object"
              element={
                <PrivateRoute>
                  <Object />
                </PrivateRoute>
              }
            />

            <Route
              path="/object/add"
              element={
                <PrivateRoute>
                  <AddEditObject />
                </PrivateRoute>
              }
            />
            <Route
              path="/object/:objectid"
              element={
                <PrivateRoute>
                  <AddEditObject />
                </PrivateRoute>
              }
            />
            {/***********************************************Evidence URLS********************************************************** */}
            <Route
              path="/evidence"
              element={
                <PrivateRoute>
                  <Evidence />
                </PrivateRoute>
              }
            />
            <Route
              path="/evidence/add"
              element={
                <PrivateRoute>
                  <AddEditEvidence />
                </PrivateRoute>
              }
            />
            <Route
              path="/evidence/:evidenceid"
              element={
                <PrivateRoute>
                  <AddEditEvidence />
                </PrivateRoute>
              }
            />
            {/******************************************ASSESSMENT URLS***************************************************** */}
            <Route
              path="/assessment"
              element={
                <PrivateRoute>
                  <Assessment />
                </PrivateRoute>
              }
            />
            <Route
              path="/assessment/add"
              element={
                <PrivateRoute>
                  <AddEditAssessment />
                </PrivateRoute>
              }
            />
            <Route
              path="/assessment/:assessmentid"
              element={
                <PrivateRoute>
                  <AddEditAssessment />
                </PrivateRoute>
              }
            />
            {/******************************************AUDIT URLS***************************************************** */}
            <Route
              path="/audit"
              element={
                <PrivateRoute>
                  <Audit />
                </PrivateRoute>
              }
            />
            <Route
              path="/audit/add"
              element={
                <PrivateRoute>
                  <AddEditAudit />
                </PrivateRoute>
              }
            />
            <Route
              path="/audit/:governanceauditid"
              element={
                <PrivateRoute>
                  <AddEditAudit />
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
