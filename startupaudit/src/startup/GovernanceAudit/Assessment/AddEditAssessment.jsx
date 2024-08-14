import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints"; // Adjust the import path as needed
import { toast } from "react-toastify";

const initialState = {
  assessmentreferencelink: "",
  assessmentupload: "",
  assessmentremark: "",
  assessmentstatus: "",
  assessmentscore: null,
};

const AddEditAssessment = () => {
  const userId = localStorage.getItem("user_id");
  const location = useLocation();
  const { projectId, evidenceId } = location.state || {};
  const { assessmentid } = useParams();
  const [data, setData] = useState([]);
  const [organization, setOrganization] = useState({});
  const [error, setError] = useState(null);
  const [assess, Setassess] = useState(initialState);

  const [state, setState] = useState([]);
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
        const sortedData = Array.isArray(response.data)
          ? response.data.sort((a, b) => b.evidenceid - a.evidenceid)
          : [];
        setState(sortedData);
      } catch (error) {
        console.error("Error loading data:", error);
        setState([]); // Set an empty array if there's an error
      }
    };

    loadEvidence();
  }, [projectId, data.organization]);

  useEffect(() => {
    if (assessmentid) {
      loadData();
    }
  }, [assessmentid]); // Added organizationName to dependency array

  const loadData = async () => {
    try {
      const response = await axios.get(
        API.GET_SPECIFIC_ASSESSMENT(assessmentid)
      );

      Setassess(response.data[0]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      assessmentreferencelink,
      assessmentupload,
      assessmentremark,
      assessmentstatus,
      assessmentscore,
    } = assess;

    if (
      !assessmentreferencelink ||
      !assessmentupload ||
      !assessmentremark ||
      !assessmentstatus ||
      !assessmentscore
    ) {
      toast.error("Please provide all the required fields");
      return;
    }

    try {
      const apiEndpoint = assessmentid
        ? API.UPDATE_SPECIFIC_ASSESSMENT(assessmentid)
        : API.POST_ASSESSMENT_API;
      const method = assessmentid ? axios.put : axios.post;
      const response = await method(apiEndpoint, {
        ...assess,
        evidenceid: evidenceId,
        user_id: userId,
      });

      if (response.status === 200) {
        toast.success(
          assessmentid
            ? "Assessment updated successfully!"
            : "Assessment saved successfully!"
        );
        Setassess(initialState);
        setTimeout(
          () =>
            navigate("/assessment", {
              state: { userId, evidenceId, projectId },
            }),
          500
        );
      } else {
        toast.error("Failed to save evidence.");
      }
    } catch (err) {
      toast.error("An error occurred: " + err.message);
    }
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    Setassess((prevState) => ({ ...prevState, [name]: value }));
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
          <h1 className="text-center mb-4 mt-4">Governance Details</h1>

          <div
            className="table-responsive mb-4"
            style={{ maxWidth: "85%", margin: "0 auto", marginRight: "0" }}
          >
            <div>
              <table className="table table-bordered table-hover">
                <tbody>
                  {state.map((item, index) => (
                    <React.Fragment key={item.evidenceid}>
                      {/* First Row - Headers */}
                      <tr className="thead-dark">
                        <th scope="col">No.</th>
                        <th scope="col">Governance Group</th>
                        <th scope="col">Thrust Area</th>
                        <th scope="col">Control</th>
                        <th scope="col">Sub-Control</th>
                        <th scope="col">Expected Evidence</th>
                      </tr>

                      {/* Second Row - Data */}
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.governancegroup}</td>
                        <td>{item.thrustarea}</td>
                        <td>{item.controlname}</td>
                        <td>{item.subcontrolname}</td>
                        <td>{item.expectedevidence}</td>
                      </tr>

                      {/* Third Row - Second Set of Headers */}
                      <tr className="thead-dark">
                        <th scope="col" colSpan="2">
                          Evidence Reference Link
                        </th>
                        <th scope="col" colSpan="2">
                          Evidence Remark
                        </th>
                        <th scope="col">Evidence Status</th>
                        <th scope="col">Evidence Upload</th>
                      </tr>

                      {/* Fourth Row - Second Set of Data */}
                      <tr>
                        <td colSpan="2">{item.evidencereferencelink}</td>
                        <td colSpan="2">{item.evidenceremark}</td>
                        <td>{item.evidencestatus}</td>
                        <td>{item.uploadevidence}</td>
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
                  <label
                    className="add-edit-project-label"
                    htmlFor="assessmentreferencelink"
                  >
                    Assessment Reference Link
                  </label>
                  <input
                    type="text"
                    id="assessmentreferencelink"
                    name="assessmentreferencelink"
                    value={assess.assessmentreferencelink}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                    placeholder="Enter assessment reference link"
                  />
                </div>
                <div>
                  <label
                    className="add-edit-project-label"
                    htmlFor="assessmentremark"
                  >
                    Assessment Remark
                  </label>
                  <input
                    type="text"
                    id="assessmentremark"
                    name="assessmentremark"
                    value={assess.assessmentremark}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                    placeholder="Enter assessment remark"
                  />
                </div>
                <div>
                  <label
                    className="add-edit-project-label"
                    htmlFor="assessmentstatus"
                  >
                    Assessment Status
                  </label>
                  <input
                    type="text"
                    id="assessmentstatus"
                    name="assessmentstatus"
                    value={assess.assessmentstatus}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                    placeholder="Enter assessment status"
                  />
                </div>
                <div>
                  <label
                    className="add-edit-project-label"
                    htmlFor="assessmentupload"
                  >
                    Upload Assessment
                  </label>
                  <input
                    type="text"
                    id="assessmentupload"
                    name="assessmentupload"
                    value={assess.assessmentupload}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                    placeholder="Upload assessment file link"
                  />
                </div>
                <div>
                  <label
                    className="add-edit-project-label"
                    htmlFor="assessmentscore"
                  >
                    Assessment Score
                  </label>
                  <input
                    type="number"
                    id="assessmentscore"
                    name="assessmentscore"
                    value={assess.assessmentscore}
                    onChange={handleInputChange}
                    className="add-edit-project-input"
                    placeholder="Enter assessment score"
                  />
                </div>
              </div>
              <div>
                <input
                  className="btn btn-round btn-signup"
                  type="submit"
                  value={assessmentid ? "Update" : "Save"}
                />
                <Link
                  to="/assessment"
                  state={{ projectId, evidenceId }}
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

export default AddEditAssessment;
