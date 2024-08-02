import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../../Endpoints/Endpoints";
import Navbar from "../../../../components/Navbar/Navbar";

const initialState = {
  projecttype: "",
};

const AddEditProjectType = () => {
  const [state, setState] = useState(initialState);
  const { projecttype } = state;
  const navigate = useNavigate();
  const { projecttypeid } = useParams();

  useEffect(() => {
    if (projecttypeid) {
      axios
        .get(API.GET_SPECIFIC_PROJECTTYPE(projecttypeid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [projecttypeid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projecttype) {
      toast.error("Please provide all the inputs");
    } else {
      if (!projecttypeid) {
        axios
          .post(API.POST_PROJECTTYPE_API, {
            projecttype,
          })
          .then(() => {
            setState(initialState);
            toast.success("Project Type  Added");
            setTimeout(() => navigate("/projecttype"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_PROJECTTYPE(projecttypeid), {
            projecttype,
          })
          .then(() => {
            setState(initialState);
            toast.success("Project Type Updated");
            setTimeout(() => navigate("/projecttype"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Project Type Details</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="projecttype">Project Type</label>
          <input
            type="text"
            id="projecttype"
            name="projecttype"
            placeholder="Enter the Project Type"
            value={projecttype || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={projecttypeid ? "Update" : "Save"}
          />
          <Link to="/projecttype">
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

export default AddEditProjectType;
