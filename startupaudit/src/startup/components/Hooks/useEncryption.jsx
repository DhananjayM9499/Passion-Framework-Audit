// src/hooks/useEncryption.js
import { useCallback } from "react";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../config/config"; // Import the secret key from config

const useEncryption = () => {
  // Encrypt data using AES
  const encryptData = useCallback((data) => {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch (error) {
      console.error("Encryption error:", error);
      return null;
    }
  }, []);

  return { encryptData };
};

export default useEncryption;
