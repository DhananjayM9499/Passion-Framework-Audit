import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints"; // Adjust the import path
import Navbar from "../../components/Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../components/Pagination/Pagination";

const ProjectDetails = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const userId = localStorage.getItem("user_id");
  const location = useLocation();

  const { organizationName } = location.state || {};
  console.log(organizationName);
  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const response = await axios.get(
        API.GET_PROJECTDETAILS_BYID(userId, organizationName)
      );
      const sortedData = response.data.sort(
        (a, b) => b.projectid - a.projectid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const deleteProject = async (projectid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_PROJECTDETAILS_API(projectid)
        );
        if (response.status === 200) {
          toast.success("Project Deleted Successfully");
          loadData();
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the project.");
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
        <h1 className="text-center mb-4 mt-4">Proect Details</h1>
        <div className="mb-4 d-flex justify-content-end">
          <Link to="/projectdetails/add" state={{ organizationName }}>
            <div className="input-group center">
              <button className="btn btn-round btn-signup">Add Project</button>
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
                <th scope="col">Organization</th>
                <th scope="col">Project Name</th>
                <th scope="col">Project Code</th>
                <th scope="col">Audit Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.projectid}>
                  <td>{index + indexOfFirstItem + 1}</td>
                  <td>{item.organization}</td>
                  <td>{item.projectname}</td>
                  <td>{item.projectcode}</td>
                  <td>{new Date(item.auditdate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/projectdetails/${item.projectdetailsid}`}>
                      <FaEdit size={24} />
                    </Link>
                    <MdDelete
                      size={24}
                      onClick={() => deleteProject(item.projectdetailsid)}
                    />
                    <Link to={`/projectdetails/view/${item.projectid}`}>
                      <button className="btn btn-round btn-signup">View</button>
                    </Link>
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

export default ProjectDetails;