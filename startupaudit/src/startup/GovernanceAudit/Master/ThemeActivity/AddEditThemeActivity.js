import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  themename: " ",
  phase: " ",
  activitygroup: " ",
  activity: " ",
};

const AddEditThemeActivity = () => {
  const [state, setState] = useState(initialState);

  const { themename, phase, activitygroup, activity } = state;

  const navigate = useNavigate();

  const { themeactivityid } = useParams();

  const [grouptheme, setThemeName] = useState([]);

  const [activityGrp, setGroupActivity] = useState([]);

  const [isReadOnly] = useState(false);

  useEffect(() => {
    if (themeactivityid) {
      axios
        .get(API.GET_SPECIFIC_THEMEACTIVITY(themeactivityid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) =>
          console.error("Error fetching activity group:", error)
        );
    }
    axios
      .get(API.GET_ACTIVITYGROUP_API)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setGroupActivity(response.data);
        } else {
          console.error("Invalid response for theme data:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching theme data:", error));
    axios
      .get(API.GET_THEMEMASTER_API)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setThemeName(response.data);
        } else {
          console.error("Invalid response for theme data:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching theme data:", error));
  }, [themeactivityid]);

  const handlSubmit = (e) => {
    e.preventDefault();
    if (!themename) {
      toast.error("please provider value into each input field");
    } else {
      if (!themeactivityid) {
        axios
          .post(API.POST_THEMEACTIVITY_API, {
            themename,
            phase,
            activitygroup,
            activity,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("successfully");
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_THEMEACTIVITY(themeactivityid), {
            themename,
            phase,
            activitygroup,
            activity,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("update successfully");
      }
      setTimeout(() => navigate("/themeactivity"), 500);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div className="form-container">
      <Navbar />
      <h1>Theme Activity</h1>
      <div style={{ marginTop: " auto" }}>
        <form onSubmit={handlSubmit}>
          <div>
            <label>Theme:</label>
            <select
              type="text"
              id="themename"
              name="themename"
              value={themename || ""}
              onChange={handleInputChange}
              disabled={isReadOnly}
            >
              <option value="">Theme Name</option>
              {grouptheme.map((tname) => (
                <option key={tname.thememasterid} value={tname.themename}>
                  {tname.themename}
                </option>
              ))}
            </select>
            <br />
          </div>

          <div>
            <label>Phase:</label>
            <select
              type="text"
              id="phase"
              name="phase"
              value={phase || ""}
              onChange={handleInputChange}
              disabled={isReadOnly}
            >
              <option value="">Select Phase</option>
              <option value="Initiation">Initiation</option>
              <option value="Planning">Planning</option>
              <option value="Execution">Execution</option>
              <option value="Monitoring & Controlling">
                Monitoring & Controlling
              </option>
              <option value="Closing">Closing</option>
            </select>
            <br />
          </div>

          <div>
            <label>Activity Group:</label>
            <select
              type="text"
              id="activitygroup"
              name="activitygroup"
              value={activitygroup || ""}
              onChange={handleInputChange}
              disabled={isReadOnly}
            >
              <option value="">Activity Group</option>
              {activityGrp.map((grpactivity) => (
                <option
                  key={grpactivity.activitygroupid}
                  value={grpactivity.activitygroupname}
                >
                  {grpactivity.activitygroupname}
                </option>
              ))}
            </select>
            <br />
          </div>

          <label htmlFor="phase">Activity</label>
          <input
            type="text"
            id="activity"
            name="activity"
            placeholder="Enter activity"
            value={activity || " "}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={themeactivityid ? "Update" : "Save"}
          />
          <Link to="/themeactivity">
            <input
              className="btn btn-round btn-signup"
              type="button"
              value="Go back"
            />
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AddEditThemeActivity;
