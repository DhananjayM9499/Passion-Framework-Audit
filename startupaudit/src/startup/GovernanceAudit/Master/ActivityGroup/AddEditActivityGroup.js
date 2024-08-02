import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  activitygroupname: "",
};

const AddEditActivityGroup = () => {
  const [state, setState] = useState(initialState);
  const { activitygroupname } = state;
  const navigate = useNavigate();
  const { activitygroupid } = useParams();

  useEffect(() => {
    if (activitygroupid) {
      axios
        .get(API.GET_SPECIFIC_ACTIVITYGROUP(activitygroupid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [activitygroupid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!activitygroupname) {
      toast.error("Please provide all the inputs");
    } else {
      if (!activitygroupid) {
        axios
          .post(API.POST_ACTIVITYGROUP_API, {
            activitygroupname,
          })
          .then(() => {
            setState(initialState);
            toast.success("Activity group  Added");
            setTimeout(() => navigate("/activitygroup"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_ACTIVITYGROUP(activitygroupid), {
            activitygroupname,
          })
          .then(() => {
            setState(initialState);
            toast.success("Activity group  Added");
            setTimeout(() => navigate("/activitygroup"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Activity group</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="activitygroupname">Activity group</label>
          <input
            type="text"
            id="activitygroupname"
            name="activitygroupname"
            placeholder="Enter the Activity group"
            value={activitygroupname || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={activitygroupid ? "Update" : "Save"}
          />
          <Link to="/activitygroup">
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

export default AddEditActivityGroup;
