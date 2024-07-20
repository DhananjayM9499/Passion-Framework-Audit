import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import Navbar from "../../components/Navbar/Navbar";
import "./AddEdit.css";

const initialState = {
  organization: "",
  contactname: "",
  contactemail: "",
  contactphone: "",
};

const AddEditOrganization = () => {
  const [state, setState] = useState(initialState);
  const { organization, contactname, contactemail, contactphone } = state;
  const navigate = useNavigate();
  const { organizationid } = useParams();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (organizationid) {
      axios
        .get(API.GET_SPECIFIC_ORGANIZATION(organizationid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [organizationid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!organization || !contactname || !contactemail || !contactphone) {
      toast.error("Please provide all the inputs");
    } else {
      if (!organizationid) {
        axios
          .post(API.POST_ORGANIZATION_API, {
            organization,
            contactname,
            contactemail,
            contactphone,
            userId,
          })
          .then(() => {
            setState(initialState);
            toast.success("Company Details Added");
            setTimeout(() => navigate("/organization"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_ORGANIZATION(organizationid), {
            organization,
            contactname,
            contactemail,
            contactphone,
          })
          .then(() => {
            setState(initialState);
            toast.success("Company Details Updated");
            setTimeout(() => navigate("/organization"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Organization Details</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="organization">Organization</label>
          <input
            type="text"
            id="organization"
            name="organization"
            placeholder="Enter the Organization Name"
            value={organization || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="contactname">Contact Name</label>
          <input
            type="text"
            id="contactname"
            name="contactname"
            placeholder="Enter the Contact Name"
            value={contactname || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="contactemail">Contact Email</label>
          <input
            type="text"
            id="contactemail"
            name="contactemail"
            placeholder="Enter the Contact Email"
            value={contactemail || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="contactphone">Contact Phone</label>
          <input
            type="text"
            id="contactphone"
            name="contactphone"
            placeholder="Enter the Contact Phone"
            value={contactphone || ""}
            onChange={handleInputChange}
          />
          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={organizationid ? "Update" : "Save"}
          />
          <Link to="/organization">
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

export default AddEditOrganization;
