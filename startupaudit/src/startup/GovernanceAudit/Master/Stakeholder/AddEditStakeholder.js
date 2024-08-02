import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  stakeholdername: "",
  stakeholdercontact: "",
  stakeholderemail: "",
  stakeholdertype: "",
  category: "",
};

const AddEditStakeholder = () => {
  const [state, setState] = useState(initialState);
  const {
    stakeholdername,
    stakeholdercontact,
    stakeholderemail,
    stakeholdertype,
    stakeholdercategory,
  } = state;
  const navigate = useNavigate();
  const { stakeholderid } = useParams();

  useEffect(() => {
    if (stakeholderid) {
      axios
        .get(API.GET_SPECIFIC_STAKEHOLDER(stakeholderid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [stakeholderid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !stakeholdername ||
      !stakeholdercontact ||
      !stakeholderemail ||
      !stakeholdertype ||
      !stakeholdercategory
    ) {
      toast.error("Please provide all the inputs");
    } else {
      if (!stakeholderid) {
        axios
          .post(API.POST_STAKEHOLDER_API, {
            stakeholdername,
            stakeholdercontact,
            stakeholderemail,
            stakeholdertype,
            stakeholdercategory,
          })
          .then(() => {
            setState(initialState);
            toast.success("Environment Details Added");
            setTimeout(() => navigate("/stakeholder"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_STAKEHOLDER(stakeholderid), {
            stakeholdername,
            stakeholdercontact,
            stakeholderemail,
            stakeholdertype,
            stakeholdercategory,
          })
          .then(() => {
            setState(initialState);
            toast.success("Company Details Updated");
            setTimeout(() => navigate("/stakeholder"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1 style={{ marginTop: "2cm" }}>Stakeholder Details</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="stakeholdername">Stakeholder Name</label>
          <input
            type="text"
            id="stakeholdername"
            name="stakeholdername"
            placeholder="Enter the Stakeholder Name"
            value={stakeholdername}
            onChange={handleInputChange}
          />

          <label htmlFor="stakeholdercontact">Stakeholder Contact</label>
          <input
            type="text"
            id="stakeholdercontact"
            name="stakeholdercontact"
            placeholder="Enter the Stakeholder Contact"
            value={stakeholdercontact}
            onChange={handleInputChange}
          />

          <label htmlFor="stakeholderemail">Stakeholder Email</label>
          <input
            type="email"
            id="stakeholderemail"
            name="stakeholderemail"
            placeholder="Enter the Stakeholder Email"
            value={stakeholderemail}
            onChange={handleInputChange}
          />

          <label htmlFor="stakeholdertype">Stakeholder Type</label>
          <select
            type="text"
            id="stakeholdertype"
            name="stakeholdertype"
            placeholder="Enter Stake Holder Type"
            value={stakeholdertype || " "}
            onChange={handleInputChange}
          >
            <option value="">Select Stake Holder Type</option>
            <option value="Vendor">Vendor</option>
            <option value="Client">Client</option>
            <option value="Partner">Partner</option>
          </select>

          <label htmlFor="stakeholdercategory">Stakeholder Category</label>
          <select
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="stakeholdercategory"
            name="stakeholdercategory"
            placeholder="Enter Stakeholder Category"
            value={stakeholdercategory || " "}
            onChange={handleInputChange}
          >
            <option value="">Select Stakeholder Category</option>
            <option value="Investors">Investors</option>
            <option value="Employees">Employees</option>
            <option value="Customers">Customers</option>
            <option value="Suppliers">Suppliers</option>
            <option value="Communities">Communities</option>
            <option value="Governments">Governments</option>
            <option value="Trade Associations">Trade Associations</option>
          </select>
          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={stakeholderid ? "Update" : "Save"}
          />
          <Link to="/stakeholder">
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

export default AddEditStakeholder;
