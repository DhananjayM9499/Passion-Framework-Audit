import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import Navbar from "../../components/Navbar/Navbar";

const initialState = {
  environmentname: "",
  environmentdescription: "",
};

const AddEditEnvironment = () => {
  const [state, setState] = useState(initialState);
  const { environmentname, environmentdescription } = state;
  const navigate = useNavigate();
  const { environmentid } = useParams();

  useEffect(() => {
    if (environmentid) {
      axios
        .get(API.GET_SPECIFIC_ENVIRONMENT(environmentid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [environmentid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!environmentname || !environmentdescription) {
      toast.error("Please provide all the inputs");
    } else {
      if (!environmentid) {
        axios
          .post(API.POST_ENVIRONMENT_API, {
            environmentname,
            environmentdescription,
          })
          .then(() => {
            setState(initialState);
            toast.success("Environment Details Added");
            setTimeout(() => navigate("/environment"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_ENVIRONMENT(environmentid), {
            environmentname,
            environmentdescription,
          })
          .then(() => {
            setState(initialState);
            toast.success("Company Details Updated");
            setTimeout(() => navigate("/environment"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Environment Details</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="environmentname">Organization</label>
          <input
            type="text"
            id="environmentname"
            name="environmentname"
            placeholder="Enter the Environment Name"
            value={environmentname || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="contactname">Description</label>
          <input
            type="text"
            id="environmentdescription"
            name="environmentdescription"
            placeholder="Enter the description"
            value={environmentdescription || ""}
            onChange={handleInputChange}
          />
          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={environmentid ? "Update" : "Save"}
          />
          <Link to="/environment">
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

export default AddEditEnvironment;
