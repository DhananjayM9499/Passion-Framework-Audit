import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";
import Navbar from "../../components/Navbar/Navbar";
import "./Organization.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const Organization = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_ORGANIZATION_API);
      const sortedData = response.data.sort(
        (a, b) => b.organizationid - a.organizationid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const deleteOrganization = async (organizationid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_ORGANIZATION_API(organizationid)
        );
        if (response.status === 200) {
          toast.success("Company Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Cannot delete Company as there are associates present.");
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
        <h1 className="text-center mb-4">AI Governance</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/organization/add">
            <div className="input-group center">
              <button className="btn btn-round btn-signup">Add Company</button>
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
                <th scope="col">Company Name</th>
                <th scope="col">Contact Name</th>
                <th scope="col">Contact Email</th>
                <th scope="col">Contact Phone</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.organizationid}>
                  <td>{index + indexOfFirstItem + 1}</td>
                  <td>{item.organization}</td>
                  <td>{item.contactname}</td>
                  <td>{item.contactemail}</td>
                  <td>{item.contactphone}</td>
                  <td>
                    <Link to={`/editcompany/${item.companyid}`}>
                      <FaEdit size={24} />
                    </Link>

                    <MdDelete
                      size={24}
                      onClick={() => deleteOrganization(item.organizationid)}
                    />
                    <Link to={`/project/${item.companyid}`}>
                      <div>
                        <button className="btn btn-round btn-signup">
                          Project
                        </button>
                      </div>
                    </Link>
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

export default Organization;
