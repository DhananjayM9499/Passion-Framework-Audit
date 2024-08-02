import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  responsibilitycentername: "",
};

const AddEditResponsibilityCenter = () => {
  const [state, setState] = useState(initialState);
  const { responsibilitycentername } = state;
  const navigate = useNavigate();
  const { responsibilitycenterid } = useParams();

  useEffect(() => {
    if (responsibilitycenterid) {
      axios
        .get(API.GET_SPECIFIC_RESPONSIBILITYCENTER(responsibilitycenterid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [responsibilitycenterid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!responsibilitycentername) {
      toast.error("Please provide all the inputs");
    } else {
      if (!responsibilitycenterid) {
        axios
          .post(API.POST_RESPONSIBILITYCENTER_API, {
            responsibilitycentername,
          })
          .then(() => {
            setState(initialState);
            toast.success("Responsibility Center  Added");
            setTimeout(() => navigate("/responsibilitycenter"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(
            API.UPDATE_SPECIFIC_RESPONSIBILITYCENTER(responsibilitycenterid),
            {
              responsibilitycentername,
            }
          )
          .then(() => {
            setState(initialState);
            toast.success("Responsibility Center  Added");
            setTimeout(() => navigate("/responsibilitycenter"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Responsibility Center</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="responsibilitycentername">
            Responsibility Center
          </label>
          <input
            type="text"
            id="responsibilitycentername"
            name="responsibilitycentername"
            placeholder="Enter the Responsibility Center"
            value={responsibilitycentername || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={responsibilitycenterid ? "Update" : "Save"}
          />
          <Link to="/responsibilitycenter">
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

export default AddEditResponsibilityCenter;
