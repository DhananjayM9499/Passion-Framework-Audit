import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../../components/Pagination/Pagination";
const Stakeholder = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    const response = await axios.get(API.GET_STAKEHOLDER_API);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteStakeholder = (stakeholderid) => {
    if (window.confirm("Are you sure you want to delete")) {
      axios.delete(API.DELETE_STAKEHOLDER_API(stakeholderid));
      console.log("success:", "deleted successfully");
      setTimeout(() => loadData(), 500);
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
        <h1 className="text-center mb-4 mt-4">Stakeholder</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/stakeholder/add">
            <div className="input-group center">
              <button className="btn btn-round btn-signup">
                Add Stakeholder
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
                  Stakeholder Name
                </th>
                <th scope="col">Stakeholder Contact</th>
                <th scope="col">Stakeholder Email</th>

                <th scope="col">Stakeholder Type</th>

                <th scope="col">Stakeholder Category</th>

                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.stakeholderid}>
                  <td>{index + indexOfFirstItem + 1}</td>
                  <td>{item.stakeholdername}</td>
                  <td>{item.stakeholdercontact}</td>
                  <td>{item.stakeholderemail}</td>
                  <td>{item.stakeholdertype}</td>
                  <td>{item.stakeholdercategory}</td>

                  <td>
                    <Link to={`/stakeholder/${item.stakeholderid}`}>
                      <FaEdit size={24} />
                    </Link>

                    <MdDelete
                      size={24}
                      onClick={() => deleteStakeholder(item.stakeholderid)}
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

export default Stakeholder;
