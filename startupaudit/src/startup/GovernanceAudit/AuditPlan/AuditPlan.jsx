import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import * as API from "../../Endpoints/Endpoints"; // Adjust the import path as needed
import Pagination from "../../components/Pagination/Pagination";
import { toast } from "react-toastify";
import { useProjectDetails } from "../../components/Hooks/useProjectDetails";
import { useOrganizationDetails } from "../../components/Hooks/useOrganizationDetails";
import NoDataAvailable from "../../components/NoDataAvailable/NoDataAvailable";

const AuditPlan = () => {
  const userId = sessionStorage.getItem("user_id");
  const location = useLocation();
  const { projectId, evidenceId, assessmentId, project } = location.state || {};
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [assess, Setassess] = useState([]);
  const [audit, Setaudit] = useState([]);
  const itemsPerPage = 3;
  const [state, setState] = useState([]);

  const { data, error: projectError } = useProjectDetails(projectId);
  const { organization, error: organizationError } = useOrganizationDetails(
    data.organization
  );

  useEffect(() => {
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
    loadAudit();
  }, [userId]); // Added organizationName to dependency array

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

  const loadAudit = async () => {
    try {
      const response = await axios.get(
        API.GET_AUDITPLAN_BYUSERID(userId, assessmentId)
      );
      const sortedData = response.data.sort(
        (a, b) => b.governanceauditid - a.governanceauditid
      );
      Setaudit(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  // Function to format dates safely
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

  const deletePlanAudit = async (auditplanid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_AUDITPLAN_API(auditplanid)
        );
        if (response.status === 200) {
          toast.success("Audit Plan Deleted Successfully");
          loadAudit();
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the Audit Plan .");
      }
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = state.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(state.length / itemsPerPage);

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
          <div className="mb-4 d-flex justify-content-end mt-4">
            <Link
              to="/auditplan/add"
              state={{ projectId, assessmentId, evidenceId, project }}
            >
              <div className="input-group center">
                <button className="btn btn-round btn-signup">Plan Audit</button>
              </div>
            </Link>
          </div>
          <div
            className="table-responsive mb-4"
            style={{ maxWidth: "85%", margin: "0 auto", marginRight: "0" }}
          >
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Auditor Company</th>

                  <th scope="col">Auditor</th>
                  <th scope="col">Auditees</th>
                  <th scope="col">Audit Scope</th>
                  <th scope="col">Audit Start Date</th>
                  <th scope="col">Audit End Date</th>

                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {audit.length === 0 ? (
                  <NoDataAvailable />
                ) : (
                  audit.map((item, index) => (
                    <tr key={item.governanceauditid}>
                      <td>{index + indexOfFirstItem + 1}</td>
                      <td>{item.auditorcompany}</td>
                      <td>{item.auditor}</td>
                      <td>
                        <ul
                          style={{
                            textAlign: "start",
                            maxHeight: "50px",
                            overflowY: "auto",
                            paddingLeft: "20px",
                            margin: 0,
                            listStylePosition: "inside",
                          }}
                        >
                          {item.auditees.map((auditee, idx) => (
                            <li key={idx}>• {auditee}</li>
                          ))}
                        </ul>
                      </td>

                      <td>{item.auditscope}</td>
                      <td>{formatDate(item.fromdate)}</td>
                      <td>{formatDate(item.todate)}</td>

                      <td>
                        <Link
                          to={`/auditplan/${item.auditplanid}`}
                          state={{ projectId, assessmentId, evidenceId }}
                        >
                          <FaEdit size={24} />
                        </Link>

                        <MdDelete
                          size={24}
                          onClick={() => deletePlanAudit(item.auditplanid)}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                        <Link
                          to="/audit"
                          state={{
                            projectId,
                            evidenceId,
                            auditPlanId: item.auditplanid,
                            assessmentId,
                          }}
                        >
                          <div>
                            <button className="btn btn-round btn-signup ml-2">
                              Audit
                            </button>
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {data.length > itemsPerPage && (
            <div className="d-flex justify-content-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditPlan;
