import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  themecode: "",
  themename: "",
};

const AddEditThemeMaster = () => {
  const [state, setState] = useState(initialState);
  console.log(API.GET_THEMEMASTER_API);

  const { themecode, themename } = state;

  const navigate = useNavigate();

  const { thememasterid } = useParams();

  useEffect(() => {
    if (thememasterid) {
      axios
        .get(API.GET_SPECIFIC_THEMEMASTER(thememasterid))
        .then((resp) => setState({ ...resp.data[0] }));
    }
  }, [thememasterid]);

  const handlSubmit = (e) => {
    e.preventDefault();
    if (!themecode || !themename) {
      toast.error("please provider value into each input field");
    } else {
      if (!thememasterid) {
        axios
          .post(API.POST_THEMEMASTER_API, {
            themecode,
            themename,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Technology added successfully");
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_THEMEMASTER(thememasterid), {
            themecode,
            themename,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" Technology Update Successfully");
      }
      setTimeout(() => navigate("/thememaster"), 500);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div className="form-container">
      <Navbar />
      <h1 style={{ marginTop: "2cm" }}>Theme Details</h1>
      <div>
        <form onSubmit={handlSubmit}>
          <label htmlFor="themecode">Theme Code</label>
          <input
            type="text"
            id="themecode"
            name="themecode"
            placeholder="Enter Theme Code"
            value={themecode || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="themename">Theme Name</label>
          <input
            type="text"
            id="themename"
            name="themename"
            placeholder="Enter Theme Name"
            value={themename || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={thememasterid ? "update" : "Save"}
          />
          <Link to="/thememaster">
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

export default AddEditThemeMaster;
