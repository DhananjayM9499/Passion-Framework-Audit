import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../../../Endpoints/Endpoints";
import Navbar from "../../../components/Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../../components/Pagination/Pagination";

const ThemeMaster = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust the number of items per page as needed

  const loadData = async () => {
    const response = await axios.get(API.GET_THEMEMASTER_API);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteTheme = async (thememasterid) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await axios.delete(API.DELETE_THEMEMASTER_API(thememasterid));
        console.log("Success: Deleted successfully");
        loadData(); // Refresh the data after deletion.
      } catch (error) {
        console.error(error);
      }
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
        <h1 className="text-center mb-4 mt-4">Technolo</h1>

        <div className="mb-4 d-flex justify-content-end">
          <Link to="/thememaster/add">
            <div className="input-group center">
              <button className="btn btn-round btn-signup">
                Add Theme Master
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
                <th scope="col">Theme Code</th>
                <th scope="col">Theme Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.themecode}</td>
                  <td>{item.themename}</td>
                  <td>
                    <Link to={`/thememaster/${item.thememasterid}`}>
                      <FaEdit size={24} />
                    </Link>

                    <MdDelete
                      size={24}
                      onClick={() => deleteTheme(item.thememasterid)}
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

export default ThemeMaster;
