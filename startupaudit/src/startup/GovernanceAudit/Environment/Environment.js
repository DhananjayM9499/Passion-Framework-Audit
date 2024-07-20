import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import Navbar from "../../components/Navbar/Navbar";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Environment = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_ENVIRONMENT_API);
      const sortedData = response.data.sort(
        (a, b) => b.environmentid - a.environmentid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const deleteEnvironment = async (environmentid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_ENVIRONMENT_API(environmentid)
        );
        if (response.status === 200) {
          toast.success("Environment Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete Environment as there are associates present."
          );
        } else {
          console.error(error);
          toast.error("An error occurred while deleting Company.");
        }
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="mt-4">
        <h1 className="text-center mb-4 mt-4">AI Governance</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/environment/add">
            <div className="input-group center">
              <button className="btn btn-round btn-signup">
                Add Environment
              </button>
            </div>
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
                <th scope="col" className="w-25">
                  Environment Name
                </th>
                <th scope="col">Environment Description</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.environmentid}>
                  <td>{index + indexOfFirstItem + 1}</td>
                  <td>{item.environmentname}</td>
                  <td>{item.environmentdescription}</td>

                  <td>
                    <Link to={`/environment/${item.environmentid}`}>
                      <FaEdit size={24} />
                    </Link>

                    <MdDelete
                      size={24}
                      onClick={() => deleteEnvironment(item.environmentid)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {Array.from({
                length: Math.ceil(data.length / itemsPerPage),
              }).map((item, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    style={{ backgroundColor: "#ff3131" }}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Environment;
