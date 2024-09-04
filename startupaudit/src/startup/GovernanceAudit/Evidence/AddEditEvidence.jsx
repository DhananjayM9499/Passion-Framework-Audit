import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Evidence.css";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import { toast } from "react-toastify";

const initialState = {
  governancegroup: "",
  thrustarea: "",
  controlname: "",
  controlwt: "",
  subcontrolname: "",
  subcontrolwt: "",
  expectedevidence: "",
  evidencereferencelink: "",
  evidenceremark: "",
  evidencestatus: "",
  uploadevidence: "",
};

const AddEditEvidence = () => {
  const userId = sessionStorage.getItem("user_id");
  const location = useLocation();
  const { projectId } = location.state || {};
  const { evidenceid } = useParams();
  const [data, setData] = useState([]);
  const [project, setProject] = useState({});
  const [organization, setOrganization] = useState({});
  const [filteredThrustAreas, setFilteredThrustAreas] = useState([]);
  const [filteredControlNames, setFilteredControlNames] = useState([]);
  const [filteredSubcontrolNames, setFilteredSubcontrolNames] = useState([]);
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvidenceData = async () => {
      if (evidenceid) {
        try {
          const response = await axios.get(
            API.GET_SPECIFIC_EVIDENCE(evidenceid)
          );
          if (response.data.length > 0) {
            setState(response.data[0]);
          } else {
            setError("Evidence data not found.");
          }
        } catch (error) {
          console.error("Error fetching evidence by ID:", error);
          setError("Failed to fetch evidence data.");
        }
      }
    };

    fetchEvidenceData();
  }, [evidenceid]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (projectId) {
        try {
          const response = await axios.get(
            API.GET_SPECIFIC_PROJECTDETAILS(projectId)
          );
          if (response.data.length > 0) {
            setProject(response.data[0]);
          } else {
            setError("No project data found.");
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
          setError("Failed to fetch project data. Please try again later.");
        }
      }
    };

    fetchProjectData();
  }, [projectId]);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (project.organization) {
        try {
          const response = await axios.get(
            API.GET_ORGANIZATION_BYNAME(project.organization)
          );
          setOrganization(response.data[0] || {});
        } catch (error) {
          console.error("Error fetching organization data:", error);
          setError("Failed to fetch organization data.");
        }
      }
    };

    fetchOrganizationData();
  }, [project.organization]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(API.GET_GOVERNANCECONTROL_API);
        if (Array.isArray(response.data)) {
          setData(response.data.sort((a, b) => b.controlid - a.controlid));
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading governance controls");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGovernanceGroupChange = (e) => {
    const selectedGroup = e.target.value;
    setState({ ...state, governancegroup: selectedGroup });

    const thrustAreas = data
      .filter((item) => item.groupname === selectedGroup)
      .map((item) => item.thrustarea)
      .filter((value, index, self) => self.indexOf(value) === index);

    setFilteredThrustAreas(thrustAreas);
    setFilteredControlNames([]);
    setFilteredSubcontrolNames([]);
  };

  const handleThrustAreaChange = (e) => {
    const selectedThrustArea = e.target.value;
    setState({ ...state, thrustarea: selectedThrustArea });

    const controlNames = data
      .filter((item) => item.thrustarea === selectedThrustArea)
      .map((item) => ({ name: item.controlname, weight: item.controlwt }))
      .filter(
        (value, index, self) =>
          self.findIndex((v) => v.name === value.name) === index
      );

    setFilteredControlNames(controlNames);
    setFilteredSubcontrolNames([]);
  };

  const handleControlNameChange = (e) => {
    const selectedControl = e.target.value;
    setState({ ...state, controlname: selectedControl });

    const subcontrolNames = data
      .filter((item) => item.controlname === selectedControl)
      .map((item) => ({
        name: item.subcontrolname,
        evidence: item.evidence,
        weight: item.subcontrolwt,
      }))
      .filter(
        (value, index, self) =>
          self.findIndex((v) => v.name === value.name) === index
      );

    setFilteredSubcontrolNames(subcontrolNames);

    const controlWeight =
      filteredControlNames.find((control) => control.name === selectedControl)
        ?.weight || "";
    setState((prevState) => ({ ...prevState, controlwt: controlWeight }));
  };

  const handleSubcontrolNameChange = (e) => {
    const selectedSubcontrol = e.target.value;
    const selectedSubcontrolData =
      filteredSubcontrolNames.find(
        (subcontrol) => subcontrol.name === selectedSubcontrol
      ) || {};

    setState((prevState) => ({
      ...prevState,
      subcontrolname: selectedSubcontrol,
      subcontrolwt: selectedSubcontrolData.weight || "",
      expectedevidence: selectedSubcontrolData.evidence || "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      expectedevidence,
      evidencereferencelink,
      evidenceremark,
      evidencestatus,
      uploadevidence,
    } = state;

    if (
      !expectedevidence ||
      !evidencereferencelink ||
      !evidenceremark ||
      !evidencestatus ||
      !uploadevidence
    ) {
      toast.error("Please provide all the required fields");
      return;
    }

    try {
      const apiEndpoint = evidenceid
        ? API.UPDATE_SPECIFIC_EVIDENCE(evidenceid)
        : API.POST_EVIDENCE_API;
      const method = evidenceid ? axios.put : axios.post;
      const response = await method(apiEndpoint, {
        ...state,
        projectdetailsid: projectId,
        user_id: userId,
        expectedevidence,
      });

      if (response.status === 200) {
        toast.success(
          evidenceid
            ? "Evidence updated successfully!"
            : "Evidence saved successfully!"
        );
        setState(initialState);
        setTimeout(
          () => navigate("/evidence", { state: { userId, projectId } }),
          500
        );
      } else {
        toast.error("Failed to save evidence.");
      }
    } catch (err) {
      toast.error("An error occurred: " + err.message);
    }
  };

  const uniqueGovernanceGroups = Array.from(
    new Set(data.map((item) => item.groupname))
  );

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    }
    return "N/A";
  };

  const formatTime = (timeString) => {
    if (timeString) {
      const [hours, minutes, secondsWithOffset] = timeString.split(":");
      const [seconds] = secondsWithOffset.split("+");
      return `${hours}:${minutes}:${seconds}`;
    }
    return "N/A";
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
            <h2>{project.organization || "N/A"}</h2>

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
              <b>Project Name : </b> {project.projectname || "N/A"}
            </p>
            <p>
              <b>Project Code : </b> {project.projectcode || "N/A"}
            </p>
            <p>
              <b>Project Category : </b> {project.project_category || "N/A"}
            </p>
            <p>
              <b>Project Type : </b> {project.project_type || "N/A"}
            </p>
          </div>
          <div className="col mt-4">
            <p>
              <b>Audit Time : </b> {formatTime(project.audittime) || "N/A"}
            </p>

            <p>
              <b>Responsibility Center : </b>{" "}
              {project.responsibilitycenter || "N/A"}
            </p>
            <p>
              <b>Responsibility Group : </b>{" "}
              {project.responsibilitygroup || "N/A"}
            </p>
          </div>
          <div className="col mt-4">
            <p>
              <b>Stakeholder : </b> {project.stakeholder || "N/A"}
            </p>
            <p>
              <b>Technology : </b> {project.technology || "N/A"}
            </p>

            <p>
              <b>Theme : </b> {project.theme || "N/A"}
            </p>
            <p>
              <b>Theme Activity : </b> {project.themeactivity || "N/A"}
            </p>
            <p>
              <b>Audit Date : </b> {formatDate(project.auditdate) || "N/A"}
            </p>
          </div>
          <div className="col mt-4">
            <p>
              <b>Environment : </b> {project.environment || "N/A"}
            </p>
            <p>
              <b>Issue : </b> {project.issue || "N/A"}
            </p>
            <p>
              <b>Object : </b> {project.object || "N/A"}
            </p>
            <p>
              <b>Object Type : </b> {project.objecttype || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="add-edit-project-container">
        <form onSubmit={handleSubmit}>
          <div className="add-edit-project-grid">
            <div>
              <label
                className="add-edit-project-label"
                htmlFor="governancegroup"
              >
                Governance Group
              </label>
              <select
                id="governancegroup"
                name="governancegroup"
                value={state.governancegroup}
                onChange={handleGovernanceGroupChange}
                className="add-edit-project-select"
              >
                <option value="">Select Governance Group</option>
                {uniqueGovernanceGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="add-edit-project-label" htmlFor="thrustarea">
                Thrust Area
              </label>
              <select
                id="thrustarea"
                name="thrustarea"
                value={state.thrustarea}
                onChange={handleThrustAreaChange}
                className="add-edit-project-select"
              >
                <option value="">Select Thrust Area</option>
                {filteredThrustAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="add-edit-project-label" htmlFor="controlname">
                Control Name
              </label>
              <select
                id="controlname"
                name="controlname"
                value={state.controlname}
                onChange={handleControlNameChange}
                className="add-edit-project-select"
              >
                <option value="">Select Control Name</option>
                {filteredControlNames.map((control) => (
                  <option key={control.name} value={control.name}>
                    {control.name} (Weight: {control.weight || "N/A"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="add-edit-project-label" htmlFor="controlwt">
                Control Weight
              </label>
              <input
                type="text"
                id="controlwt"
                name="controlwt"
                value={state.controlwt}
                onChange={handleInputChange}
                className="add-edit-project-input"
                readOnly
              />
            </div>

            <div>
              <label
                className="add-edit-project-label"
                htmlFor="subcontrolname"
              >
                Sub-Control Name
              </label>
              <select
                id="subcontrolname"
                name="subcontrolname"
                value={state.subcontrolname}
                onChange={handleSubcontrolNameChange}
                className="add-edit-project-select"
              >
                <option value="">Select Sub-Control Name</option>
                {filteredSubcontrolNames.map((subcontrol) => (
                  <option key={subcontrol.name} value={subcontrol.name}>
                    {subcontrol.name} (Weight: {subcontrol.weight || "N/A"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="add-edit-project-label" htmlFor="subcontrolwt">
                Sub-Control Weight
              </label>
              <input
                type="text"
                id="subcontrolwt"
                name="subcontrolwt"
                value={state.subcontrolwt}
                onChange={handleInputChange}
                className="add-edit-project-input"
                readOnly
              />
            </div>

            <div>
              <label className="add-edit-project-label" htmlFor="evidence">
                Expected Evidence
              </label>
              <input
                type="text"
                id="evidence"
                name="evidence"
                value={state.evidence || state.expectedevidence}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>

            <div>
              <label
                className="add-edit-project-label"
                htmlFor="evidencereferencelink"
              >
                Evidence Reference Link
              </label>
              <input
                type="text"
                id="evidencereferencelink"
                name="evidencereferencelink"
                value={state.evidencereferencelink}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>

            <div>
              <label
                className="add-edit-project-label"
                htmlFor="evidenceremark"
              >
                Evidence Remark
              </label>
              <input
                type="text"
                id="evidenceremark"
                name="evidenceremark"
                value={state.evidenceremark}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>

            <div>
              <label
                className="add-edit-project-label"
                htmlFor="evidencestatus"
              >
                Evidence Status
              </label>
              <select
                type="text"
                id="evidencestatus"
                name="evidencestatus"
                value={state.evidencestatus}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Status</option>
                <option value="Fully Compliant">Fully Compliant</option>{" "}
                <option value="Major Non-Compliant">Major Non-Compliant</option>{" "}
                <option value="Minor Non-Compliant">Minor Non-Compliant</option>
                <option value="Observation">Observation</option>
                <option value="Suggestions">Suggestions</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label
                className="add-edit-project-label"
                htmlFor="uploadevidence"
              >
                Upload Evidence
              </label>
              <input
                type="text"
                id="uploadevidence"
                name="uploadevidence"
                value={state.uploadevidence}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
          </div>
          <div>
            <input
              className="btn btn-round btn-signup"
              type="submit"
              value={evidenceid ? "Update" : "Save"}
            />
            <Link
              to="/evidence"
              state={{ projectId }}
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
  );
};

export default AddEditEvidence;
