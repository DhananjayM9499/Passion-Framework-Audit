// DownloadExcel.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import * as API from "../../Endpoints/Endpoints";
import { ImCross } from "react-icons/im";
import { HiFolderDownload } from "react-icons/hi";

const CertificateGenerator = ({ item, onClose }) => {
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = sessionStorage.getItem("user_id");

  const auditId = item;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API.GET_CERTIFICATE_API(auditId));
        const fetchedData = response.data[0];
        setState(fetchedData); // Store data
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (auditId) {
      fetchData();
    }
  }, [auditId]);

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      // Extract day, month, and year parts
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const year = date.getFullYear();

      // Return the formatted date as dd/mm/yyyy
      return `${day}/${month}/${year}`;
    }
    return "N/A";
  };

  const modifyExcelFile = async (data) => {
    const workbook = new ExcelJS.Workbook();

    // Load the Excel file from the ArrayBuffer
    await workbook.xlsx.load(data);

    const worksheet = workbook.getWorksheet(1); // Get the first worksheet

    // Modify cells
    const cellC25 = worksheet.getCell("C25");
    cellC25.value = state.user_name;
    cellC25.font = { name: "Trebuchet MS", size: 20 };

    const CalibriFont = { name: "Calibri", size: 11 };

    const cellG30 = worksheet.getCell("G30");
    cellG30.value = state.governancegroup;
    cellG30.font = { name: "Calibri", size: 20, color: { argb: "FFFF0000" } };

    const cellB37 = worksheet.getCell("B37");
    cellB37.value = state.certificatescope;
    cellB37.font = CalibriFont;

    const cellF44 = worksheet.getCell("F44");
    cellF44.value =
      formatDate(state.fromdate) + " - " + formatDate(state.todate);
    cellF44.font = CalibriFont;
    cellF44.alignment = { horizontal: "left" };

    const cellF45 = worksheet.getCell("F45");
    cellF45.value = state.auditscope;
    cellF45.font = CalibriFont;

    const cellF46 = worksheet.getCell("F46");
    cellF46.value = state.governancegroup;
    cellF46.font = CalibriFont;

    const cellF47 = worksheet.getCell("F47");
    cellF47.value = state.auditorcompany;
    cellF47.font = CalibriFont;

    const cellF48 = worksheet.getCell("F48");
    cellF48.value = state.auditor;

    const cellA55 = worksheet.getCell("A55");
    cellA55.value = {
      richText: [
        { text: state.auditor + "\n" },
        {
          text: state.auditorcompany,
          font: { color: { argb: "FFFF0000" }, bold: true },
        },
      ],
    };
    cellA55.alignment = { wrapText: true, vertical: "middle" };

    // Define constants for each odd-numbered cell in column N and P

    const cellN5 = worksheet.getCell("N5");
    const cellN7 = worksheet.getCell("N7");
    const cellN9 = worksheet.getCell("N9");
    const cellN11 = worksheet.getCell("N11");
    const cellN13 = worksheet.getCell("N13");
    const cellN15 = worksheet.getCell("N15");
    const cellN17 = worksheet.getCell("N17");
    const cellN19 = worksheet.getCell("N19");
    const cellN21 = worksheet.getCell("N21");
    const cellN23 = worksheet.getCell("N23");
    const cellN25 = worksheet.getCell("N25");
    const cellN27 = worksheet.getCell("N27");
    const cellN29 = worksheet.getCell("N29");
    const cellN32 = worksheet.getCell("N32");
    const cellN34 = worksheet.getCell("N34");
    const cellN36 = worksheet.getCell("N36");
    const cellN38 = worksheet.getCell("N38");
    const cellN40 = worksheet.getCell("N40");
    const cellN42 = worksheet.getCell("N42");
    const cellN44 = worksheet.getCell("N44");
    const cellN47 = worksheet.getCell("N47");
    const cellN50 = worksheet.getCell("N50");
    const cellN53 = worksheet.getCell("N53");
    const cellN56 = worksheet.getCell("N56");

    const cellP5 = worksheet.getCell("P5");
    const cellP7 = worksheet.getCell("P7");
    const cellP9 = worksheet.getCell("P9");
    const cellP11 = worksheet.getCell("P11");
    const cellP13 = worksheet.getCell("P13");
    const cellP15 = worksheet.getCell("P15");
    const cellP17 = worksheet.getCell("P17");
    const cellP19 = worksheet.getCell("P19");
    const cellP21 = worksheet.getCell("P21");
    const cellP23 = worksheet.getCell("P23");
    const cellP25 = worksheet.getCell("P25");
    const cellP27 = worksheet.getCell("P27");
    const cellP29 = worksheet.getCell("P29");
    const cellP32 = worksheet.getCell("P32");
    const cellP34 = worksheet.getCell("P34");
    const cellP39 = worksheet.getCell("P39");
    const cellP44 = worksheet.getCell("P44");
    const cellP47 = worksheet.getCell("P47");
    const cellP50 = worksheet.getCell("P50");
    const cellP53 = worksheet.getCell("P53");
    const cellP56 = worksheet.getCell("P56");
    // Font settings constant
    const fontSettings = {
      name: "Aptos",
      size: 11,
    };

    // Assign values and apply font settings for each cell
    cellN5.value = state.organization;
    cellN5.font = fontSettings;

    cellN7.value = state.objecttype;
    cellN7.font = fontSettings;

    cellN9.value = state.technology;
    cellN9.font = fontSettings;

    cellN11.value = state.themeactivity;
    cellN11.font = fontSettings;

    cellN13.value = state.responsibilitycenter;
    cellN13.font = fontSettings;

    cellN15.value = state.projectcode;
    cellN15.font = fontSettings;

    cellN17.value = state.stakeholder;
    cellN17.font = fontSettings;

    cellN19.value = state.governancegroup;
    cellN19.font = fontSettings;

    cellN21.value = state.controlname;
    cellN21.font = fontSettings;

    cellN23.value = state.controlwt;
    cellN23.font = fontSettings;

    cellN25.value = state.subcontrolname;
    cellN25.font = fontSettings;

    cellN27.value = state.subcontrolwt;
    cellN27.font = fontSettings;

    cellN29.value = {
      text: "Document",
      hyperlink: state.assessmentreferencelink,
    };
    cellN29.font = fontSettings;

    cellN32.value = state.assessmentscore;
    cellN32.font = fontSettings;

    cellN34.value = state.auditorcompany;
    cellN34.font = fontSettings;

    cellN36.value = formatDate(state.fromdate);
    cellN36.font = fontSettings;

    cellN38.value = formatDate(state.todate);
    cellN38.font = fontSettings;

    cellN40.value = state.auditor;
    cellN40.font = fontSettings;

    cellN42.value = state.auditscope;
    cellN42.font = fontSettings;

    cellN44.value = {
      text: "Document",
      hyperlink: state.auditreferencelink,
    };
    cellN44.font = fontSettings;

    cellN47.value = state.auditstatus;
    cellN47.font = fontSettings;

    cellN50.value = {
      text: "Document",
      hyperlink: state.auditupload,
    };
    cellN50.font = fontSettings;

    cellN53.value = formatDate(state.auditreportexpirydate);
    cellN53.font = fontSettings;

    cellN56.value = state.validityperiod;
    cellN56.font = fontSettings;

    cellP5.value = state.projectname;
    cellP5.font = fontSettings;

    cellP7.value = state.object;
    cellP7.font = fontSettings;

    cellP9.value = state.environment;
    cellP9.font = fontSettings;

    cellP11.value = state.project_type;
    cellP11.font = fontSettings;

    cellP13.value = state.responsibilitygroup;
    cellP13.font = fontSettings;

    cellP15.value = state.theme;
    cellP15.font = fontSettings;

    cellP17.value = state.project_category;
    cellP17.font = fontSettings;

    cellP19.value = state.thrustarea;
    cellP19.font = fontSettings;

    cellP21.value = state.expectedevidence;
    cellP21.font = fontSettings;

    cellP23.value = {
      text: "Document",
      hyperlink: state.evidencereferencelink,
    };
    cellP23.font = fontSettings;

    cellP25.value = state.evidenceremark;
    cellP25.font = fontSettings;

    cellP27.value = state.evidencestatus;
    cellP27.font = fontSettings;

    cellP29.value = state.assessmentstatus;
    cellP29.font = fontSettings;

    cellP32.value = state.assessmentremark;
    cellP32.font = fontSettings;

    cellP34.value = state.auditees.join(", ") || "NA";
    cellP34.font = fontSettings;

    cellP39.value = state.certificatescope;
    cellP39.font = fontSettings;

    cellP44.value = state.auditscore;
    cellP44.font = fontSettings;

    cellP47.value = state.auditremark;
    cellP47.font = fontSettings;

    cellP50.value = formatDate(state.auditdate);
    cellP50.font = fontSettings;

    cellP53.value = state.nextauditdate;
    cellP53.font = fontSettings;

    cellP56.value = state.recomendeddays;
    cellP56.font = fontSettings;
    const imageUrl = API.GET_IMAGE(state.auditorcompanylogo); // Replace with your image URL
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Create a Uint8Array from the array buffer
    const uint8Array = new Uint8Array(arrayBuffer);

    // Add the image to the workbook
    const imageId = workbook.addImage({
      buffer: uint8Array, // Use Uint8Array for image buffer
      extension: "png", // Set the correct image extension
    });

    // Insert the image into the worksheet at a specified position
    worksheet.addImage(imageId, "H2:H7", {
      ext: { width: 90, height: 100 },
    });

    return workbook.xlsx.writeBuffer();
  };

  const fetchAndModifyExcel = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/certificate.xlsx", {
        responseType: "arraybuffer",
      });

      const modifiedBuffer = await modifyExcelFile(response.data);

      const blob = new Blob([modifiedBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "modified_certificate.xlsx");
    } catch (error) {
      console.error("Error fetching or modifying the Excel file:", error);
      setError("An error occurred while fetching or modifying the Excel file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="popup-container">
        <div className="popup-content" style={{ width: "500px" }}>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <ImCross size={25} />
          </button>
          <div className="header-container">
            <h2 className="popup-heading">Audit Certificate</h2>
            <button
              className="download-button"
              onClick={fetchAndModifyExcel}
              disabled={loading}
            >
              {loading ? "Processing..." : <HiFolderDownload size={40} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
