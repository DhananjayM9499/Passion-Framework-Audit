import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  objectname: "",
  objectcode: "",
  objectdescription: "",
  dependentobjectcode: "",
  iconupload: "",
  fileupload: "",
};

const AddEditObject = () => {
  const [state, setState] = useState(initialState);
  const {
    objectname,
    objectcode,
    objectdescription,
    dependentobjectcode,
    iconupload,
    fileupload,
  } = state;
  const navigate = useNavigate();
  const { objectid } = useParams();

  useEffect(() => {
    if (objectid) {
      axios
        .get(API.GET_SPECIFIC_OBJECT(objectid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Object Details:",
            error
          );
        });
    }
  }, [objectid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!objectname || !objectcode || !objectdescription) {
      toast.error("Please provide all required fields");
    } else {
      if (!objectid) {
        axios
          .post(API.POST_OBJECT_API, {
            objectname,
            objectcode,
            objectdescription,
            dependentobjectcode,
            iconupload,
            fileupload,
          })
          .then(() => {
            setState(initialState);
            toast.success("Object Added Successfully");
            setTimeout(() => navigate("/object"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_OBJECT(objectid), {
            objectname,
            objectcode,
            objectdescription,
            dependentobjectcode,
            iconupload,
            fileupload,
          })
          .then(() => {
            setState(initialState);
            toast.success("Object Updated Successfully");
            setTimeout(() => navigate("/object"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>{objectid ? "Edit Object" : "Add Object"}</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="objectname">Object Name</label>
          <input
            type="text"
            id="objectname"
            name="objectname"
            placeholder="Enter the Object Name"
            value={objectname || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="objectcode">Object Code</label>
          <input
            type="text"
            id="objectcode"
            name="objectcode"
            placeholder="Enter the Object Code"
            value={objectcode || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="objectdescription">Description</label>
          <input
            type="text"
            id="objectdescription"
            name="objectdescription"
            placeholder="Enter the Description"
            value={objectdescription || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="dependentobjectcode">Dependent Object Code</label>
          <input
            type="text"
            id="dependentobjectcode"
            name="dependentobjectcode"
            placeholder="Enter the Dependent Object Code"
            value={dependentobjectcode || ""}
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
            value={objectid ? "Update" : "Save"}
          />
          <Link to="/object">
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

export default AddEditObject;
