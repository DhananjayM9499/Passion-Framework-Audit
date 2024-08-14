import { useState, useEffect } from "react";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";

export const useOrganizationDetails = (organizationName) => {
  const [organization, setOrganization] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (organizationName) {
      const fetchOrganizationData = async () => {
        try {
          const response = await axios.get(
            API.GET_ORGANIZATION_BYNAME(organizationName)
          );
          setOrganization(response.data[0]);
        } catch (error) {
          console.error("Error fetching organization data:", error);
          setError("Failed to fetch organization data.");
        }
      };
      fetchOrganizationData();
    }
  }, [organizationName]);

  return { organization, error };
};
