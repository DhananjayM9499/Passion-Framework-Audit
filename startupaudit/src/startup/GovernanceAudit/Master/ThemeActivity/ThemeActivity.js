import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../../components/Pagination/Pagination";

const ThemeActivity = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const loadData = async () => {
    const response = await axios.get(API.GET_THEMEACTIVITY_API);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteThemeActivity = (themeactivityid) => {
    if (window.confirm("Are you sure you want to delete")) {
      axios.delete(API.DELETE_THEMEACTIVITY_API(themeactivityid));
      setTimeout(() => loadData(), 500);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div>
      <Navbar />
      <div className="mt-4">
        <h1 className="text-center mb-4 mt-4">Theme Activit</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/themeactivity/add">
            <div className="input-group center">
              <button className="btn btn-round btn-signup">
                Add Theme Activity
              </button>
            </div>
          </Link>
        </div>
        <div
          className="table-responsive mb-4 d-flex justify-content-end"
          style={{ maxWidth: "85%", margin: "0 auto", marginRight: 0 }}
        >
          {" "}
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">No</th>
                <th scope="col">Theme</th>
                <th scope="col">Phase</th>
                <th scope="col">Activity Group</th>
                <th scope="col">Activity</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.themename}</td>
                    <td>{item.phase}</td>
                    <td>{item.activitygroup}</td>
                    <td>{item.activity}</td>
                    <td>
                      <Link to={`/themeactivity/${item.themeactivityid}`}>
                        <FaEdit size={24} />
                      </Link>
                      <MdDelete
                        size={24}
                        onClick={() =>
                          deleteThemeActivity(item.themeactivityid)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
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

export default ThemeActivity;
