import React from "react";
import "./HomePage.css";
import logo from "../images/logo.png";
import process from "../images/pcombinator-process.png";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <div className="audits-container ">
      <header className="audits-header mt-4">
        <img className="audits-logo" src={logo} alt="Audits Logo" />
        <div className="title-section">
          <h1 className="audits-title">PASSION FRAMEWORK</h1>
          <h1 className="audits-subtitle">AUDITS</h1>
        </div>
        <div className="audit-login" style={{ marginLeft: "500px" }}>
          <p>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Login / Signup
            </Link>
          </p>
        </div>
      </header>

      <section className="about-us">
        <h2>About us</h2>
        <p>
          The PASSION FRAMEWORK is an advanced, cost-effective audit framework
          tailored to diverse industries. It supports over 500 sectors, ensuring
          thorough evaluation and optimization for regulatory compliance and
          operational efficiency. Ideal for startups, SMEs, and large
          corporations, our team of experts promotes ethical practices and
          continuous improvement, driving sustainable growth and prosperity.
        </p>
      </section>

      <section className="holistic-auditing">
        <div style={{ maxWidth: "500px" }}>
          <h2>Holistic Auditing</h2>
          <p>
            Rooted in Probing, Innovating, Acting, Scoping, Setting, Owning, and
            Nurturing
          </p>
        </div>
        <div class="image-container">
          <img
            className="auditing-diagram"
            src={process}
            alt="Holistic Auditing Diagram"
          />
          <div className="watermark"></div>
        </div>
      </section>

      <section className="mission-vision">
        <div className="mission">
          <h2>Mission</h2>
          <p>
            Our mission is to provide a robust and adaptable audit framework
            that empowers organizations to probe, innovate, act, scope, set,
            own, and nurture their processes effectively. We aim to drive
            continuous improvement, regulatory compliance, and stakeholder
            satisfaction through meticulous and insightful audits.
          </p>
        </div>
        <div className="vision mt-4" style={{ gap: "240px" }}>
          <h2>Vision</h2>
          <p>
            To be the leading framework for comprehensive and holistic auditing
            that ensures excellence, transparency, and sustainable growth across
            all industry value chains.
          </p>
        </div>
      </section>

      <section className="value-proposition" style={{ marginTop: "100px" }}>
        <h2>Value Proposition</h2>
        <p>
          The PASSION FRAMEWORK offers a unique, multi-dimensional approach to
          auditing that integrates traditional audit principles with innovative
          strategies. By addressing every stage of the value chain, our
          framework ensures:
        </p>
        <ul>
          <li>
            • Comprehensive assessment of operational efficiency and compliance.
          </li>
          <li>
            • Identification of opportunities for innovation and improvement.
          </li>
          <li> • Enhanced risk management and environmental stewardship.</li>
          <li>• Optimal resource allocation and process efficiency.</li>
          <li>• Transparent and accountable governance.</li>
          <li>• Sustained growth and stakeholder value.</li>
        </ul>
      </section>

      <footer className="audits-footer">
        <p>
          <a href="mailto:passionit.prakashsharma@gmail.com">
            passionit.prakashsharma@gmail.com
          </a>{" "}
          | +91 83902 34456
        </p>
        <p>
          Follow us at <a href="https://linkedin.com">LinkedIn</a> | Visit our
          Website:{" "}
          <a href="https://passionframework.org">passionframework.org</a>
        </p>
      </footer>
    </div>
  );
};
export default HomePage;
