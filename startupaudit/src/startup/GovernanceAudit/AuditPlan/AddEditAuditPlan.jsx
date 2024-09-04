import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import axios, { toFormData } from "axios";
import { WithContext as ReactTags } from "react-tag-input";
import "./AddEditAuditPlan.css";
import * as API from "../../Endpoints/Endpoints"; // Adjust the import path as needed
import { toast } from "react-toastify";

const initialState = {
  projectname: "",
  auditor: "",
  auditees: [],
  auditscope: "",
  auditorcompany: "",
  fromdate: null,
  todate: null,
};

const AddEditAuditPlan = () => {
  const userId = sessionStorage.getItem("user_id");
  const location = useLocation();
  const { projectId, evidenceId, assessmentId, project } = location.state || {};
  const [data, setData] = useState([]);
  const [organization, setOrganization] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [assess, Setassess] = useState([]);
  const [auditPlan, SetauditPlan] = useState(initialState);
  const itemsPerPage = 3;
  const [state, setState] = useState([]);
  const { auditplanid } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (projectId) {
      const fetchProjectData = async () => {
        try {
          const response = await axios.get(
            API.GET_SPECIFIC_PROJECTDETAILS(projectId)
          );
          if (response.data.length > 0) {
            setData(response.data[0]);
          } else {
            setError("No project data found.");
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
          setError("Failed to fetch project data. Please try again later.");
        }
      };

      fetchProjectData();
    } else {
      console.warn("No projectId provided");
    }
    if (data.organization) {
      const fetchOrganizationData = async () => {
        try {
          const response = await axios.get(
            API.GET_ORGANIZATION_BYNAME(data.organization)
          );
          setOrganization(response.data[0]);
        } catch (error) {
          console.error("Error fetching organization data:", error);
          setError("Failed to fetch organization data.");
        }
      };

      fetchOrganizationData();
    }
    const loadEvidence = async () => {
      try {
        const response = await axios.get(API.GET_SPECIFIC_EVIDENCE(evidenceId));
        const sortedData = response.data.sort(
          (a, b) => b.evidenceid - a.evidenceid
        );
        setState(sortedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadEvidence();
  }, [projectId, data.organization]);

  useEffect(() => {
    loadData();
    if (auditplanid) {
      loadAuditPlan();
    }
  }, [userId, auditplanid]); // Added organizationName to dependency array

  const loadData = async () => {
    try {
      const response = await axios.get(
        API.GET_ASSESSMENT_BYUSERID(userId, evidenceId)
      );
      const sortedData = response.data.sort(
        (a, b) => b.evidenceid - a.evidenceid
      );
      Setassess(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const loadAuditPlan = async () => {
    try {
      const response = await axios.get(API.GET_SPECIFIC_AUDITPLAN(auditplanid));
      const auditPlanData = response.data[0];

      // Since auditPlanData.auditees is already an array, just map over it
      const auditeesTags = auditPlanData.auditees.map((auditee, index) => ({
        id: index.toString(),
        text: auditee.trim(),
      }));

      SetauditPlan({ ...auditPlanData, auditees: auditeesTags });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Function to format dates safely
  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    }
    return "N/A";
  };

  const handleDelete = (i) => {
    const newTags = auditPlan.auditees.filter((tag, index) => index !== i);
    SetauditPlan((prevState) => ({ ...prevState, auditees: newTags }));
  };

  const handleAddition = (tag) => {
    SetauditPlan((prevState) => ({
      ...prevState,
      auditees: [...prevState.auditees, tag],
    }));
  };

  // Function to format times safely
  const formatTime = (timeString) => {
    if (timeString) {
      // Manually parse the time string
      const [hours, minutes, secondsWithOffset] = timeString.split(":");
      const [seconds] = secondsWithOffset.split("+");
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      return formattedTime;
    }
    return "N/A";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = state.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(state.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SetauditPlan((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { auditor, auditees, auditscope, auditorcompany, fromdate, todate } =
      auditPlan;

    if (
      !auditor ||
      auditees.length === 0 ||
      !auditscope ||
      !auditorcompany ||
      !fromdate ||
      !todate
    ) {
      toast.error("Please provide all the required fields");
      return;
    }

    try {
      const apiEndpoint = auditplanid
        ? API.UPDATE_SPECIFIC_AUDITPLAN(auditplanid)
        : API.POST_AUDITPLAN_API;
      const method = auditplanid ? axios.put : axios.post;
      const response = await method(apiEndpoint, {
        ...auditPlan,
        auditees: auditPlan.auditees.map((tag) => tag.text).join(","),
        assessmentid: assessmentId,
        user_id: userId,
        projectdetailsid: projectId,
        projectname: project,
      });

      if (response.status === 200) {
        toast.success(
          auditplanid
            ? "Audit updated successfully!"
            : "Audit saved successfully!"
        );
        SetauditPlan(initialState);
        setTimeout(
          () =>
            navigate("/auditplan", {
              state: { userId, evidenceId, projectId, assessmentId, project },
            }),
          500
        );
      } else {
        toast.error("Failed to save Audit .");
      }
    } catch (err) {
      toast.error("An error occurred: " + err.message);
    }
  };
  return (
    <div className="evidence-page">
      {/* Uncomment Navbar if needed */}
      <Navbar />

      {error && <p className="error-message">{error}</p>}

      <div className="evContainer">
        <div className="row">
          {/* Company Details */}
          <div className="col">
            <h2>{data.organization || "N/A"}</h2>

            <p>
              <b>Contact Person : </b> {organization.contactname || "N/A"}
            </p>
            <p>
              <b>Contact Email : </b> {organization.contactemail || "N/A"}
            </p>
            <p>
              <b>Contact Phone : </b> {organization.contactphone || "N/A"}
            </p>
          </div>
          <div className="vertical-divider"></div>
          {/* Project Details */}
          <div className="col">
            <h3>
              <b>PROJECT DETAILS</b>
            </h3>

            <p>
              <b>Project Name : </b> {data.projectname || "N/A"}
            </p>
            <p>
              <b>Project Code : </b> {data.projectcode || "N/A"}
            </p>
            <p>
              <b>Project Category : </b> {data.project_category || "N/A"}
            </p>
            <p>
              <b>Project Type : </b> {data.project_type || "N/A"}
            </p>
          </div>
          <div className="col mt-4">
            <p>
              <b>Audit Time : </b> {formatTime(data.audittime) || "N/A"}
            </p>

            <p>
              <b>Responsibility Center : </b>{" "}
              {data.responsibilitycenter || "N/A"}
            </p>
            <p>
              <b>Responsibility Group : </b> {data.responsibilitygroup || "N/A"}
            </p>
          </div>
          <div className="col mt-4">
            <p>
              <b>Stakeholder : </b> {data.stakeholder || "N/A"}
            </p>
            <p>
              <b>Technology : </b> {data.technology || "N/A"}
            </p>

            <p>
              <b>Theme : </b> {data.theme || "N/A"}
            </p>
            <p>
              <b>Theme Activity : </b> {data.themeactivity || "N/A"}
            </p>
            <p>
              <b>Audit Date : </b> {formatDate(data.auditdate) || "N/A"}
            </p>
          </div>
          <div className="col mt-4">
            <p>
              <b>Environment : </b> {data.environment || "N/A"}
            </p>
            <p>
              <b>Issue : </b> {data.issue || "N/A"}
            </p>
            <p>
              <b>Object : </b> {data.object || "N/A"}
            </p>
            <p>
              <b>Object Type : </b> {data.objecttype || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="mt-4">
          <div
            className="table-responsive "
            style={{ maxWidth: "85%", margin: "0 auto", marginRight: "0" }}
          >
            <h1 className="text-center mb-2 mt-2">Governance Details</h1>
            <div>
              <table className="table table-bordered table-hover">
                <tbody>
                  {currentItems.map((item, index) => (
                    <React.Fragment key={item.evidenceid}>
                      {/* First Row - Headers */}
                      <tr className="thead-dark">
                        <th scope="col">Governance Group</th>
                        <th scope="col">Thrust Area</th>
                        <th scope="col">Control</th>
                        <th scope="col">Sub-Control</th>
                        <th scope="col">Expected Evidence</th>
                      </tr>

                      {/* Second Row - Data */}
                      <tr>
                        <td>{item.governancegroup}</td>
                        <td>{item.thrustarea}</td>
                        <td>{item.controlname}</td>
                        <td>{item.subcontrolname}</td>
                        <td>{item.expectedevidence}</td>
                      </tr>

                      {/* Third Row - Second Set of Headers */}
                      <tr className="thead-dark">
                        <th scope="col">Evidence Reference Link</th>
                        <th scope="col">Evidence Remark</th>
                        <th scope="col" colSpan="2">
                          Evidence Status
                        </th>
                        <th scope="col" colSpan="2">
                          Evidence Upload
                        </th>
                      </tr>

                      {/* Fourth Row - Second Set of Data */}
                      <tr>
                        <td>{item.evidencereferencelink}</td>
                        <td>{item.evidenceremark}</td>
                        <td colSpan="2">{item.evidencestatus}</td>
                        <td colSpan="2">{item.uploadevidence}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
                <tbody>
                  {assess.map((item, index) => (
                    <React.Fragment>
                      <tr>
                        <th scope="col">Assessment Reference Link</th>
                        <th scope="col">Assessment Upload</th>
                        <th scope="col">Assessment Remark</th>
                        <th scope="col">Assessment Status</th>
                        <th scope="col">Assessment Score</th>
                      </tr>
                      <tr key={item.evidenceid}>
                        <td>{item.assessmentreferencelink}</td>
                        <td>{item.assessmentupload}</td>
                        <td>{item.assessmentremark}</td>
                        <td>{item.assessmentstatus}</td>
                        <td>{item.assessmentscore}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <hr
            style={{
              margin: "0 auto",
              border: "3px solid #212121",
              maxWidth: "85%",
              marginRight: "0",
            }}
          />
          <div className="add-edit-project-container">
            <form onSubmit={handleSubmit}>
              <div className="add-edit-project-grid">
                <div>
                  <label className="add-edit-project-label" htmlFor="auditor">
                    Auditor
                  </label>
                  <input
                    type="text"
                    id="auditor"
                    name="auditor"
                    value={auditPlan.auditor}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                    placeholder="Enter auditor name"
                  />
                </div>

                <div>
                  <label className="add-edit-project-label" htmlFor="auditees">
                    Auditees
                  </label>
                  <div>
                    <ReactTags
                      tags={auditPlan.auditees}
                      handleDelete={handleDelete}
                      handleAddition={handleAddition}
                      delimiters={delimiters}
                      placeholder="Add auditees"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="add-edit-project-label"
                    htmlFor="auditscope"
                  >
                    Audit Scope
                  </label>
                  <input
                    type="text"
                    id="auditscope"
                    name="auditscope"
                    value={auditPlan.auditscope}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                    placeholder="Enter audit scope"
                  />
                </div>

                <div>
                  <label
                    className="add-edit-project-label"
                    htmlFor="auditorcompany"
                  >
                    Auditor Company
                  </label>
                  <input
                    type="text"
                    id="auditorcompany"
                    name="auditorcompany"
                    placeholder="Enter Auditor Company"
                    value={auditPlan.auditorcompany}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                  />
                </div>
                <div>
                  <label className="add-edit-project-label" htmlFor="fromdate">
                    Audit Start Date
                  </label>
                  <input
                    type="date"
                    id="fromdate"
                    name="fromdate"
                    value={
                      auditPlan.fromdate ? auditPlan.fromdate.split("T")[0] : ""
                    } // Format date for input field
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                  />
                </div>
                <div>
                  <label className="add-edit-project-label" htmlFor="todate">
                    Audit End Date
                  </label>
                  <input
                    type="date"
                    id="todate"
                    name="todate"
                    value={
                      auditPlan.todate ? auditPlan.todate.split("T")[0] : ""
                    } // Format date for input field
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                  />
                </div>

                {/* Include the rest of your inputs here */}
              </div>

              <div>
                <input
                  className="btn btn-round btn-signup"
                  type="submit"
                  value={auditplanid ? "Update" : "Save"}
                />
                <Link
                  to="/auditplan"
                  state={{ evidenceId, projectId, assessmentId, project }}
                  className="add-edit-project-link"
                >
                  <input
                    className="btn btn-round btn-signup"
                    type="button"
                    value="Go back"
                  />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditAuditPlan;
