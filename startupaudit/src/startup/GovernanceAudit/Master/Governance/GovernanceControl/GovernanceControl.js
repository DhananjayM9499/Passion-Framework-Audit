import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../../Endpoints/Endpoints";
import Navbar from "../../../../components/Navbar/Navbar";
import Pagination from "../../../../components/Pagination/Pagination"; // Import Pagination component

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const GovernanceControl = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_GOVERNANCECONTROL_API);
      const sortedData = response.data.sort(
        (a, b) => b.controlid - a.controlid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error loading governance controls");
    }
  };

  const deleteControl = async (controlid) => {
    if (window.confirm("Are you sure you want to delete this control?")) {
      try {
        await axios.delete(API.DELETE_GOVERNANCECONTROL_API(controlid));
        toast.success("Governance control deleted successfully");
        loadData();
      } catch (error) {
        console.error("Error deleting governance control:", error);
        toast.error("An error occurred while deleting the control");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container">
      <Navbar />
      <div className="mt-4">
        <h1 className="text-center mb-4">Governance Controls</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/governancecontrol/add">
            <button className="btn btn-round btn-signup">
              Add Governance Control
            </button>
          </Link>
        </div>
        <div
          className="table-responsive mb-4 d-flex justify-content-end"
          style={{ maxWidth: "85%", margin: "0 auto", marginRight: 0 }}
        >
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Control Name</th>
                <th scope="col">Thrust Area</th>
                <th scope="col">Weight</th>
                <th scope="col">Subcontrol Name</th>
                <th scope="col">Group Name</th>
                <th scope="col">Evidence</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.controlid}>
                  <td>{index + indexOfFirstItem + 1}</td>
                  <td>{item.controlname}</td>
                  <td>{item.thrustarea}</td>
                  <td>{item.controlwt}</td>
                  <td>{item.subcontrolname}</td>
                  <td>{item.groupname}</td>
                  <td>{item.evidence}</td>
                  <td>
                    <Link to={`/governancecontrol/${item.controlid}`}>
                      <FaEdit size={24} />
                    </Link>
                    <MdDelete
                      size={24}
                      onClick={() => deleteControl(item.controlid)}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default GovernanceControl;
