import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Evidence.css";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import * as API from "../../Endpoints/Endpoints"; // Adjust the import path as needed
import Pagination from "../../components/Pagination/Pagination";
import { toast } from "react-toastify";
import { useProjectDetails } from "../../components/Hooks/useProjectDetails";
import { useOrganizationDetails } from "../../components/Hooks/useOrganizationDetails";

const Evidence = () => {
  const userId = localStorage.getItem("user_id");
  const location = useLocation();
  const { projectId } = location.state || {};
  // const [data, setData] = useState([]);
  // const [organization, setOrganization] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [state, setState] = useState([]);

  // useEffect(() => {
  //   if (projectId) {
  //     const fetchProjectData = async () => {
  //       try {
  //         const response = await axios.get(
  //           API.GET_SPECIFIC_PROJECTDETAILS(projectId)
  //         );
  //         if (response.data.length > 0) {
  //           setData(response.data[0]);
  //         } else {
  //           setError("No project data found.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching project data:", error);
  //         setError("Failed to fetch project data. Please try again later.");
  //       }
  //     };

  //     fetchProjectData();
  //   } else {
  //     console.warn("No projectId provided");
  //   }
  // }, [projectId]);

  // useEffect(() => {
  //   if (data.organization) {
  //     const fetchOrganizationData = async () => {
  //       try {
  //         const response = await axios.get(
  //           API.GET_ORGANIZATION_BYNAME(data.organization)
  //         );
  //         setOrganization(response.data[0]);
  //       } catch (error) {
  //         console.error("Error fetching organization data:", error);
  //         setError("Failed to fetch organization data.");
  //       }
  //     };

  //     fetchOrganizationData();
  //   }
  // }, [data.organization]);

  useEffect(() => {
    loadData();
  }, [userId]); // Added organizationName to dependency array

  const loadData = async () => {
    try {
      const response = await axios.get(
        API.GET_EVIDENCE_BYUSERID(userId, projectId)
      );
      const sortedData = response.data.sort(
        (a, b) => b.evidenceid - a.evidenceid
      );
      setState(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  // Function to format dates safely

  const { data, error: projectError } = useProjectDetails(projectId);
  const { organization, error: organizationError } = useOrganizationDetails(
    data.organization
  );

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    }
    return "N/A";
  };
  const deleteEvidence = async (evidenceid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_EVIDENCE_API(evidenceid)
        );
        if (response.status === 200) {
          toast.success("Evidence Deleted Successfully");
          loadData();
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the project.");
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
          {" "}
          <div>
            <div>
              <h1 className="text-center mb-4 mt-4">Governance Details</h1>
            </div>
            <div
              className="table-responsive mb-4"
              style={{ maxWidth: "85%", margin: "0 auto", marginRight: "0" }}
            >
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Governance Group</th>
                    <th scope="col">Thrust Area</th>
                    <th scope="col">Control</th>
                    <th scope="col">Sub-Control </th>
                    <th scope="col">Expected Evidence </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 && (
                    <tr key={currentItems[0].evidenceid}>
                      <td>{indexOfFirstItem + 1}</td>{" "}
                      {/* Since you're only showing the first item, index is 0 */}
                      <td>{currentItems[0].governancegroup}</td>
                      <td>{currentItems[0].thrustarea}</td>
                      <td>{currentItems[0].controlname}</td>
                      <td>{currentItems[0].subcontrolname}</td>
                      <td>{currentItems[0].expectedevidence}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <hr
              style={{
                margin: "0 auto",
                border: "3px solid #212121",
                maxWidth: "85%",
                marginRight: "0",
              }}
            />
          </div>
          <div className="mb-4 d-flex justify-content-end mt-4">
            <Link to="/evidence/add" state={{ projectId }}>
              <div className="input-group center">
                <button className="btn btn-round btn-signup">
                  Add Evidence
                </button>
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
                  <th scope="col">Evidence Reference Link</th>
                  <th scope="col">Evidence Remark</th>
                  <th scope="col">Evidence Status</th>
                  <th scope="col">Evidence Upload</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.evidenceid}>
                    <td>{index + indexOfFirstItem + 1}</td>
                    <td>
                      <a
                        style={{ color: "blue" }}
                        href={item.evidencereferencelink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.evidencereferencelink}
                      </a>
                    </td>
                    <td>{item.evidenceremark}</td>
                    <td>{item.evidencestatus}</td>
                    <td>{item.uploadevidence}</td>
                    <td>
                      <Link
                        to={`/evidence/${item.evidenceid}`}
                        state={{ projectId }}
                      >
                        <FaEdit size={24} />
                      </Link>

                      <MdDelete
                        size={24}
                        onClick={() => deleteEvidence(item.evidenceid)}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      />
                      <Link
                        to="/assessment"
                        state={{ projectId, evidenceId: item.evidenceid }}
                      >
                        <div>
                          <button className="btn btn-round btn-signup ml-2">
                            Assessment
                          </button>
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
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

export default Evidence;
