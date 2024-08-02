import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../../Endpoints/Endpoints";
import Navbar from "../../../../components/Navbar/Navbar";

const initialState = {
  groupname: "",
};

const AddEditGovernanceGroup = () => {
  const [state, setState] = useState(initialState);
  const { groupname } = state;
  const navigate = useNavigate();
  const { groupid } = useParams();

  useEffect(() => {
    if (groupid) {
      axios
        .get(API.GET_SPECIFIC_GOVERNANCEGROUP(groupid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [groupid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupname) {
      toast.error("Please provide all the inputs");
    } else {
      if (!groupid) {
        axios
          .post(API.POST_GOVERNANCEGROUP_API, {
            groupname,
          })
          .then(() => {
            setState(initialState);
            toast.success("Governance group  Added");
            setTimeout(() => navigate("/governancegroup"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_GOVERNANCEGROUP(groupid), {
            groupname,
          })
          .then(() => {
            setState(initialState);
            toast.success("Governance group  Added");
            setTimeout(() => navigate("/governancegroup"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Governance group</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="groupname">Governance group</label>
          <input
            type="text"
            id="groupname"
            name="groupname"
            placeholder="Enter the Governance group"
            value={groupname || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={groupid ? "Update" : "Save"}
          />
          <Link to="/governancegroup">
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

export default AddEditGovernanceGroup;
