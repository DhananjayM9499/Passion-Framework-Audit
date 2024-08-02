import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  responsibilitygroupname: "",
};

const AddEditResponsibilityGroup = () => {
  const [state, setState] = useState(initialState);
  const { responsibilitygroupname } = state;
  const navigate = useNavigate();
  const { responsibilitygroupid } = useParams();

  useEffect(() => {
    if (responsibilitygroupid) {
      axios
        .get(API.GET_SPECIFIC_RESPONSIBILITYGROUP(responsibilitygroupid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [responsibilitygroupid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!responsibilitygroupname) {
      toast.error("Please provide all the inputs");
    } else {
      if (!responsibilitygroupid) {
        axios
          .post(API.POST_RESPONSIBILITYGROUP_API, {
            responsibilitygroupname,
          })
          .then(() => {
            setState(initialState);
            toast.success("Responsibility group  Added");
            setTimeout(() => navigate("/responsibilitygroup"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_RESPONSIBILITYGROUP(responsibilitygroupid), {
            responsibilitygroupname,
          })
          .then(() => {
            setState(initialState);
            toast.success("Responsibility group  Added");
            setTimeout(() => navigate("/responsibilitygroup"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Responsibility group</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="responsibilitygroupname">Responsibility group</label>
          <input
            type="text"
            id="responsibilitygroupname"
            name="responsibilitygroupname"
            placeholder="Enter the Responsibility group"
            value={responsibilitygroupname || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={responsibilitygroupid ? "Update" : "Save"}
          />
          <Link to="/responsibilitygroup">
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

export default AddEditResponsibilityGroup;
