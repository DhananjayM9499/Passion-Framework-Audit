import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../../Endpoints/Endpoints";
import Navbar from "../../../../components/Navbar/Navbar";

const initialState = {
  thrustarea: "",
};

const AddEditThrust = () => {
  const [state, setState] = useState(initialState);
  const { thrustarea } = state;
  const navigate = useNavigate();
  const { thrustid } = useParams();

  useEffect(() => {
    if (thrustid) {
      axios
        .get(API.GET_SPECIFIC_THRUSTAREA(thrustid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Company Details:",
            error
          );
        });
    }
  }, [thrustid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!thrustarea) {
      toast.error("Please provide all the inputs");
    } else {
      if (!thrustid) {
        axios
          .post(API.POST_THRUSTAREA_API, {
            thrustarea,
          })
          .then(() => {
            setState(initialState);
            toast.success("Governance group  Added");
            setTimeout(() => navigate("/thrustarea"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_THRUSTAREA(thrustid), {
            thrustarea,
          })
          .then(() => {
            setState(initialState);
            toast.success("Thrust area  Added");
            setTimeout(() => navigate("/thrustarea"), 500);
          })
          .catch((err) => toast.error(err.response.data));
      }
    }
  };

  return (
    <div className="form-container">
      <Navbar />
      <h1>Thrust Area</h1>
      <div style={{ marginTop: "auto" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="thrustarea">Thrust Area</label>
          <input
            type="text"
            id="thrustarea"
            name="thrustarea"
            placeholder="Enter the Thrust Area"
            value={thrustarea || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={thrustid ? "Update" : "Save"}
          />
          <Link to="/thrustarea">
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

export default AddEditThrust;
