import { useState, useEffect } from "react";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";

export const useProjectDetails = (projectId) => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId) {
      const fetchProjectData = async () => {
        try {
          const response = await axios.get(
            API.GET_SPECIFIC_PROJECTDETAILS(projectId)
          );
          if (response.data.length > 0) {
            setData(response.data[0]);
          } else {
            setError("No project data found.");
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
          setError("Failed to fetch project data. Please try again later.");
        }
      };
      fetchProjectData();
    } else {
      console.warn("No projectId provided");
    }
  }, [projectId]);

  return { data, error };
};
