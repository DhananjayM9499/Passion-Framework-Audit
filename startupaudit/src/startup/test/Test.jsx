// import React from "react";
// import useCounter from "../components/Hooks/counter";
// function Test() {
//   const { count, increase, decrease } = useCounter(0); // Start the counter at 0

//   return (
//     <div style={{ textAlign: "center", margin: "20px" }}>
//       <h1>Counter: {count}</h1>
//       <div>
//         <button
//           onClick={increase}
//           style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
//         >
//           Increase
//         </button>
//         <button
//           onClick={decrease}
//           style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
//         >
//           Decrease
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Test;
import React from "react";
import "./test.css";
import logo from "../components/images/logo.png";
const PassionAuditFrameworkComponent = (props) => {
  return (
    <div className="container border border-black border-3  pb-0">
      {/* Header */}
      <div className="row align-items-center p-3 border-bottom border-4 border-dark">
        <div className="col-3 text-center">
          <img src={logo} alt="Logo" style={{ width: "100px" }} />{" "}
          {/* Replace with your logo */}
        </div>
        <div className="col-6 text-center">
          <h1 className="text-danger fw-bold">Passion Audit Framework</h1>
        </div>
        <div className="col-3 text-end">
          <img src={logo} alt="Second Logo" style={{ width: "80px" }} />{" "}
          {/* Replace with second logo */}
        </div>
      </div>
      {/* Content Section */}
      <div className="row mt-3">
        <div className="col-md-6 p-0">
          <div className="row m-0 border-cell">
            <div className="col-4 fw-bold border-cell pa-b">Company Name</div>
            <div className="col-8 text-muted fw-medium border-cell pa-b">
              organization
            </div>
          </div>
          <div className="row m-0 border-cell">
            <div className="col-4 fw-bold border-cell pa-b">
              Auditor Company
            </div>
            <div className="col-8 text-muted fw-medium border-cell pa-b">
              company name
            </div>
          </div>
          <div className="row m-0 border-cell">
            <div className="col-4 fw-bold border-cell pa-b">Certified For</div>
            <div className="col-8 text-muted fw-medium border-cell pa-b">
              Company Name
            </div>
          </div>
          <div className="row m-0 border-cell">
            <div className="col-4 fw-bold border-cell pa-b">
              Audit Framework
            </div>
            <div className="col-8 text-muted fw-medium border-cell pa-b">
              Framework
            </div>
          </div>
          <div className="row m-0 border-cell">
            <div className="col-4 fw-bold border-cell pa-b">Expiry Date</div>
            <div className="col-8 text-muted fw-medium border-cell pa-b">
              Expiry date
            </div>
          </div>
        </div>

        {/* Right Column: Ratings */}
        <div className="col-md-6">
          <div className="row">
            <div className="col-12 text-center border-cell border-3 p-3">
              <p className="fw-bold text-start">Assessment Rating</p>
              <h1 className="display-1">4/5</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center border-cell border-3 p-3">
              <p className="fw-bold text-start">Audit Rating</p>
              <h1 className="display-1">5/5</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassionAuditFrameworkComponent;
