import React, { useState, useEffect } from "react";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import { useParams, useLocation } from "react-router-dom";
import NoDataAvailable from "../../components/NoDataAvailable/NoDataAvailable";
import Navbar from "../../components/Navbar/Navbar";
import logo from "../../components/images/logo.png";
const initialState = {
  organization: "",
  responsibilitygroup: "",
  responsibilitycenter: "",
  projectname: "",
  object: "",
  objecttype: "",
  controlweight: "5",
  subcontrolweight: "5",
  groupname: "",
  auditorcompany: "",
  fromDate: null,
  toDate: null,
};
const AuditRatings = () => {
  const [state, setState] = useState(initialState);
  const [user, setUser] = useState([]);
  const [totalFinalScore, setTotalFinalScore] = useState(0);
  const [selectedGraphData, setSelectedGraphData] = useState([]);
  const [respGroup, setRespGroup] = useState([]);
  const [respCenter, setRespCenter] = useState([]);
  const [objectType, setObjectType] = useState([]);
  const [objectName, setObjectName] = useState([]);
  const [organizationComp, setOrganizationComp] = useState([]);
  const [projectName, setProject] = useState([]);
  const [groupname, setGroupName] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { resultid, organization } = useParams();

  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const [pieChartData, setPieChartData] = useState([]);
  const [auditPlan, setAuditPlan] = useState([]);

  const [showDataPopup, setShowDataPopup] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  // Inside the ScoreCardTable component
  const [scorecardData, setScorecardData] = useState([]);
  const userId = sessionStorage.getItem("user_id");
  const getScoreCounts = (data) => {
    let evidenceRemarkCount = 0;
    let auditScoreCount = 0;
    let assessmentScoreCount = 0;

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.evidenceremark) {
          evidenceRemarkCount++;
        }
        if (item.auditremark) {
          auditScoreCount++;
        }
        if (item.assessmentremark) {
          assessmentScoreCount++;
        }
      });
    } else if (data && typeof data === "object") {
    }
    return {
      evidenceRemarkCount,
      auditScoreCount,
      assessmentScoreCount,
    };
  };

  const handleDataButtonClick = (item) => {
    setSelectedData(item);
    setShowDataPopup(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct query parameters with fallback to empty string or undefined for optional fields
        const queryParams = {
          organization: state.organization || "",
          responsibilitygroup: state.responsibilitygroup || "",
          responsibilitycenter: state.responsibilitycenter || "",
          projectname: state.projectname || "",
          object: state.object || "",
          objecttype: state.objecttype || "",
          governancegroup: state.groupname || "",
          auditorcompany: state.auditorcompany || "",
          fromdate: state.fromDate
            ? new Date(state.fromDate).toISOString().split("T")[0]
            : undefined, // Format date if provided
          todate: state.toDate
            ? new Date(state.toDate).toISOString().split("T")[0]
            : undefined, // Format date if provided
        };

        // Fetch main scorecard data
        const response = await axios.get(API.GET_SCORECARD_API(userId), {
          params: queryParams,
        });
        const scorecardData = response.data || [];
        setScorecardData(scorecardData);
        setUser(scorecardData);
        setSelectedGraphData(scorecardData);

        // Calculate total score with a check for undefined scorecardData
        const totalScore = scorecardData.reduce(
          (total, item) => total + (item ? calculateFinalScore(item) : 0),
          0
        );
        setTotalFinalScore(totalScore);

        // Parallelize the other API requests with default empty arrays for fallback
        const [
          respGroup = [],
          respCenter = [],
          objectType = [],
          objectName = [],
          project = [],
          groupname = [],
          organizationComp = [],
          auditPlanData = [],
        ] = await Promise.all([
          fetchDataFromAPI(API.GET_RESPONSIBILITYGROUP_API).catch(() => []),
          fetchDataFromAPI(API.GET_RESPONSIBILITYCENTER_API).catch(() => []),
          fetchDataFromAPI(API.GET_OBJECTTYPE_API).catch(() => []),
          fetchDataFromAPI(API.GET_OBJECT_API).catch(() => []),
          fetchDataFromAPI(API.GET_PROJECTDETAILS_USERID(userId)).catch(
            () => []
          ),
          fetchDataFromAPI(API.GET_GOVERNANCEGROUP_API).catch(() => []),
          fetchDataFromAPI(API.GET_ORGANIZATION_API(userId)).catch(() => []),
          fetchDataFromAPI(API.GET_USER_AUDITPLAN(userId)).catch(() => []),
        ]);

        // Set states for the parallelized data
        setRespGroup(respGroup);
        setRespCenter(respCenter);
        setObjectType(objectType);
        setObjectName(objectName);
        setProject(project);
        setGroupName(groupname);
        setOrganizationComp(organizationComp);
        setAuditPlan(auditPlanData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [state, resultid]);

  const fetchDataFromAPI = async (apiEndpoint) => {
    const response = await axios.get(apiEndpoint);
    return response.data;
  };

  /*********************************************************************** */

  const handleInputChange = (e) => {
    setIsVisible(true);
    const { name, value } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlSubmit = (e) => {
    e.preventDefault();
  };
  const handleTableRowClick = (item) => {
    setSelectedItem(item);
    setSelectedGraphData([item]); // Set the selected item as an array for the graph
    setIsVisible1(!isVisible1);
  };

  const calculateFinalScore = (item) => {
    return (
      ((item.controlwt * item.subcontrolwt * 100) /
        (state.controlweight * state.subcontrolweight)) *
      (item.assessmentscore + item.auditscore)
    );
  };

  const mapDataToPieChart = (groupedData) => {
    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            // ... add more colors if needed
          ],
        },
      ],
    };
  };

  const filterUniqueGroupNames = (data) => {
    const uniqueGroupNames = new Set();
    return data.filter((entry) => {
      if (!uniqueGroupNames.has(entry.groupname)) {
        uniqueGroupNames.add(entry.groupname);
        return true;
      }
      return false;
    });
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      // Extract day, month, and year parts
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const year = date.getFullYear();

      // Return the formatted date as dd/mm/yyyy
      return `${day}/${month}/${year}`;
    }
    return "N/A";
  };

  return (
    <div className="add-edit-project-container mt-5">
      <Navbar />
      <div className="mt-4">
        <form onSubmit={handlSubmit} className="add-edit-project-form ">
          <div className="add-edit-project-grid">
            <div>
              <label>Organization:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="organization"
                name="organization"
                value={state.organization || organization}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Organization </option>
                {organizationComp.map((comp) => (
                  <option
                    key={comp.resultid}
                    value={comp.organization || organization}
                  >
                    {comp.organization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Responsibility group:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitygroup"
                name="responsibilitygroup"
                value={state.responsibilitygroup}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Responsibility Group</option>
                {respGroup.map((respgroup) => (
                  <option
                    key={respgroup.resultid}
                    value={respgroup.responsibilitygroupname}
                  >
                    {respgroup.responsibilitygroupname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Responsibility Center:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitycenter"
                name="responsibilitycenter"
                value={state.responsibilitycenter}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Responsibility Center</option>
                {respCenter.map((respcenter) => (
                  <option
                    key={respcenter.resultid}
                    value={respcenter.responsibilitycentername}
                  >
                    {" "}
                    {respcenter.responsibilitycentername}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Project:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                type="text"
                id="projectname"
                name="projectname"
                placeholder="Enter the Project"
                value={state.projectname}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Project</option>
                {projectName.map((project) => (
                  <option key={project.resultid} value={project.projectname}>
                    {project.projectname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Object Type:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="object"
                name="object"
                value={state.object}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Object Type</option>
                {filterUniqueGroupNames(objectType).map((objtype) => (
                  <option key={objtype.resultid} value={objtype.objecttype}>
                    {objtype.objecttype}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Object Name:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="objecttype"
                name="objecttype"
                value={state.objecttype}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Object Name</option>
                {objectName.map((objname) => (
                  <option key={objname.resultid} value={objname.objectname}>
                    {objname.objectname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Auditor Company:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="auditorcompany"
                name="auditorcompany"
                value={state.auditorcompany}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Company Name</option>
                {filterUniqueGroupNames(auditPlan).map((auditPlanData) => (
                  <option
                    key={auditPlanData.auditplanid}
                    value={auditPlanData.auditorcompany}
                  >
                    {auditPlanData.auditorcompany}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-edit-project-input">
              <label>From Date:</label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={state.fromDate}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />

              <label>To Date:</label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={state.toDate}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
          </div>
          <div className="add-edit-project-grid">
            <label>
              <h4>Governance Name:</h4>
            </label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="groupname"
              name="groupname"
              value={state.groupname}
              onChange={handleInputChange}
              className="add-edit-project-input"
            >
              {" "}
              <option value="">Group Name</option>
              {filterUniqueGroupNames(groupname).map((grpname) => (
                <option key={grpname.resultid} value={grpname.groupname}>
                  {grpname.groupname}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              marginRight: "100px",
              marginLeft: "50px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <label>Max Control Weight</label>
              <input
                type="text"
                id="controlweight"
                name="controlweight"
                value={state.controlweight}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label>Sub Control Weight</label>
              <input
                type="text"
                id="subcontrolweight"
                name="subcontrolweight"
                value={state.subcontrolweight}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
          </div>
        </form>
      </div>

      {isVisible &&
        (Array.isArray(user) && user.length > 0 ? (
          <div className="row">
            {user.map((item) => {
              // Check if item is defined and has the required properties
              if (!item?.governancegroup) {
                return <NoDataAvailable key={item.id || Math.random()} />;
              }

              return (
                <div className="col-md-6" key={item.id || Math.random()}>
                  <div className="container border border-black border-3 pb-0 mb-4">
                    {/* Header */}
                    <div className="row align-items-center p-3 border-bottom border-4 border-dark">
                      <div className="col-3 text-center">
                        <img src={logo} alt="Logo" style={{ width: "100px" }} />
                      </div>
                      <div className="col-6 text-center">
                        <h1 className="text-danger fw-bold">
                          Passion Audit Framework
                        </h1>
                      </div>
                      <div className="col-3 text-end">
                        <img
                          src={
                            item.auditorcompanylogo
                              ? API.GET_IMAGE(item.auditorcompanylogo)
                              : API.GET_IMAGE("defaultimage.png")
                          }
                          alt="LOGO"
                          style={{ width: "80px" }}
                        />
                      </div>
                    </div>
                    {/* Content Section */}
                    <div className="row  ">
                      <div className="col-md-6  align-middle border-4 border-danger border-top border-bottom p-0 pt-1 pb-1 text-start">
                        {[
                          { label: "Company Name :", value: item.organization },
                          {
                            label: "Auditor Company :",
                            value: item.auditorcompany,
                          },
                          {
                            label: "Certified For :",
                            value: item.governancegroup,
                          },
                          {
                            label: "Audit Framework :",
                            value: item.governancegroup,
                          },
                          {
                            label: "Expiry Date :",
                            value: formatDate(item.auditreportexpirydate),
                          },
                        ].map(({ label, value }) => (
                          <div className="row m-0 border" key={label}>
                            <div className="col-6 fw-bold border-end p-0 pr-1 text-dark ">
                              {label || "N/A"}
                            </div>
                            <div className="col-6 text-muted fw-medium border-cell p-0 text-dark">
                              {value || "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Right Column: Ratings */}
                      <div className="col-md-6 text-center border-dark p-0 pr-0  border-start border-4">
                        <div className="border-bottom border-dark  border-4">
                          <p className="fw-bold text-start p-1 pr-2 text-dark ">
                            Assessment Rating
                          </p>
                          <h1 className="display-4">
                            {item.auditrating || "NA"}/5
                          </h1>
                        </div>
                        <div>
                          <p className="fw-bold text-start p-1 pr-2 text-dark">
                            Audit Rating
                          </p>
                          <h1 className="display-4">
                            {item.assessmentrating || "NA"}/5
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoDataAvailable />
        ))}
    </div>
  );
};

export default AuditRatings;
