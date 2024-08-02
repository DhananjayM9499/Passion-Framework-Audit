import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../../Endpoints/Endpoints";
import Navbar from "../../../../components/Navbar/Navbar";

const initialState = {
  projectcategory: "",
};

const ProjectCategory = () => {
  const [state, setState] = useState(initialState);
  const { projectcategory } = state;
  const navigate = useNavigate();
  const { projectcategoryid } = useParams();

  useEffect(() => {
    if (projectcategoryid) {
      axios
        .get(API.GET_SPECIFIC_PROJECTCATEGORY(projectcategoryid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [projectcategoryid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectcategory) {
      toast.error("Please provide all the inputs");
    } else {
      if (!projectcategoryid) {
        axios
          .post(API.POST_PROJECTCATEGORY_API, {
            projectcategory,
          })
          .then(() => {
            setState(initialState);
            toast.success("Project Category Details Added");
            setTimeout(() => navigate("/projectcategory"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_PROJECTCATEGORY(projectcategoryid), {
            projectcategory,
          })
          .then(() => {
            setState(initialState);
            toast.success("Project Category Details Updated");
            setTimeout(() => navigate("/projectcategory"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Project Category Details</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="projecttype">Project Category</label>
          <input
            type="text"
            id="projectcategory"
            name="projectcategory"
            placeholder="Enter the Project Category"
            value={projectcategory || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={projectcategoryid ? "Update" : "Save"}
          />
          <Link to="/projectcategory">
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

export default ProjectCategory;
