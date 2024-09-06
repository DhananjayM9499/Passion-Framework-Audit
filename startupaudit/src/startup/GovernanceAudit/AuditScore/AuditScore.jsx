import React, { useState, useEffect } from "react";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import { Pie } from "react-chartjs-2";
import AuditScoreBarGraph from "./AuditScoreBarGraph";
import { useParams, useLocation } from "react-router-dom";
import NoDataAvailable from "../../components/NoDataAvailable/NoDataAvailable";
import "./AuditScore.css";
import Navbar from "../../components/Navbar/Navbar";
import { MdOutlineAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import AuditScoreData from "./AuditScoreData";

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
const AuditScore = () => {
  const [state, setState] = useState(initialState);
  const [user, setUser] = useState([]);
  const [totalFinalScore, setTotalFinalScore] = useState(0);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
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
        console.log(scorecardData);

        // Calculate total score with a check for undefined scorecardData
        const totalScore = scorecardData.reduce(
          (total, item) => total + (item ? calculateFinalScore(item) : 0),
          0
        );
        setTotalFinalScore(totalScore);

        // Group data for pie chart with undefined check
        const groupedData = scorecardData.reduce((result, item) => {
          const groupname = item?.governancegroup || "Unknown Group";
          if (!result[groupname]) {
            result[groupname] = 0;
          }
          result[groupname] += item ? calculateFinalScore(item) : 0;
          return result;
        }, {});
        console.log(groupedData);
        setPieChartData(mapDataToPieChart(groupedData));

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

  /***********************DOWNLOAD CSV********************************* */
  const downloadCSV = (data) => {
    if (!data || data.length === 0) {
      return;
    }

    const csvRows = [];
    // Define CSV headers with "Organization" at the beginning
    const headers = [
      "Organization",
      "Project Name",
      "Project Code",
      "Object Type",
      "Object",
      "Stakeholder",
      "Technology",
      "Environment",
      "Theme",
      "Theme Activity",
      "Issue",
      "Project Type",
      "Project Category",
      "Responsibility Center",
      "Responsibility Group",
      "Governance Group",
      "Thrust Area",
      "Control Name",
      "Control Weight",
      "Sub-Control Name",
      "Sub-Control Weight",
      "Expected Evidence",
      "Evidence Reference Link",
      "Evidence Remark",
      "Evidence Status",
      "Upload Evidence",
      "Assessment Status",
      "Assessment Score",
      "Assessment Reference Link",
      "Assessment Upload",
      "Assessment Remark",
      "Auditor",
      "Auditees",
      "From Date",
      "To Date",
      "Auditor Company",
      "Audit Reference Link",
      "Audit Upload",
      "Audit Remark",
      "Audit Status",
      "Audit Score",
      "Audit Date",
    ];
    csvRows.push(headers.join(","));

    // Helper function to wrap text in double quotes and handle non-string inputs
    const wrapInQuotes = (text) => {
      const str = typeof text === "string" ? text : String(text || ""); // Convert to string if not already
      return `"${str.replace(/"/g, '""')}"`;
    };

    // Process data
    data.forEach((item, index) => {
      const row = [
        wrapInQuotes(item.organization || "N/A"),
        wrapInQuotes(item.projectname || "N/A"),
        wrapInQuotes(item.projectcode || "N/A"),
        wrapInQuotes(item.objecttype || "N/A"),
        wrapInQuotes(item.object || "N/A"),
        wrapInQuotes(item.stakeholder || "N/A"),
        wrapInQuotes(item.technology || "N/A"),
        wrapInQuotes(item.environment || "N/A"),
        wrapInQuotes(item.theme || "N/A"),
        wrapInQuotes(item.themeactivity || "N/A"),
        wrapInQuotes(item.issue || "N/A"),
        wrapInQuotes(item.project_type || "N/A"),
        wrapInQuotes(item.project_category || "N/A"),
        wrapInQuotes(item.responsibilitycenter || "N/A"),
        wrapInQuotes(item.responsibilitygroup || "N/A"),
        wrapInQuotes(item.governancegroup || "N/A"),
        wrapInQuotes(item.thrustarea || "N/A"),
        wrapInQuotes(item.controlname || "N/A"),
        wrapInQuotes(item.controlwt || "N/A"),
        wrapInQuotes(item.subcontrolname || "N/A"),
        wrapInQuotes(item.subcontrolwt || "N/A"),
        wrapInQuotes(item.expectedevidence || "N/A"),
        wrapInQuotes(item.evidencereferencelink || "N/A"),
        wrapInQuotes(item.evidenceremark || "N/A"),
        wrapInQuotes(item.evidencestatus || "N/A"),
        wrapInQuotes(item.uploadevidence || "N/A"),
        wrapInQuotes(item.assessmentstatus || "N/A"),
        wrapInQuotes(item.assessmentscore || "N/A"),
        wrapInQuotes(item.assessmentreferencelink || "N/A"),
        wrapInQuotes(item.assessmentupload || "N/A"),
        wrapInQuotes(item.assessmentremark || "N/A"),
        wrapInQuotes(item.auditor || "N/A"),
        wrapInQuotes((item.auditees || []).join(";") || "N/A"),
        wrapInQuotes(item.fromdate || "N/A"),
        wrapInQuotes(item.todate || "N/A"),
        wrapInQuotes(item.auditorcompany || "N/A"),
        wrapInQuotes(item.auditreferencelink || "N/A"),
        wrapInQuotes(item.auditupload || "N/A"),
        wrapInQuotes(item.auditremark || "N/A"),
        wrapInQuotes(item.auditstatus || "N/A"),
        wrapInQuotes(item.auditscore || "N/A"),
        wrapInQuotes(item.auditdate || "N/A"),
      ];
      csvRows.push(row.join(","));
    });

    // Create a CSV Blob and trigger download
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Audit_Details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const calculatePieChartData = () => {
    const pieData = user.reduce((result, item) => {
      const groupname = item.groupname;

      if (!result[groupname]) {
        result[groupname] = 0;
      }

      result[groupname] += calculateFinalScore(item);

      return result;
    }, {});

    const labels = Object.keys(pieData);
    const data = Object.values(pieData);

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

  const handleAdditionalFieldsClick = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  const handleTogglePieChart = () => {
    setIsVisible2(!isVisible2);
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
          <div>
            {" "}
            <button
              type="button"
              className="btn btn-round btn-signup"
              onClick={handleTogglePieChart}
            >
              Toggle Pie Chart
            </button>
            <button
              type="button"
              className="btn btn-round btn-signup"
              onClick={handleTableRowClick}
            >
              Show Graph
            </button>
            {isVisible && (
              <button
                onClick={() => downloadCSV(user)}
                className="btn btn-round btn-signup"
              >
                Download CSV
              </button>
            )}
          </div>
        </form>
      </div>

      {isVisible && (
        <div
          className="table-responsive mb-4"
          style={{ maxWidth: "100%", marginRight: "0", marginTop: "20px" }}
        >
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>No</th>
                <th>Governance group</th>
                <th>Thrust Area</th>
                <th>Control</th>
                <th>Sub Control</th>
                <th>Control Weight</th>
                <th>SubControl Weight</th>
                <th>Evdience Remark</th>
                <th>Assessment Score</th>
                <th>Audit Score</th>
                <th>Final Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) && user.length > 0 ? (
                user.map((item, index) => {
                  // Check if item is defined and has the required properties
                  if (!item || item.governancegroup === undefined) {
                    return <NoDataAvailable key={index} />;
                  }

                  return (
                    <tr key={index} onClick={() => handleTableRowClick(item)}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.governancegroup || "N/A"}</td>
                      <td>{item.thrustarea || "N/A"}</td>
                      <td>{item.controlname || "N/A"}</td>
                      <td>{item.subcontrolname || "N/A"}</td>
                      <td>{item.controlwt || "N/A"}</td>
                      <td>{item.subcontrolwt || "N/A"}</td>
                      <td>{item.evidenceremark || "N/A"}</td>
                      <td>{item.assessmentscore || "N/A"}</td>
                      <td>{item.auditscore || "NA"}</td>
                      <td>{calculateFinalScore(item)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-round btn-signup"
                          onClick={() => handleDataButtonClick(item)}
                        >
                          More
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <NoDataAvailable />
              )}
            </tbody>
          </table>
        </div>
      )}
      {isVisible1 && (
        // Inside the return statement of ScoreCardTable component
        <AuditScoreBarGraph
          graphData={scorecardData}
          evidenceRemarkCount={
            getScoreCounts(scorecardData).evidenceRemarkCount
          }
          auditScoreCount={getScoreCounts(scorecardData).auditScoreCount}
          assessmentScoreCount={
            getScoreCounts(scorecardData).assessmentScoreCount
          }
        />
      )}
      {isVisible2 && (
        <div className="chart-container">
          <h2>Pie Chart</h2>
          <Pie data={pieChartData} />
        </div>
      )}

      <div onClick={handleAdditionalFieldsClick}>
        {showAdditionalFields ? (
          <FaMinus size={24} color="#ff3131" />
        ) : (
          <MdOutlineAdd size={40} color="#ff3131" />
        )}
      </div>
      {showAdditionalFields && (
        <div
          style={{
            fontSize: "18px",
            margin: "20px",
            marginBottom: "3cm",
            color: "black",
          }}
        >
          <p style={{ textAlign: "center" }}>
            <table>
              <th>
                {" "}
                (Control Weight x Sub Control Weight x 100 ){" "}
                <hr style={{ width: "11cm" }}></hr>( Max Control Weight x Sub
                Control Weight)
              </th>
              <th>
                <div style={{ marginLeft: "10px" }}>
                  X ( Assessment Score + Audit Score)
                </div>
              </th>
            </table>
          </p>
        </div>
      )}
      {showDataPopup && (
        <AuditScoreData
          item={selectedItem}
          onClose={() => setShowDataPopup(false)}
        />
      )}
    </div>
  );
};

export default AuditScore;
