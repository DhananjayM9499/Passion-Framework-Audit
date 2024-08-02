import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

const initialState = {
  vulnerabilityname: "",
  threat: "",
  mitigationstrategy: "",
  contigencyplan: "",
};

const AddEditVulnerabilities = () => {
  const [state, setState] = useState(initialState);

  const { vulnerabilityname, threat, mitigationstrategy, contigencyplan } =
    state;

  const navigate = useNavigate();

  const { vulnerabilityid } = useParams();

  useEffect(() => {
    if (vulnerabilityid) {
      axios
        .get(API.GET_SPECIFIC_VULNERABILITY(vulnerabilityid))
        .then((resp) => setState({ ...resp.data[0] }));
    }
  }, [vulnerabilityid]);

  const handlSubmit = (e) => {
    e.preventDefault();
    if (!vulnerabilityname) {
      toast.error("please provider value into each input field");
    } else {
      if (!vulnerabilityid) {
        axios
          .post(API.POST_VULNERABILITY_API, {
            vulnerabilityname,
            threat,
            mitigationstrategy,
            contigencyplan,
          })
          .then(() => {
            setState({
              vulnerabilityname: "",
              threat: "",
              mitigationstrategy: "",
              contigencyplan: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Object added successfully");
      } else {
        axios
          .put(API.UPDATE_SPECIFIC_VULNERABILITY(vulnerabilityid), {
            vulnerabilityname,
            threat,
            mitigationstrategy,
            contigencyplan,
          })
          .then(() => {
            setState({
              vulnerabilityname: "",
              threat: "",
              mitigationstrategy: "",
              contigencyplan: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" update successfully");
      }
      setTimeout(() => navigate("/vulnerabilities"), 500);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div className="form-container">
      <Navbar />
      <h1 style={{ marginTop: "2cm" }}>Vulnerability Details</h1>

      <div>
        <form
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center",
            fontFamily: "Poppins",
          }}
          onSubmit={handlSubmit}
        >
          <label htmlFor="vulnerabilityname">Vulnerability Name</label>
          <input
            type="text"
            id="vulnerabilityname"
            name="vulnerabilityname"
            placeholder="Enter Vulnerability Name"
            value={vulnerabilityname || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="threat">Threat</label>
          <input
            type="text"
            id="threat"
            name="threat"
            placeholder="Enter threat Details"
            value={threat || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="mitigationstrategy">Mitigation Strategy</label>
          <input
            type="text"
            id="mitigationstrategy"
            name="mitigationstrategy"
            placeholder="Enter Mitigation Strategy"
            value={mitigationstrategy || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="contigencyplan">Contigency Plan</label>
          <input
            type="text"
            id="contigencyplan"
            name="contigencyplan"
            placeholder="Enter Contigency Plan "
            value={contigencyplan || ""}
            onChange={handleInputChange}
          />

          <input
            className="btn btn-round btn-signup"
            type="submit"
            value={vulnerabilityid ? "update" : "Save"}
          />
          <Link to="/vulnerabilities">
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

export default AddEditVulnerabilities;
