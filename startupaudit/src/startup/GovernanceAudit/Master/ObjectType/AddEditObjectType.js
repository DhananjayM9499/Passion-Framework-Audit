import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  objecttype: "",
  objecttypedescription: "",
  iconupload: "",
  fileupload: "",
};

const AddEditObjectType = () => {
  const [state, setState] = useState(initialState);
  const { objecttype, objecttypedescription, iconupload, fileupload } = state;
  const navigate = useNavigate();
  const { objecttypeid } = useParams();

  useEffect(() => {
    if (objecttypeid) {
      axios
        .get(API.GET_SPECIFIC_OBJECTTYPE(objecttypeid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Object Type Details:",
            error
          );
        });
    }
  }, [objecttypeid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!objecttype || !objecttypedescription) {
      toast.error("Please provide all required fields");
    } else {
      if (!objecttypeid) {
        axios
          .post(API.POST_OBJECTTYPE_API, {
            objecttype,
            objecttypedescription,
            iconupload,
            fileupload,
          })
          .then(() => {
            setState(initialState);
            toast.success("Object Type Added Successfully");
            setTimeout(() => navigate("/objecttype"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_OBJECTTYPE(objecttypeid), {
            objecttype,
            objecttypedescription,
            iconupload,
            fileupload,
          })
          .then(() => {
            setState(initialState);
            toast.success("Object Type Updated Successfully");
            setTimeout(() => navigate("/objecttype"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>{objecttypeid ? "Edit Object Type" : "Add Object Type"}</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="objecttype">Object Type</label>
          <input
            type="text"
            id="objecttype"
            name="objecttype"
            placeholder="Enter the Object Type"
            value={objecttype || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="objecttypedescription">Description</label>
          <input
            type="text"
            id="objecttypedescription"
            name="objecttypedescription"
            placeholder="Enter the Description"
            value={objecttypedescription || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="iconupload">Icon Upload</label>
          <input
            type="text"
            id="iconupload"
            name="iconupload"
            placeholder="Upload Icon"
            value={iconupload || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="fileupload">File Upload</label>
          <input
            type="text"
            id="fileupload"
            name="fileupload"
            placeholder="Upload File"
            value={fileupload || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={objecttypeid ? "Update" : "Save"}
          />
          <Link to="/objecttype">
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

export default AddEditObjectType;
