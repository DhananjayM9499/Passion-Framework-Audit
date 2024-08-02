import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import Navbar from "../../components/Navbar/Navbar";
import "./AddEditProjectDetails.css"; // Ensure you import your updated CSS file

const initialState = {
  organization: "",
  projectname: "",
  projectcode: "",
  auditdate: "",
  audittime: "",
  objecttype: "",
  object: "",
  stakeholder: "",
  technology: "",
  environment: "",
  theme: "",
  themeactivity: "",
  issue: "",
  project_type: "",
  project_category: "",
  responsibilitycenter: "",
  responsibilitygroup: "",
};

const AddEditProjectDetails = () => {
  const [state, setState] = useState(initialState);
  const {
    organization,
    projectname,
    projectcode,
    auditdate,
    audittime,
    objecttype,
    object,
    stakeholder,
    technology,
    environment,
    theme,
    themeactivity,
    issue,
    project_type,
    project_category,
    responsibilitycenter,
    responsibilitygroup,
  } = state;

  const navigate = useNavigate();
  const { projectdetailsid } = useParams();
  const userId = localStorage.getItem("user_id");
  const location = useLocation();
  const { organizationName } = location.state || {};

  useEffect(() => {
    if (projectdetailsid) {
      axios
        .get(API.GET_SPECIFIC_PROJECTDETAILS(projectdetailsid))
        .then((resp) => {
          const projectData = resp.data[0];

          // Ensure auditdate is in yyyy-MM-dd format
          if (projectData.auditdate) {
            projectData.auditdate = new Date(projectData.auditdate)
              .toISOString()
              .split("T")[0];
          }

          // Ensure audittime is in HH:mm format if it's a valid time string
          if (projectData.audittime) {
            try {
              // Extract the time part and ignore the timezone offset
              const timePart = projectData.audittime.split("+")[0];
              const date = new Date(`1970-01-01T${timePart}`);
              if (!isNaN(date.getTime())) {
                projectData.audittime = date.toISOString().substr(11, 5); // "HH:mm"
              } else {
                // If not valid, clear audittime
                projectData.audittime = "";
              }
            } catch (error) {
              // Handle any errors that occur during date parsing
              console.error(
                "Invalid time value:",
                projectData.audittime,
                error
              );
              projectData.audittime = ""; // Set to empty string if invalid
            }
          }

          setState({ ...projectData });
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching the project details:",
            error
          );
        });
    } else if (organizationName) {
      setState((prevState) => ({
        ...prevState,
        organization: organizationName,
      }));
    }
  }, [projectdetailsid, organizationName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !organization ||
      !projectname ||
      !projectcode ||
      !auditdate ||
      !audittime
    ) {
      toast.error("Please provide all the required fields");
    } else {
      const payload = {
        organization,
        projectname,
        projectcode,
        auditdate,
        audittime,
        objecttype,
        object,
        stakeholder,
        technology,
        environment,
        theme,
        themeactivity,
        issue,
        user_id: userId,
        project_type,
        project_category,
        responsibilitycenter,
        responsibilitygroup,
      };

      if (!projectdetailsid) {
        axios
          .post(API.POST_PROJECTDETAILS_API, payload)
          .then(() => {
            setState(initialState);
            toast.success("Project Details Added");
            setTimeout(() => navigate("/projectdetails"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_PROJECTDETAILS(projectdetailsid), payload)
          .then(() => {
            setState(initialState);
            toast.success("Project Details Updated");
            setTimeout(() => navigate("/projectdetails"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="add-edit-project-container mt-5">
      <Navbar />

      <div className="mt-4">
        <form onSubmit={handleSubmit} className="add-edit-project-form">
          <div className="add-edit-project-grid">
            <div>
              <label htmlFor="organization" className="add-edit-project-label">
                Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                placeholder="Enter the Organization Name"
                value={organization || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="projectname" className="add-edit-project-label">
                Project Name
              </label>
              <input
                type="text"
                id="projectname"
                name="projectname"
                placeholder="Enter the Project Name"
                value={projectname || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="projectcode" className="add-edit-project-label">
                Project Code
              </label>
              <input
                type="text"
                id="projectcode"
                name="projectcode"
                placeholder="Enter the Project Code"
                value={projectcode || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="auditdate" className="add-edit-project-label">
                Audit Date
              </label>
              <input
                type="date"
                id="auditdate"
                name="auditdate"
                value={auditdate || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="audittime" className="add-edit-project-label">
                Audit Time
              </label>
              <input
                type="time"
                id="audittime"
                name="audittime"
                value={audittime || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="objecttype" className="add-edit-project-label">
                Object Type
              </label>
              <input
                type="text"
                id="objecttype"
                name="objecttype"
                placeholder="Enter the Object Type"
                value={objecttype || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="object" className="add-edit-project-label">
                Object
              </label>
              <input
                type="text"
                id="object"
                name="object"
                placeholder="Enter the Object"
                value={object || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="stakeholder" className="add-edit-project-label">
                Stakeholder
              </label>
              <input
                type="text"
                id="stakeholder"
                name="stakeholder"
                placeholder="Enter the Stakeholder"
                value={stakeholder || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="technology" className="add-edit-project-label">
                Technology
              </label>
              <input
                type="text"
                id="technology"
                name="technology"
                placeholder="Enter the Technology"
                value={technology || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="environment" className="add-edit-project-label">
                Environment
              </label>
              <input
                type="text"
                id="environment"
                name="environment"
                placeholder="Enter the Environment"
                value={environment || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="theme" className="add-edit-project-label">
                Theme
              </label>
              <input
                type="text"
                id="theme"
                name="theme"
                placeholder="Enter the Theme"
                value={theme || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="themeactivity" className="add-edit-project-label">
                Theme Activity
              </label>
              <input
                type="text"
                id="themeactivity"
                name="themeactivity"
                placeholder="Enter the Theme Activity"
                value={themeactivity || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="issue" className="add-edit-project-label">
                Issue
              </label>
              <input
                type="text"
                id="issue"
                name="issue"
                placeholder="Enter the Issue"
                value={issue || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label htmlFor="project_type" className="add-edit-project-label">
                Project Type
              </label>
              <input
                type="text"
                id="project_type"
                name="project_type"
                placeholder="Enter the Project Type"
                value={project_type || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label
                htmlFor="project_category"
                className="add-edit-project-label"
              >
                Project Category
              </label>
              <input
                type="text"
                id="project_category"
                name="project_category"
                placeholder="Enter the Project Category"
                value={project_category || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label
                htmlFor="responsibilitycenter"
                className="add-edit-project-label"
              >
                Responsibility Center
              </label>
              <input
                type="text"
                id="responsibilitycenter"
                name="responsibilitycenter"
                placeholder="Enter the Responsibility Center"
                value={responsibilitycenter || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
            <div>
              <label
                htmlFor="responsibilitygroup"
                className="add-edit-project-label"
              >
                Responsibility Group
              </label>
              <input
                type="text"
                id="responsibilitygroup"
                name="responsibilitygroup"
                placeholder="Enter the Responsibility Group"
                value={responsibilitygroup || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              />
            </div>
          </div>
          <div>
            <input
              className="btn btn-round btn-signup"
              type="submit"
              value={projectdetailsid ? "Update" : "Save"}
            />
            <Link to="/projectdetails" className="add-edit-project-link">
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

export default AddEditProjectDetails;
