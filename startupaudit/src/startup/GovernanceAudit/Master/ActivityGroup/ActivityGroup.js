import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../../components/Pagination/Pagination";

const ActivityGroup = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_ACTIVITYGROUP_API);
      const sortedData = response.data.sort(
        (a, b) => b.activitygroupid - a.activitygroupid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const deleteActivityGroup = async (activitygroupid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_ACTIVITYGROUP_API(activitygroupid)
        );
        if (response.status === 200) {
          toast.success("Activity Group Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete Activity Group as there are associates present."
          );
        } else {
          console.error(error);
          toast.error("An error occurred while deleting Activity Group.");
        }
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
        <h1 className="text-center mb-4 mt-4">Proect te</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/activitygroup/add">
            <div className="input-group center">
              <button className="btn btn-round btn-signup">
                Add Activity Group
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
                  Activity Group
                </th>

                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.responsibilitygroupid}>
                  <td>{index + indexOfFirstItem + 1}</td>
                  <td>{item.activitygroupname}</td>

                  <td>
                    <Link to={`/activitygroup/${item.activitygroupid}`}>
                      <FaEdit size={24} />
                    </Link>

                    <MdDelete
                      size={24}
                      onClick={() => deleteActivityGroup(item.activitygroupid)}
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

export default ActivityGroup;
