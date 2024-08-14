import { useState, useEffect } from "react";
import axios from "axios";
import * as API from "../../Endpoints/Endpoints";

export const useEvidence = (evidenceId) => {
  const [state, setState] = useState([]);

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        const response = await axios.get(API.GET_SPECIFIC_EVIDENCE(evidenceId));
        const sortedData = response.data.sort(
          (a, b) => b.evidenceid - a.evidenceid
        );
        setState(sortedData);
      } catch (error) {
        console.error("Error loading evidence data:", error);
      }
    };
    loadEvidence();
  }, [evidenceId]);

  return { state };
};
