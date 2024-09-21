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
  const userId = sessionStorage.getItem("user_id");
  const location = useLocation();
  const { organizationName, organizationId } = location.state || {};

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

  const [Obj, setObject] = useState([]);
  const [objType, setObjectType] = useState([]);
  const [stake, setStake] = useState([]);
  const [tech, setTech] = useState([]);
  const [env, setEnv] = useState([]);
  const [them, setThem] = useState([]);
  const [themActivity, setThemActivity] = useState([]);
  const [isue, setIsue] = useState([]);
  const [proj, setProj] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [respGroup, setRespGroup] = useState([]);
  const [respCenter, setRespCenter] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          respGroupData,
          respCenterData,
          objectName,
          objectType,
          stakeData,
          techData,
          envData,
          themData,
          themActivityData,
          // isueData,
          projData,
          projectTypeData,
        ] = await Promise.all([
          axios.get(API.GET_RESPONSIBILITYGROUP_API),
          axios.get(API.GET_RESPONSIBILITYCENTER_API),
          axios.get(API.GET_OBJECT_API),
          axios.get(API.GET_OBJECTTYPE_API),
          axios.get(API.GET_STAKEHOLDER_API),
          axios.get(API.GET_TECHNOLOGY_API),
          axios.get(API.GET_ENVIRONMENT_API),
          axios.get(API.GET_THEMEMASTER_API),
          axios.get(API.GET_THEMEACTIVITY_API),
          // axios.get(API.GET_ISSUE_API),
          axios.get(API.GET_PROJECTCATEGORY_API),
          axios.get(API.GET_PROJECTTYPE_API),
        ]);

        setRespGroup(respGroupData.data);
        setRespCenter(respCenterData.data);
        setObject(objectName.data);
        setObjectType(objectType.data);
        setStake(stakeData.data);
        setTech(techData.data);
        setEnv(envData.data);
        setThem(themData.data);
        setThemActivity(themActivityData.data);
        // setIsue(isueData.data);
        setProj(projData.data);
        setProjectType(projectTypeData.data);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching data");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectname || !projectcode || !auditdate || !audittime) {
      toast.error("Please provide all the required fields ");
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
        organizationid: organizationId,
      };

      if (!projectdetailsid) {
        axios
          .post(API.POST_PROJECTDETAILS_API, payload)
          .then(() => {
            setState(initialState);
            toast.success("Project Details Added");
            setTimeout(
              () =>
                navigate("/projectdetails", {
                  state: { userId, organizationName },
                }),
              500
            );
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_PROJECTDETAILS(projectdetailsid), payload)
          .then(() => {
            setState(initialState);
            toast.success("Project Details Updated");
            setTimeout(
              () =>
                navigate("/projectdetails", {
                  state: { userId, organizationName: organization },
                }),
              500
            );
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
                disabled
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
              <select
                id="objecttype"
                name="objecttype"
                value={objecttype || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Object Type</option>
                {objType.map((item) => (
                  <option key={item.objecttypeid} value={item.objecttype}>
                    {item.objecttype}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="object" className="add-edit-project-label">
                Object
              </label>
              <select
                id="object"
                name="object"
                value={object || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Object</option>
                {Obj.map((item) => (
                  <option key={item.objectid} value={item.objectname}>
                    {item.objectname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="stakeholder" className="add-edit-project-label">
                Stakeholder
              </label>
              <select
                id="stakeholder"
                name="stakeholder"
                value={stakeholder || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Stakeholder</option>
                {stake.map((item) => (
                  <option key={item.stakeholderid} value={item.stakeholdername}>
                    {item.stakeholdername}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="technology" className="add-edit-project-label">
                Technology
              </label>

              {/**************************************************** */}
              <select
                id="technology"
                name="technology"
                value={technology || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Technology</option>
                {tech.map((item) => (
                  <option key={item.technologyid} value={item.technologyname}>
                    {item.technologyname}
                  </option>
                ))}
              </select>

              {/***************************************************** */}
            </div>
            <div>
              <label htmlFor="environment" className="add-edit-project-label">
                Environment
              </label>
              <select
                id="environment"
                name="environment"
                value={environment || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Environment</option>
                {env.map((item) => (
                  <option key={item.environmentid} value={item.environmentname}>
                    {item.environmentname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="theme" className="add-edit-project-label">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={theme || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Theme</option>
                {them.map((item) => (
                  <option key={item.thememasterid} value={item.themename}>
                    {item.themename}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="themeactivity" className="add-edit-project-label">
                Theme Activity
              </label>
              <select
                id="themeactivity"
                name="themeactivity"
                value={themeactivity || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Theme Activity</option>
                {themActivity.map((item) => (
                  <option key={item.themeactivityid} value={item.activity}>
                    {item.activity}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="issue" className="add-edit-project-label">
                Issue
              </label>
              <select
                id="issue"
                name="issue"
                value={issue || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Issue</option>
                {isue.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="project_category"
                className="add-edit-project-label"
              >
                Project Category
              </label>
              <select
                id="project_category"
                name="project_category"
                value={project_category || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Project Category</option>
                {proj.map((item) => (
                  <option
                    key={item.projectcategoryid}
                    value={item.projectcategory}
                  >
                    {item.projectcategory}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="project_type" className="add-edit-project-label">
                Project Type
              </label>
              <select
                id="project_type"
                name="project_type"
                value={project_type || ""}
                onChange={handleInputChange}
                className="add-edit-project-input"
              >
                <option value="">Select Project Type</option>
                {projectType.map((item) => (
                  <option key={item.projecttypeid} value={item.projecttype}>
                    {item.projecttype}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="responsibilitycenter"
                className="add-edit-project-label"
              >
                Responsibility Center
              </label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitycenter"
                name="responsibilitycenter"
                value={responsibilitycenter || ""}
                onChange={handleInputChange}
                className="add-edit-project-select"
              >
                <option value="">Responsibilty Center</option>
                {respCenter.map((respcenter) => (
                  <option
                    key={respcenter.responsibilitycenterid}
                    value={respcenter.responsibilitycentername}
                  >
                    {respcenter.responsibilitycentername}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="responsibilitygroup"
                className="add-edit-project-label"
              >
                Responsibility Group
              </label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitygroup"
                name="responsibilitygroup"
                value={responsibilitygroup || ""}
                onChange={handleInputChange}
                className="add-edit-project-select"
              >
                <option value="">Responsibilty Group</option>
                {respGroup.map((respgroup) => (
                  <option
                    key={respgroup.responsibilitygroupid}
                    value={respgroup.responsibilitygroupname}
                  >
                    {respgroup.responsibilitygroupname}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <input
              className="btn btn-round btn-signup"
              type="submit"
              value={projectdetailsid ? "Update" : "Save"}
            />
            <Link
              to="/projectdetails"
              state={{ userId, organizationName }}
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

export default AddEditProjectDetails;
