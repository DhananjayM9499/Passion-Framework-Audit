import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../../components/Pagination/Pagination";

const Vulnerabilities = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const loadData = async () => {
    const response = await axios.get(API.GET_VULNERABILITY_API);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteVulnerabilty = async (vulnerabilityid) => {
    if (window.confirm("Are you sure you want to delete")) {
      await axios.delete(API.DELETE_VULNERABILITY_API(vulnerabilityid));
      console.log("success:", "deleted successfully");
      loadData();
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div>
      <Navbar />
      <div className="mt-4">
        <h1 className="text-center mb-4 mt-4">Stakeholder</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/vulnerabilities/add">
            <div className="input-group center">
              <button className="btn btn-round btn-signup">
                Add Vulnerability
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
                <th scope="col">No</th>
                <th scope="col">Vulnerability Name</th>
                <th scope="col">Threat</th>
                <th scope="col">Mitigation Strategy</th>
                <th scope="col">Contigency Plan</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.vulnerabilityname}</td>
                  <td>{item.threat}</td>
                  <td>{item.mitigationstrategy}</td>
                  <td>{item.contigencyplan}</td>
                  <td>
                    <Link to={`/vulnerabilities/${item.vulnerabilityid}`}>
                      <FaEdit size={24} />
                    </Link>

                    <MdDelete
                      size={24}
                      onClick={() => deleteVulnerabilty(item.vulnerabilityid)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
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

export default Vulnerabilities;
