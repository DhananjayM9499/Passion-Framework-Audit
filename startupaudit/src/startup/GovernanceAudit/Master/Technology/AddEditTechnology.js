import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  technologyname: "",
  technologyversion: "",
};

const AddEditTechnology = () => {
  const [state, setState] = useState(initialState);
  console.log(API.GET_TECHNOLOGY_API);

  const { technologyname, technologyversion } = state;

  const navigate = useNavigate();

  const { technologyid } = useParams();

  useEffect(() => {
    if (technologyid) {
      axios
        .get(API.GET_SPECIFIC_TECHNOLOGY(technologyid))
        .then((resp) => setState({ ...resp.data[0] }));
    }
  }, [technologyid]);

  const handlSubmit = (e) => {
    e.preventDefault();
    if (!technologyname) {
      toast.error("please provider value into each input field");
    } else {
      if (!technologyid) {
        axios
          .post(API.POST_TECHNOLOGY_API, {
            technologyname,
            technologyversion,
          })
          .then(() => {
            setState({ technologyname: "", technologyversion: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Technology added successfully");
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_TECHNOLOGY(technologyid), {
            technologyname,
            technologyversion,
          })
          .then(() => {
            setState({ technologyname: "", technologyversion: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" Technology Update Successfully");
      }
      setTimeout(() => navigate("/technology"), 500);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div className="form-container">
      <Navbar />
      <h1 style={{ marginTop: "2cm" }}>Technology Details</h1>
      <div>
        <form onSubmit={handlSubmit}>
          <label htmlFor="technologyname">Technology Name</label>
          <input
            type="text"
            id="technologyname"
            name="technologyname"
            placeholder="Enter technology name"
            value={technologyname || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="technologyversion">Technology Version</label>
          <input
            type="text"
            id="technologyversion"
            name="technologyversion"
            placeholder="Enter technology version"
            value={technologyversion || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={technologyid ? "update" : "Save"}
          />
          <Link to="/technology">
            <input
              className="btn btn-round btn-signup"
              type="button"
              value="go back"
            />
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AddEditTechnology;
