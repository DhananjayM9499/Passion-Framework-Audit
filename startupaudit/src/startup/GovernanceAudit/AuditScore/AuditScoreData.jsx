import React from "react";
import "./AuditScoreData.css";
import { ImCross } from "react-icons/im";
import { HiFolderDownload } from "react-icons/hi";
import logo from "../../components/images/logo.png";

const AuditScoreData = ({ item, onClose }) => {
  /***********************DOWNLOAD CSV********************************* */

  const handleDownloadCSV = () => {
    // Define the headers for the CSV file
    const headers = [
      "Organization",
      "Project Name",
      "Project Code",
      "Object Type",
      "Object",
      "Stakeholder",
      "Technology",
      "Environment",
      "Theme",
      "Theme Activity",
      "Project Type",
      "Project Category",
      "Responsibility Center",
      "Responsibility Group",
      "Governance Group",
      "Thrust Area",
      "Control Name",
      "Control Weight",
      "Sub-Control Name",
      "Sub-Control Weight",
      "Expected Evidence", // This will stay as one column
      "Evidence Reference Link",
      "Evidence Remark",
      "Evidence Status",
      "Assessment Status",
      "Assessment Score",
      "Assessment Reference Link",
      "Assessment Remark",
      "Auditor",
      "Auditees",
      "From Date",
      "To Date",
      "Audit Scope",
      "Certificate Scope",
      "Auditor Company",
      "Audit Reference Link",
      "Audit Upload",
      "Audit Remark",
      "Audit Status",
      "Audit Score",
      "Audit Date",
      "Report Expiry Date",
      "Next Audit Date",
      "Next Recomended Days",
      "Audit Validity Days",
    ];

    // Map the item data to the CSV format
    const rows = [
      [
        item.organization || "N/A",
        item.projectname || "N/A",
        item.projectcode || "N/A",
        item.objecttype || "N/A",
        item.object || "N/A",
        item.stakeholder || "N/A",
        item.technology || "N/A",
        item.environment || "N/A",
        item.theme || "N/A",
        item.themeactivity || "N/A",
        item.project_type || "N/A",
        item.project_category || "N/A",
        item.responsibilitycenter || "N/A",
        item.responsibilitygroup || "N/A",
        item.governancegroup || "N/A",
        item.thrustarea || "N/A",
        item.controlname || "N/A",
        item.controlwt || "N/A",
        item.subcontrolname || "N/A",
        item.subcontrolwt || "N/A",
        `"${item.expectedevidence || "N/A"}"`, // Wrap in quotes to keep as a single column
        item.evidencereferencelink || "N/A",
        item.evidenceremark || "N/A",
        item.evidencestatus || "N/A",
        item.assessmentstatus || "N/A",
        item.assessmentscore || "N/A",
        item.assessmentreferencelink || "N/A",
        item.assessmentremark || "N/A",
        item.auditor || "N/A",
        (item.auditees || []).join(";") || "N/A",
        item.fromdate ? new Date(item.fromdate).toLocaleDateString() : "N/A",
        item.todate ? new Date(item.todate).toLocaleDateString() : "N/A",
        item.auditscope || "N/A",
        item.certificatescope || "N/A",
        item.auditorcompany || "N/A",
        item.auditreferencelink || "N/A",
        item.auditupload || "N/A",
        item.auditremark || "N/A",
        item.auditstatus || "N/A",
        item.auditscore || "N/A",
        item.auditdate ? new Date(item.auditdate).toLocaleDateString() : "N/A",
        item.auditreportexpirydate
          ? new Date(item.auditreportexpirydate).toLocaleDateString()
          : "N/A",
        item.nextauditdate
          ? new Date(item.nextauditdate).toLocaleDateString()
          : "N/A",
        item.recomendeddays || "N/A",
        item.validityperiod || "N/A",
      ],
    ];

    // Create the CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Create a download link and click it
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="close-button" onClick={onClose} aria-label="Close">
          <ImCross size={25} />
        </button>
        <div className="header-container">
          <img src={logo} width="70px" height="auto" alt="logo" />{" "}
          <h2 className="popup-heading">Audit Details</h2>
          <button className="download-button" onClick={handleDownloadCSV}>
            <HiFolderDownload size={40} />
          </button>
        </div>
        <ul>
          <li>
            <strong>Organization : </strong>
            <span>{item.organization}</span>
          </li>
          <li>
            <strong>Project Name : </strong> <span>{item.projectname}</span>
          </li>
          <li>
            <strong>Project Code : </strong> <span>{item.projectcode}</span>
          </li>
          <li>
            <strong>Object Type : </strong> <span>{item.objecttype}</span>
          </li>
          <li>
            <strong>Object : </strong> <span>{item.object}</span>
          </li>
          <li>
            <strong>Stakeholder : </strong> <span>{item.stakeholder}</span>
          </li>
          <li>
            <strong>Technology : </strong> <span>{item.technology}</span>
          </li>
          <li>
            <strong>Environment : </strong> <span>{item.environment}</span>
          </li>
          <li>
            <strong>Theme : </strong> <span>{item.theme}</span>
          </li>
          <li>
            <strong>Theme Activity : </strong> <span>{item.themeactivity}</span>
          </li>

          <li>
            <strong>Project Type : </strong> <span>{item.project_type}</span>
          </li>
          <li>
            <strong>Project Category : </strong>{" "}
            <span>{item.project_category}</span>
          </li>
          <li>
            <strong>Responsibility Center : </strong>{" "}
            <span>{item.responsibilitycenter}</span>
          </li>
          <li>
            <strong>Responsibility Group : </strong>{" "}
            <span>{item.responsibilitygroup}</span>
          </li>
        </ul>{" "}
        <ul>
          <li>
            <strong>Governance Group : </strong>{" "}
            <span>{item.governancegroup}</span>
          </li>
          <li>
            <strong>Thrust Area : </strong> <span>{item.thrustarea}</span>
          </li>
          <li>
            <strong>Control Name : </strong> <span>{item.controlname}</span>
          </li>
          <li>
            <strong>Control Weight : </strong> <span>{item.controlwt}</span>
          </li>
          <li>
            <strong>Sub-Control Name : </strong>{" "}
            <span>{item.subcontrolname}</span>
          </li>
          <li>
            <strong>Sub-Control Weight : </strong>{" "}
            <span>{item.subcontrolwt}</span>
          </li>

          <li>
            <strong>Expected Evidence : </strong>{" "}
            <span>{item.expectedevidence}</span>
          </li>

          <li>
            <strong>Evidence Reference Link : </strong>{" "}
            <span>
              <a
                style={{ color: "blue" }}
                target="_blank"
                rel="noopener noreferrer"
                href={item.evidencereferencelink}
              >
                Document
              </a>
            </span>
          </li>
          <li>
            <strong>Evidence Remark : </strong>{" "}
            <span>{item.evidenceremark}</span>
          </li>
          <li>
            <strong>Evidence Status : </strong>{" "}
            <span>{item.evidencestatus}</span>
          </li>
        </ul>{" "}
        <ul>
          <li>
            <strong>Assessment Status : </strong>{" "}
            <span>{item.assessmentstatus}</span>
          </li>
          <li>
            <strong>Assessment Score : </strong>{" "}
            <span>{item.assessmentscore}</span>
          </li>
          <li>
            <strong>Assessment Reference Link : </strong>{" "}
            <span>
              <a
                style={{ color: "blue" }}
                target="_blank"
                rel="noopener noreferrer"
                href={item.assessmentreferencelink}
              >
                Document
              </a>
            </span>
          </li>
          <li>
            <strong>Assessment Remark : </strong>{" "}
            <span>{item.assessmentremark}</span>
          </li>
        </ul>{" "}
        <ul>
          <li>
            <strong>Auditor : </strong> <span>{item.auditor}</span>
          </li>
          <li>
            <strong>Auditees: </strong>{" "}
            <span>{item.auditees ? item.auditees.join(", ") : "NA"}</span>
          </li>

          <li>
            <strong>From Date : </strong>{" "}
            <span>{new Date(item.fromdate).toLocaleDateString() || "NA"}</span>
          </li>
          <li>
            <strong>To Date : </strong>{" "}
            <span>{new Date(item.todate).toLocaleDateString()}</span>
          </li>
          <li>
            <strong>Auditor Company : </strong>{" "}
            <span>{item.auditorcompany || "NA"}</span>
          </li>
          <li>
            <strong>Audit Scope : </strong>{" "}
            <span>{item.auditscope || "NA"}</span>
          </li>
          <li>
            <strong>Certificate Scope : </strong>{" "}
            <span>{item.certificatescope || "NA"}</span>
          </li>
        </ul>
        <ul>
          <li>
            <strong>Audit Reference Link : </strong>{" "}
            <span>
              <a
                style={{ color: "blue" }}
                target="_blank"
                rel="noopener noreferrer"
                href={item.auditreferencelink}
              >
                Document
              </a>
            </span>
          </li>
          <li>
            <strong>Audit Upload : </strong>{" "}
            <span>
              <a
                style={{ color: "blue" }}
                target="_blank"
                rel="noopener noreferrer"
                href={item.auditupload}
              >
                Document
              </a>
            </span>
          </li>
          <li>
            <strong>Audit Remark : </strong>{" "}
            <span>{item.auditremark || "NA"}</span>
          </li>
          <li>
            <strong>Audit Status : </strong>{" "}
            <span>{item.auditstatus || "NA"}</span>
          </li>
          <li>
            <strong>Audit Score : </strong>{" "}
            <span>{item.auditscore || "NA"}</span>
          </li>
          <li>
            <strong>Audit Date : </strong>{" "}
            <span>
              {item.auditdate == null
                ? "NA"
                : new Date(item.auditdate).toLocaleDateString()}
            </span>{" "}
          </li>

          <li>
            <strong>Next Audit Recomended Date : </strong>{" "}
            <span>
              {item.nextauditdate == null
                ? "NA"
                : new Date(item.nextauditdate).toLocaleDateString()}
            </span>
          </li>
          <li>
            <strong>Audit Expiry Date : </strong>{" "}
            <span>
              {item.auditreportexpirydate == null
                ? "NA"
                : new Date(item.auditreportexpirydate).toLocaleDateString()}
            </span>
          </li>
          <li>
            <strong>Validity Period : </strong>{" "}
            <span>{item.recomendeddays || "NA"}</span>
          </li>
          <li>
            <strong>Expire in days : </strong>{" "}
            <span>{item.validityperiod || "NA"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuditScoreData;
