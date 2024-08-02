import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../../Endpoints/Endpoints";
import Navbar from "../../../../components/Navbar/Navbar";

const initialState = {
  controlname: "",
  thrustarea: "",
  controlwt: "",
  subcontrolname: "",
  groupname: "",
  evidence: "",
  subcontrolwt: "",
  controlid: "", // controlid will be auto-generated in most cases, but included here if needed
};

const AddEditGovernanceControl = () => {
  const [state, setState] = useState(initialState);
  const {
    controlname,
    thrustarea,
    controlwt,
    subcontrolname,
    groupname,
    evidence,
    subcontrolwt,
  } = state;
  const navigate = useNavigate();
  const { controlid } = useParams();

  useEffect(() => {
    if (controlid) {
      axios
        .get(API.GET_SPECIFIC_GOVERNANCECONTROL(controlid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Governance Control details:",
            error
          );
          toast.error("Failed to fetch Governance Control details");
        });
    }
  }, [controlid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !controlname ||
      !thrustarea ||
      !controlwt ||
      !subcontrolname ||
      !groupname ||
      !evidence ||
      !subcontrolwt
    ) {
      toast.error("Please provide all required fields");
      return;
    }

    const apiCall = !controlid
      ? axios.post(API.POST_GOVERNANCECONTROL_API, {
          controlname,
          thrustarea,
          controlwt,
          subcontrolname,
          groupname,
          evidence,
          subcontrolwt,
        })
      : axios.put(API.UPDATE_SPECIFIC_GOVERNANCECONTROL(controlid), {
          controlname,
          thrustarea,
          controlwt,
          subcontrolname,
          groupname,
          evidence,
          subcontrolwt,
        });

    apiCall
      .then(() => {
        setState(initialState);
        toast.success(
          `Governance control ${controlid ? "updated" : "added"} successfully`
        );
        setTimeout(() => navigate("/governancecontrol"), 500);
      })
      .catch((err) => {
        console.error("An error occurred:", err);
        toast.error("An error occurred while saving the Governance control");
      });
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>
        {controlid ? "Edit Governance Control" : "Add Governance Control"}
      </h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="controlname">Control Name</label>
          <input
            type="text"
            id="controlname"
            name="controlname"
            placeholder="Enter the Control Name"
            value={controlname || ""}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="thrustarea">Thrust Area</label>
          <input
            type="text"
            id="thrustarea"
            name="thrustarea"
            placeholder="Enter the Thrust Area"
            value={thrustarea || ""}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="controlwt">Control Weight</label>
          <input
            type="number"
            id="controlwt"
            name="controlwt"
            placeholder="Enter the Control Weight"
            value={controlwt || ""}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="subcontrolname">Subcontrol Name</label>
          <input
            type="text"
            id="subcontrolname"
            name="subcontrolname"
            placeholder="Enter the Subcontrol Name"
            value={subcontrolname || ""}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="groupname">Group Name</label>
          <input
            type="text"
            id="groupname"
            name="groupname"
            placeholder="Enter the Group Name"
            value={groupname || ""}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="evidence">Evidence</label>
          <input
            type="text"
            id="evidence"
            name="evidence"
            placeholder="Enter the Evidence"
            value={evidence || ""}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="subcontrolwt">Subcontrol Weight</label>
          <input
            type="number"
            id="subcontrolwt"
            name="subcontrolwt"
            placeholder="Enter the Subcontrol Weight"
            value={subcontrolwt || ""}
            onChange={handleInputChange}
            required
          />

          <div className="button-group">
            <button type="submit" className="btn btn-round btn-signup">
              {controlid ? "Update" : "Save"}
            </button>
            <Link to="/governancecontrol">
              <button type="button" className="btn btn-round btn-signup">
                Go Back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditGovernanceControl;
