const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
// PostgreSQL Connection
const port = process.env.PORT; // Choose your desired port

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
const jwt = require("jsonwebtoken");
// Connect to PostgreSQL
pool
  .connect()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.error("PostgreSQL Connection Error", err.stack));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Signup Endpoint
app.post("/startup-api/signup", async (req, res) => {
  const { email, password, name } = req.body;

  function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  try {
    // Check if user already exists
    const user = await pool.query(
      "SELECT * FROM startupuser WHERE user_email = $1",
      [email]
    );

    if (user.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and set expiry (10 minutes from now)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store user with hashed password, OTP, and expiry in database
    await pool.query(
      "INSERT INTO startupuser (user_email, user_password, user_name, user_otp, otp_expiry) VALUES ($1, $2, $3, $4, $5)",
      [email, hashedPassword, name, otp, otpExpiry]
    );

    // Send OTP to user's email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for Email Verification",
      html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p>Hello,</p>
          <p>Your OTP for email verification is:</p>
          <h2 style="font-size: 24px; font-weight: bold; color: #ff3131;">${otp}</h2>
          <p>This OTP will expire in 10 minutes. Please use it to verify your email address.</p>
          <p>If you did not request this, please ignore this email.</p>
          <div style="text-align: center; font-size: 14px; color: #888; margin-top: 20px;">
            <p>&copy; ${new Date().getFullYear()} Passion Framework Audit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    });

    res.status(201).json({
      message:
        "User registered successfully. Please verify your email using the OTP sent to your email.",
    });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ message: "Error signing up" });
  }
});

// OTP Verification route
app.post("/startup-api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Fetch user by email
    const user = await pool.query(
      "SELECT * FROM startupuser WHERE user_email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const userData = user.rows[0];

    // Check if OTP matches and is not expired
    if (
      userData.user_otp === otp &&
      new Date() < new Date(userData.otp_expiry)
    ) {
      // Mark user as verified
      await pool.query(
        "UPDATE startupuser SET is_verified = true, user_otp = NULL, otp_expiry = NULL WHERE user_email = $1",
        [email]
      );

      res
        .status(200)
        .json({ message: "User verified successfully. You can now log in." });
    } else {
      res
        .status(400)
        .json({ message: "Invalid or expired OTP. Please try again." });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

/****************************************UPDATE PASSWORD API************************************************** */

// Forgot Password API
app.post("/startup-api/password", async (req, res) => {
  const { user_id, password } = req.body;

  try {
    // Fetch the user from the database by user_id
    const result = await pool.query(
      "SELECT * FROM startupuser WHERE user_id = $1",
      [user_id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await pool.query(
      "UPDATE startupuser SET user_password = $1 WHERE user_id = $2",
      [hashedNewPassword, user_id]
    );

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
});

/******************************************LOGIN API************************************************* */
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key
// Login Endpoint
app.post("/startup-api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await pool.query(
      "SELECT * FROM startupuser WHERE user_email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, result.rows[0].user_password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (result.rows[0].is_verified !== true) {
      return res.status(401).json({ message: " Unverified Account" });
    }
    const userName = result.rows[0].user_name;
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result.rows[0].user_id,
        email: result.rows[0].user_email,
        userName: result.rows[0].user_name,
      },
      secretKey,
      {
        expiresIn: "1h", // Token expires in 1 hour
        issuer: process.env.CLIENT_URL, // The issuer of the token
        audience: userName, // The intended audience
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*******************************************************************OrganizationApi***************************************************************************** */

/*GET ALL Organization */
app.get("/startup-api/userOrganization/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sqlGet = "SELECT * FROM public.organization where user_id=$1";
  pool.query(sqlGet, [user_id], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

/*DELETE ORGANIZATION*/
app.delete("/startup-api/organization/:organizationid", (req, res) => {
  const { organizationid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS organizationCount FROM public.organization WHERE organizationid = $1";
  const sqlRemove = "DELETE FROM public.organization WHERE organizationid = $1";

  pool.query(sqlCheckPhase, [organizationid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while checking Organization.");
    }

    const organizationCount = result.rows[0].organizationCount;

    if (organizationCount > 0) {
      return res
        .status(400)
        .send("Cannot delete Organization with associates.");
    }

    pool.query(sqlRemove, [organizationid], (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while deleting Organization.");
      }

      res.send("Organization deleted successfully.");
    });
  });
});

/**SPECIFIC ORGANIZATION */

app.get("/startup-api/organization/:organizationid", async (req, res) => {
  try {
    const { organizationid } = req.params;
    const sqlGet =
      "SELECT * FROM public.organization WHERE organizationid = $1";

    const result = await pool.query(sqlGet, [organizationid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Organization.");
  }
});

app.post("/startup-api/organization", (req, res) => {
  const { organization, contactname, contactemail, contactphone, userId } =
    req.body;
  const sqlInsert =
    "INSERT INTO public.organization(organization, contactname, contactemail, contactphone,user_id) VALUES ($1, $2, $3, $4,$5)";
  const values = [
    organization,
    contactname,
    contactemail,
    contactphone,
    userId,
  ];

  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Organization:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Organization inserted successfully" });
    }
  });
});

//for editing the Organization
app.put("/startup-api/organization/:organizationid", (req, res) => {
  const { organizationid } = req.params;
  const { organization, contactname, contactemail, contactphone } = req.body;
  const sqlUpdate =
    "UPDATE public.organization SET organization=$1,contactname=$2,contactemail=$3,contactphone=$4 WHERE organizationid = $5";

  pool.query(
    sqlUpdate,
    [organization, contactname, contactemail, contactphone, organizationid],
    (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while updating the Organization.");
      }

      res.send("Organizationupdated successfully.");
    }
  );
});
//GET ORGANIZATION BY NAME
app.get("/startup-api/organizationName/:organization", async (req, res) => {
  try {
    const { organization } = req.params;
    const sqlGet = "SELECT * FROM public.organization WHERE organization = $1";

    const result = await pool.query(sqlGet, [organization]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Organization.");
  }
});

/****************************************************************Environment API********************************************************************** */
//GET Environment API
app.get("/startup-api/environment", (req, res) => {
  const sqlGet = "SELECT * from public.environment";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD Environment API
app.post("/startup-api/environment", (req, res) => {
  const { environmentname, environmentdescription } = req.body;
  const sqlInsert =
    "INSERT INTO public.environment(environmentname,environmentdescription) values($1 ,$2)";
  const values = [environmentname, environmentdescription];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " Environment Inserted sucessfully" });
    }
  });
});
//Delete Environment API
app.delete("/startup-api/environment/:environmentid", (req, res) => {
  const { environmentid } = req.params;
  const sqlRemove = "Delete from public.environment where environmentid=$1";
  pool.query(sqlRemove, [environmentid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send("Environment deleted successfully");
  });
});
//Specific Environment API
app.get("/startup-api/environment/:environmentid", async (req, res) => {
  try {
    const { environmentid } = req.params;
    const sqlGet = "SELECT * FROM public.environment WHERE environmentid=$1";
    const result = await pool.query(sqlGet, [environmentid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
//Update Environment API
app.put("/startup-api/environment/:environmentid", (req, res) => {
  const { environmentid } = req.params;
  const { environmentname, environmentdescription } = req.body;

  const sqlUpdate =
    "UPDATE public.environment SET environmentname=$1, environmentdescription=$2 WHERE environmentid=$3";
  pool.query(
    sqlUpdate,
    [environmentname, environmentdescription, environmentid],
    (error, result) => {
      if (error) {
        console.error("Error updating Environment", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/******************************************************STAKEHOLDER API******************************************************************* ***/
//GET STAKEHOLDER
app.get("/startup-api/stakeholder", (req, res) => {
  const sqlGet = "SELECT * from public.stakeholder";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD STAKEHOLDER
app.post("/startup-api/stakeholder", (req, res) => {
  const {
    stakeholdername,
    stakeholdercontact,
    stakeholderemail,
    stakeholdertype,
    stakeholdercategory,
  } = req.body;
  const sqlInsert =
    "INSERT INTO public.stakeholder (stakeholdername, stakeholdercontact, stakeholderemail, stakeholdertype, stakeholdercategory) values($1, $2 ,$3,$4,$5)";
  const values = [
    stakeholdername,
    stakeholdercontact,
    stakeholderemail,
    stakeholdertype,
    stakeholdercategory,
  ];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});
//DELETE STAKEHOLDER
app.delete("/startup-api/stakeholder/:stakeholderid", (req, res) => {
  const { stakeholderid } = req.params;
  const sqlRemove = "Delete from public.stakeholder where stakeholderid=$1";
  pool.query(sqlRemove, [stakeholderid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" Stakeholder Deleted Successfully");
  });
});
//GET SPECIFIC STAKEHOLDER
app.get("/startup-api/stakeholder/:stakeholderid", async (req, res) => {
  try {
    const { stakeholderid } = req.params;
    const sqlGet = "SELECT * FROM public.stakeholder WHERE stakeholderid=$1";
    const result = await pool.query(sqlGet, [stakeholderid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
//UPDATE STAKEHOLDER
app.put("/startup-api/stakeholder/:stakeholderid", (req, res) => {
  const { stakeholderid } = req.params;
  const {
    stakeholdername,
    stakeholdercontact,
    stakeholderemail,
    stakeholdertype,
    stakeholdercategory,
  } = req.body;

  const sqlUpdate = `UPDATE public.stakeholder SET stakeholdername=$1,
    stakeholdercontact=$2,
    stakeholderemail=$3,
    stakeholdertype=$4,
    stakeholdercategory=$5 WHERE stakeholderid=$6`;
  pool.query(
    sqlUpdate,
    [
      stakeholdername,
      stakeholdercontact,
      stakeholderemail,
      stakeholdertype,
      stakeholdercategory,
      stakeholderid,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating Stakeholder", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Stakeholder Updated successfully");
    }
  );
});
/*****************************************VULNERABILITIES APIS******************************************************************************** */
//GET VULNERABILITIES
app.get("/startup-api/vulnerability", (req, res) => {
  const sqlGet = "SELECT * from public.vulnerability";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD VULNERABILITIES
app.post("/startup-api/vulnerability", (req, res) => {
  const { vulnerabilityname, threat, mitigationstrategy, contigencyplan } =
    req.body;
  const sqlInsert =
    "INSERT INTO public.vulnerability (vulnerabilityname,threat,mitigationstrategy,contigencyplan) values($1 ,$2, $3, $4)";
  const values = [
    vulnerabilityname,
    threat,
    mitigationstrategy,
    contigencyplan,
  ];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});
//DELETE VULNERABILITIES
app.delete("/startup-api/vulnerability/:vulnerabilityid", (req, res) => {
  const { vulnerabilityid } = req.params;
  const sqlRemove = "Delete from public.vulnerability where vulnerabilityid=$1";
  pool.query(sqlRemove, [vulnerabilityid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});
//GET SPECIFIC VULNERABILITIES
app.get("/startup-api/vulnerability/:vulnerabilityid", async (req, res) => {
  try {
    const { vulnerabilityid } = req.params;
    const sqlGet =
      "SELECT * FROM public.vulnerability WHERE vulnerabilityid=$1";
    const result = await pool.query(sqlGet, [vulnerabilityid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
//UPDATE VULNERABILITIES
app.put("/startup-api/vulnerability/:vulnerabilityid", (req, res) => {
  const { vulnerabilityid } = req.params;
  const { vulnerabilityname, threat, mitigationstrategy, contigencyplan } =
    req.body;

  const sqlUpdate =
    "UPDATE public.vulnerability SET vulnerabilityname=$1,threat=$2,mitigationstrategy=$3,contigencyplan=$4 WHERE vulnerabilityid=$5";
  pool.query(
    sqlUpdate,
    [
      vulnerabilityname,
      threat,
      mitigationstrategy,
      contigencyplan,
      vulnerabilityid,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});
/*****************************************TECHNOLOGY APIS*********************************************************** */
//GET TECHNOLOGIES
app.get("/startup-api/technology", (req, res) => {
  const sqlGet = "SELECT * from public.technology";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD TECHNOLOGIES
app.post("/startup-api/technology", (req, res) => {
  const { technologyname, technologyversion } = req.body;
  const sqlInsert =
    "INSERT INTO public.technology (technologyname,technologyversion) values($1, $2 )";
  const values = [technologyname, technologyversion];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});
//DELETE TECHNOLOGIES
app.delete("/startup-api/technology/:technologyid", (req, res) => {
  const { technologyid } = req.params;
  const sqlRemove = "Delete from public.technology where technologyid=$1";
  pool.query(sqlRemove, [technologyid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});
//GET SPECIFIC TECHNOLOGIES
app.get("/startup-api/technology/:technologyid", async (req, res) => {
  try {
    const { technologyid } = req.params;
    const sqlGet = "SELECT * FROM public.technology WHERE technologyid=$1";
    const result = await pool.query(sqlGet, [technologyid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
//UPDATE TECHNOLOGIES
app.put("/startup-api/technology/:technologyid", (req, res) => {
  const { technologyid } = req.params;
  const { technologyname, technologyversion } = req.body;

  const sqlUpdate =
    "UPDATE public.technology SET technologyname=$1, technologyversion=$2 WHERE technologyid=$3";
  pool.query(
    sqlUpdate,
    [technologyname, technologyversion, technologyid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});
/*****************************************PROJECT TYPE APIS*********************************************************** */
//GET PROJECT TYPE
app.get("/startup-api/projecttype", (req, res) => {
  const sqlGet = "SELECT * from public.projecttype";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD PROJECT TYPE
app.post("/startup-api/projecttype", (req, res) => {
  const { projecttype } = req.body;
  const sqlInsert = "INSERT INTO public.projecttype (projecttype) values($1)";
  const values = [projecttype];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " Inserted Sucessfully" });
    }
  });
});
//DELETE PROJECT TYPE
app.delete("/startup-api/projecttype/:projecttypeid", (req, res) => {
  const { projecttypeid } = req.params;
  const sqlRemove = "Delete from public.projecttype where projecttypeid=$1";
  pool.query(sqlRemove, [projecttypeid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" Deleted Successfully");
  });
});
//GET SPECIFIC PROJECT TYPE
app.get("/startup-api/projecttype/:projecttypeid", async (req, res) => {
  try {
    const { projecttypeid } = req.params;
    const sqlGet = "SELECT * FROM public.projecttype WHERE projecttypeid=$1";
    const result = await pool.query(sqlGet, [projecttypeid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
//UPDATE PROJECT TYPE
app.put("/startup-api/projecttype/:projecttypeid", (req, res) => {
  const { projecttypeid } = req.params;
  const { projecttype } = req.body;

  const sqlUpdate =
    "UPDATE public.projecttype SET projecttype=$1 WHERE projecttypeid=$2";
  pool.query(sqlUpdate, [projecttype, projecttypeid], (error, result) => {
    if (error) {
      console.error("Error updating theme activity:", error);
      return res.status(500).send("An error occurred while updating");
    }
    res.send("Updated successfully");
  });
});

/*****************************************PROJECT CATEGORY APIS*********************************************************** */
//GET PROJECT CATEGORY
app.get("/startup-api/projectcategory", (req, res) => {
  const sqlGet = "SELECT * from public.projectcategory";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD PROJECT CATEGORY
app.post("/startup-api/projectcategory", (req, res) => {
  const { projectcategory } = req.body;
  const sqlInsert =
    "INSERT INTO public.projectcategory (projectcategory) values($1)";
  const values = [projectcategory];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " Inserted Sucessfully" });
    }
  });
});
//DELETE PROJECT CATEGORY
app.delete("/startup-api/projectcategory/:projectcategoryid", (req, res) => {
  const { projectcategoryid } = req.params;
  const sqlRemove =
    "Delete from public.projectcategory where projectcategoryid=$1";
  pool.query(sqlRemove, [projectcategoryid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" Deleted Successfully");
  });
});
//GET SPECIFIC PROJECT CATEGORY
app.get("/startup-api/projectcategory/:projectcategoryid", async (req, res) => {
  try {
    const { projectcategoryid } = req.params;
    const sqlGet =
      "SELECT * FROM public.projectcategory WHERE projectcategoryid=$1";
    const result = await pool.query(sqlGet, [projectcategoryid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
//UPDATE PROJECT CATEGORY
app.put("/startup-api/projectcategory/:projectcategoryid", (req, res) => {
  const { projectcategoryid } = req.params;
  const { projectcategory } = req.body;

  const sqlUpdate =
    "UPDATE public.projectcategory SET projectcategory=$1 WHERE projectcategoryid=$2";
  pool.query(
    sqlUpdate,
    [projectcategory, projectcategoryid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});
/***************************************RESPONSIBILITY CENTER APIS**************************************** */
// GET all responsibility centers
app.get("/startup-api/responsibilitycenter", async (req, res) => {
  try {
    const sqlGet = "SELECT * FROM public.responsibility_center";
    const result = await pool.query(sqlGet);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching responsibility centers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(
  "/startup-api/responsibilitycenter/:responsibilitycenterid",
  async (req, res) => {
    try {
      const { responsibilitycenterid } = req.params;
      const sqlGet =
        "SELECT responsibilitycentername FROM public.responsibility_center WHERE responsibilitycenterid=$1";
      const result = await pool.query(sqlGet, [responsibilitycenterid]);
      res.send(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("an error occurred while fectching ");
    }
  }
);

// CREATE a new responsibility center
app.post("/startup-api/responsibilitycenter", async (req, res) => {
  const { responsibilitycentername } = req.body;

  // Validation
  if (!responsibilitycentername) {
    return res
      .status(400)
      .json({ error: "Responsibility center name is required" });
  }

  try {
    const sqlInsert =
      "INSERT INTO public.responsibility_center(responsibilitycentername) VALUES($1)";
    await pool.query(sqlInsert, [responsibilitycentername]);
    res
      .status(201)
      .json({ message: "Responsibility center created successfully" });
  } catch (error) {
    console.error("Error creating responsibility center:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE a responsibility center by ID
app.put(
  "/startup-api/responsibilitycenter/:responsibilitycenterid",
  async (req, res) => {
    const { responsibilitycenterid } = req.params;
    const { responsibilitycentername } = req.body;

    // Validation
    if (!responsibilitycentername) {
      return res
        .status(400)
        .json({ error: "Responsibility center name is required" });
    }

    try {
      const sqlUpdate =
        "UPDATE public.responsibility_center SET responsibilitycentername=$1 WHERE responsibilitycenterid=$2";
      await pool.query(sqlUpdate, [
        responsibilitycentername,
        responsibilitycenterid,
      ]);
      res
        .status(200)
        .json({ message: "Responsibility center updated successfully" });
    } catch (error) {
      console.error("Error updating responsibility center:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE a responsibility center by ID
app.delete(
  "/startup-api/responsibilitycenter/:responsibilitycenterid",
  async (req, res) => {
    const { responsibilitycenterid } = req.params;

    try {
      const sqlDelete =
        "DELETE FROM public.responsibility_center WHERE responsibilitycenterid=$1";
      await pool.query(sqlDelete, [responsibilitycenterid]);
      res
        .status(200)
        .json({ message: "Responsibility center deleted successfully" });
    } catch (error) {
      console.error("Error deleting responsibility center:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
/***************************************RESPONSIBILITY GROUP APIS**************************************** */
// GET all responsibility group
app.get("/startup-api/responsibilitygroup", async (req, res) => {
  try {
    const sqlGet = "SELECT * FROM public.responsibility_group";
    const result = await pool.query(sqlGet);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching responsibility group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//GET RESPONSIBILITY GROUP BY ID
app.get(
  "/startup-api/responsibilitygroup/:responsibilitygroupid",
  async (req, res) => {
    try {
      const { responsibilitygroupid } = req.params;
      const sqlGet =
        "SELECT responsibilitygroupname FROM public.responsibility_group WHERE responsibilitygroupid=$1";
      const result = await pool.query(sqlGet, [responsibilitygroupid]);
      res.send(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("an error occurred while fectching ");
    }
  }
);

// CREATE a new responsibility group
app.post("/startup-api/responsibilitygroup", async (req, res) => {
  const { responsibilitygroupname } = req.body;

  // Validation
  if (!responsibilitygroupname) {
    return res
      .status(400)
      .json({ error: "Responsibility group name is required" });
  }

  try {
    const sqlInsert =
      "INSERT INTO public.responsibility_group(responsibilitygroupname) VALUES($1)";
    await pool.query(sqlInsert, [responsibilitygroupname]);
    res
      .status(201)
      .json({ message: "Responsibility group created successfully" });
  } catch (error) {
    console.error("Error creating responsibility group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE a responsibility group by ID
app.put(
  "/startup-api/responsibilitygroup/:responsibilitygroupid",
  async (req, res) => {
    const { responsibilitygroupid } = req.params;
    const { responsibilitygroupname } = req.body;

    // Validation
    if (!responsibilitygroupname) {
      return res
        .status(400)
        .json({ error: "Responsibility group name is required" });
    }

    try {
      const sqlUpdate =
        "UPDATE public.responsibility_group SET responsibilitygroupname=$1 WHERE responsibilitygroupid=$2";
      await pool.query(sqlUpdate, [
        responsibilitygroupname,
        responsibilitygroupid,
      ]);
      res
        .status(200)
        .json({ message: "Responsibility group updated successfully" });
    } catch (error) {
      console.error("Error updating responsibility group:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE a responsibility center by ID
app.delete(
  "/startup-api/responsibilitygroup/:responsibilitygroupid",
  async (req, res) => {
    const { responsibilitygroupid } = req.params;

    try {
      const sqlDelete =
        "DELETE FROM public.responsibility_group WHERE responsibilitygroupid=$1";
      await pool.query(sqlDelete, [responsibilitygroupid]);
      res
        .status(200)
        .json({ message: "Responsibility group deleted successfully" });
    } catch (error) {
      console.error("Error deleting responsibility group:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/*********************************************THEME MASTER API****************************************************/
//GET ALL THEME MASTER
app.get("/startup-api/thememaster", (req, res) => {
  const sqlGet = "SELECT * from public.thememaster";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD THEME MASTER
app.post("/startup-api/thememaster", (req, res) => {
  const { themecode, themename } = req.body;
  const sqlInsert =
    "INSERT INTO public.thememaster (themecode,themename) values($1, $2)";
  const values = [themecode, themename];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting thememaster", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: "Thememaster Inserted Sucessfully" });
    }
  });
});
//DELETE THEME MASTER
app.delete("/startup-api/thememaster/:thememasterid", (req, res) => {
  const { thememasterid } = req.params;
  const sqlRemove = "Delete from public.thememaster where thememasterid=$1";
  pool.query(sqlRemove, [thememasterid], (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send("an error occurred while deleting thememaster");
    }
    res.send("Thememaster Deleted Successfully");
  });
});
//GET THEMEMASTER BY ID
app.get("/startup-api/thememaster/:thememasterid", async (req, res) => {
  try {
    const { thememasterid } = req.params;
    const sqlGet = "SELECT * FROM public.thememaster WHERE thememasterid=$1";
    const result = await pool.query(sqlGet, [thememasterid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching thethememaster");
  }
});
//UPDATE THEME MASTER BY ID
app.put("/startup-api/thememaster/:thememasterid", (req, res) => {
  const { thememasterid } = req.params;
  const { themecode, themename } = req.body;

  const sqlUpdate =
    "UPDATE public.thememaster SET themecode=$1,themename=$2 WHERE thememasterid=$3";
  pool.query(
    sqlUpdate,
    [themecode, themename, thememasterid],
    (error, result) => {
      if (error) {
        console.error("error inserting object type", error);
        return res
          .status(500)
          .send("an error occurred while updating the object type");
      }
      res.send("object type updated sucessfully");
    }
  );
});
/********************************************************THEME ACTIVITY********************************************/
//GET THEME ACTIVITY
app.get("/startup-api/themeactivity", (req, res) => {
  const sqlGet = "SELECT * from public.themeactivity";
  pool.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
//ADD THEME ACTIVITY
app.post("/startup-api/themeactivity", (req, res) => {
  const { themename, phase, activitygroup, activity } = req.body;
  const sqlInsert =
    "INSERT INTO public.themeactivity (themename,phase,activitygroup,activity) values($1, $2 ,$3 ,$4)";
  const values = [themename, phase, activitygroup, activity];
  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});
//DELETE THEME ACTIVITY
app.delete("/startup-api/themeactivity/:themeactivityid", (req, res) => {
  const { themeactivityid } = req.params;
  const sqlRemove = "Delete from public.themeactivity where themeactivityid=$1";
  pool.query(sqlRemove, [themeactivityid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send("Theme Activity Deleted successfully");
  });
});
//GET THEME ACTIVITY BY ID
app.get("/startup-api/themeactivity/:themeactivityid", async (req, res) => {
  try {
    const { themeactivityid } = req.params;
    const sqlGet =
      "SELECT * FROM public.themeactivity WHERE themeactivityid=$1";
    const result = await pool.query(sqlGet, [themeactivityid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
//UPDATE THEME ACTIVITY
app.put("/startup-api/themeactivity/:themeactivityid", (req, res) => {
  const { themeactivityid } = req.params;
  const { themename, phase, activitygroup, activity } = req.body;

  const sqlUpdate =
    "UPDATE public.themeactivity SET themename=$1, phase=$2, activitygroup=$3, activity=$4 WHERE themeactivityid=$5";
  pool.query(
    sqlUpdate,
    [themename, phase, activitygroup, activity, themeactivityid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/*********************************ACTIVITY GROUP APIS**************************************************** */
//GET GROUP ACTIVITY
app.get("/startup-api/activitygroup", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.activitygroup");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//ADD GROUP ACTIVITY
app.post("/startup-api/activitygroup", async (req, res) => {
  const { activitygroupname } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO public.activitygroup( activitygroupname) VALUES($1) RETURNING *",
      [activitygroupname]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
//GET GROUP ACTIVITY BY ID
app.get("/startup-api/activitygroup/:activitygroupid", async (req, res) => {
  const { activitygroupid } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM public.activitygroup WHERE activitygroupid = $1",
      [activitygroupid]
    );

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//UPDATE GROUP ACTIVITY
app.put("/startup-api/activitygroup/:activitygroupid", async (req, res) => {
  const { activitygroupid } = req.params;
  const { activitygroupname } = req.body;
  try {
    const result = await pool.query(
      "UPDATE public.activitygroup SET activitygroupname = $1 WHERE activitygroupid = $2 ",
      [activitygroupname, activitygroupid]
    );

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
//DELETE ACTIVITY GROUP
app.delete("/startup-api/activitygroup/:activitygroupid", async (req, res) => {
  const { activitygroupid } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM public.activitygroup WHERE activitygroupid = $1 ",
      [activitygroupid]
    );

    res.send({ message: "Activity group deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

/***************************************GOVERNANCE GROUP APIS**************************************** */
// GET GOVERNANCE GROUP
app.get("/startup-api/governancegroup", async (req, res) => {
  try {
    const sqlGet = "SELECT * FROM public.governancegroup";
    const result = await pool.query(sqlGet);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching governance group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//GET GOVERNANCE GROUP BY ID
app.get("/startup-api/governancegroup/:groupid", async (req, res) => {
  try {
    const { groupid } = req.params;
    const sqlGet =
      "SELECT groupname FROM public.governancegroup WHERE groupid=$1";
    const result = await pool.query(sqlGet, [groupid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

// CREATE GOVERNANCE GROUP
app.post("/startup-api/governancegroup", async (req, res) => {
  const { groupname } = req.body;

  // Validation
  if (!groupname) {
    return res.status(400).json({ error: "Governance Group name is required" });
  }

  try {
    const sqlInsert =
      "INSERT INTO public.governancegroup(groupname) VALUES($1)";
    await pool.query(sqlInsert, [groupname]);
    res.status(201).json({ message: "Governance Group created successfully" });
  } catch (error) {
    console.error("Error creating Governance Group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE GOVERNANCE GROUP BY ID
app.put("/startup-api/governancegroup/:groupid", async (req, res) => {
  const { groupid } = req.params;
  const { groupname } = req.body;

  // Validation
  if (!groupname) {
    return res.status(400).json({ error: "Governance Group name is required" });
  }

  try {
    const sqlUpdate =
      "UPDATE public.governancegroup SET groupname=$1 WHERE groupid=$2";
    await pool.query(sqlUpdate, [groupname, groupid]);
    res.status(200).json({ message: "Governance Group updated successfully" });
  } catch (error) {
    console.error("Error updating Governance Group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE GOVERNANCE GROUP
app.delete("/startup-api/governancegroup/:groupid", async (req, res) => {
  const { groupid } = req.params;

  try {
    const sqlDelete = "DELETE FROM public.governancegroup WHERE groupid=$1";
    await pool.query(sqlDelete, [groupid]);
    res.status(200).json({ message: "Governance Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting Governance Group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/***************************************THRUST AREA APIS**************************************** */
// GET THRUST AREA
app.get("/startup-api/thrustarea", async (req, res) => {
  try {
    const sqlGet = "SELECT * FROM public.thrustarea";
    const result = await pool.query(sqlGet);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching Thrust area:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//GET THRUST AREA BY ID
app.get("/startup-api/thrustarea/:thrustid", async (req, res) => {
  try {
    const { thrustid } = req.params;
    const sqlGet = "SELECT thrustarea FROM public.thrustarea WHERE thrustid=$1";
    const result = await pool.query(sqlGet, [thrustid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

// CREATE THRUST AREA
app.post("/startup-api/thrustarea", async (req, res) => {
  const { thrustarea } = req.body;

  // Validation
  if (!thrustarea) {
    return res.status(400).json({ error: "Thrust area name is required" });
  }

  try {
    const sqlInsert = "INSERT INTO public.thrustarea(thrustarea) VALUES($1)";
    await pool.query(sqlInsert, [thrustarea]);
    res.status(201).json({ message: "Thrust area created successfully" });
  } catch (error) {
    console.error("Error creating Thrust area:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE THRUST AREA BY ID
app.put("/startup-api/thrustarea/:thrustid", async (req, res) => {
  const { thrustid } = req.params;
  const { thrustarea } = req.body;

  // Validation
  if (!thrustarea) {
    return res.status(400).json({ error: "Thrust area name is required" });
  }

  try {
    const sqlUpdate =
      "UPDATE public.thrustarea SET thrustarea=$1 WHERE thrustid=$2";
    await pool.query(sqlUpdate, [thrustarea, thrustid]);
    res.status(200).json({ message: "Thrust area updated successfully" });
  } catch (error) {
    console.error("Error updating Thrust area:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE THRUST AREA
app.delete("/startup-api/thrustarea/:thrustid", async (req, res) => {
  const { thrustid } = req.params;

  try {
    const sqlDelete = "DELETE FROM public.thrustarea WHERE thrustid=$1";
    await pool.query(sqlDelete, [thrustid]);
    res.status(200).json({ message: "Thrust area deleted successfully" });
  } catch (error) {
    console.error("Error deleting Thrust area:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
/*************************************************GOVERNANCE CONTROL******************************************************** */
//GET GOVERNANCE CONTROL
app.get("/startup-api/governancecontrol", async (req, res) => {
  try {
    const sqlGet = "SELECT * FROM public.governancecontrol";
    const result = await pool.query(sqlGet);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching governance controls:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//GET GOVERNANCE CONTOL BY ID
app.get("/startup-api/governancecontrol/:controlid", async (req, res) => {
  try {
    const { controlid } = req.params;
    const sqlGet = "SELECT * FROM public.governancecontrol WHERE controlid=$1";
    const result = await pool.query(sqlGet, [controlid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Control not found" });
    }
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching governance control:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//ADD GOVERNANCE CONTOL
app.post("/startup-api/governancecontrol", async (req, res) => {
  const {
    controlname,
    thrustarea,
    controlwt,
    subcontrolname,
    groupname,
    evidence,
    subcontrolwt,
  } = req.body;

  // Validation
  if (
    !controlname ||
    !thrustarea ||
    !controlwt ||
    !subcontrolname ||
    !groupname ||
    !evidence ||
    !subcontrolwt
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sqlInsert = `
      INSERT INTO public.governancecontrol(
        controlname, thrustarea, controlwt, subcontrolname, groupname, evidence, subcontrolwt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(sqlInsert, [
      controlname,
      thrustarea,
      controlwt,
      subcontrolname,
      groupname,
      evidence,
      subcontrolwt,
    ]);
    res
      .status(201)
      .json({ message: "Governance control created successfully" });
  } catch (error) {
    console.error("Error creating governance control:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//UPDATE GOVERNANCE CONTROL
app.put("/startup-api/governancecontrol/:controlid", async (req, res) => {
  const { controlid } = req.params;
  const {
    controlname,
    thrustarea,
    controlwt,
    subcontrolname,
    groupname,
    evidence,
    subcontrolwt,
  } = req.body;

  // Validation
  if (
    !controlname ||
    !thrustarea ||
    !controlwt ||
    !subcontrolname ||
    !groupname ||
    !evidence ||
    !subcontrolwt
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sqlUpdate = `
      UPDATE public.governancecontrol
      SET controlname=$1, thrustarea=$2, controlwt=$3, subcontrolname=$4, groupname=$5, evidence=$6, subcontrolwt=$7
      WHERE controlid=$8
    `;
    await pool.query(sqlUpdate, [
      controlname,
      thrustarea,
      controlwt,
      subcontrolname,
      groupname,
      evidence,
      subcontrolwt,
      controlid,
    ]);
    res
      .status(200)
      .json({ message: "Governance control updated successfully" });
  } catch (error) {
    console.error("Error updating governance control:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//DELETE GOVERNANCE CONTROL
app.delete("/startup-api/governancecontrol/:controlid", async (req, res) => {
  const { controlid } = req.params;

  try {
    const sqlDelete = "DELETE FROM public.governancecontrol WHERE controlid=$1";
    await pool.query(sqlDelete, [controlid]);
    res
      .status(200)
      .json({ message: "Governance control deleted successfully" });
  } catch (error) {
    console.error("Error deleting governance control:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/***********************************************PROJECT DETAILS API******************************************************* */
// GET ALL PROJECT DETAILS
app.get("/startup-api/projectdetails", async (req, res) => {
  try {
    const sqlGet = "SELECT * FROM public.projectdetails";
    const result = await pool.query(sqlGet);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET PROJECT DETAILS BY PROJECTDETAILSID
app.get("/startup-api/projectdetails/:projectdetailsid", async (req, res) => {
  try {
    const { projectdetailsid } = req.params;
    const sqlGet =
      "SELECT * FROM public.projectdetails WHERE projectdetailsid=$1";
    const result = await pool.query(sqlGet, [projectdetailsid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching project detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//GET PROJECT DETAILS BY USERID
app.get("/startup-api/userprojectdetails/:user_id", async (req, res) => {
  try {
    const { user_id, organization } = req.params;
    const sqlGet = "SELECT * FROM public.projectdetails WHERE user_id=$1 ";
    const result = await pool.query(sqlGet, [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.send(result.rows);
  } catch (error) {
    console.error("Error fetching project detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//GET PROJECT DETAILS BY ORG AND USER ID
app.get(
  "/startup-api/projectdetails/:user_id/:organization",
  async (req, res) => {
    try {
      const { user_id, organization } = req.params;
      const sqlGet =
        "SELECT * FROM public.projectdetails WHERE user_id=$1 AND organization=$2";
      const result = await pool.query(sqlGet, [user_id, organization]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.send(result.rows);
    } catch (error) {
      console.error("Error fetching project detail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ADD PROJECT DETAIL
app.post("/startup-api/projectdetails", async (req, res) => {
  const {
    organization,
    projectname,
    projectcode,
    auditdate,
    audittime,
    objecttype,
    object,
    stakeholder,
    technology,
    environment,
    theme,
    themeactivity,
    issue,
    user_id,
    project_type,
    project_category,
    responsibilitycenter,
    responsibilitygroup,
    organizationid,
  } = req.body;

  // Validation
  if (!organization) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sqlInsert = `
      INSERT INTO public.projectdetails(
        organization, projectname, projectcode, auditdate, audittime, objecttype, object, stakeholder, technology, environment, theme, themeactivity, issue, user_id, project_type, project_category, responsibilitycenter, responsibilitygroup,organizationid
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,$19)
    `;
    await pool.query(sqlInsert, [
      organization,
      projectname,
      projectcode,
      auditdate,
      audittime,
      objecttype,
      object,
      stakeholder,
      technology,
      environment,
      theme,
      themeactivity,
      issue,
      user_id,
      project_type,
      project_category,
      responsibilitycenter,
      responsibilitygroup,
      organizationid,
    ]);
    res.status(201).json({ message: "Project detail created successfully" });
  } catch (error) {
    console.error("Error creating project detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE PROJECT DETAIL
app.put("/startup-api/projectdetails/:projectdetailsid", async (req, res) => {
  const { projectdetailsid } = req.params;
  const {
    organization,
    projectname,
    projectcode,
    auditdate,
    audittime,
    objecttype,
    object,
    stakeholder,
    technology,
    environment,
    theme,
    themeactivity,
    issue,
    user_id,
    project_type,
    project_category,
    responsibilitycenter,
    responsibilitygroup,
  } = req.body;

  // Validation
  if (!organization) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sqlUpdate = `
      UPDATE public.projectdetails
      SET organization=$1, projectname=$2, projectcode=$3, auditdate=$4, audittime=$5, objecttype=$6, object=$7, stakeholder=$8, technology=$9, environment=$10, theme=$11, themeactivity=$12, issue=$13, user_id=$14, project_type=$15, project_category=$16, responsibilitycenter=$17, responsibilitygroup=$18
      WHERE projectdetailsid=$19
    `;
    await pool.query(sqlUpdate, [
      organization,
      projectname,
      projectcode,
      auditdate,
      audittime,
      objecttype,
      object,
      stakeholder,
      technology,
      environment,
      theme,
      themeactivity,
      issue,
      user_id,
      project_type,
      project_category,
      responsibilitycenter,
      responsibilitygroup,
      projectdetailsid,
    ]);
    res.status(200).json({ message: "Project detail updated successfully" });
  } catch (error) {
    console.error("Error updating project detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE PROJECT DETAIL
app.delete(
  "/startup-api/projectdetails/:projectdetailsid",
  async (req, res) => {
    const { projectdetailsid } = req.params;

    try {
      const sqlDelete =
        "DELETE FROM public.projectdetails WHERE projectdetailsid=$1";
      await pool.query(sqlDelete, [projectdetailsid]);
      res.status(200).json({ message: "Project detail deleted successfully" });
    } catch (error) {
      console.error("Error deleting project detail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/***************************************************OBJECT URLS******************************************************** */
//GET ALL OBJECTS
app.get("/startup-api/object", (req, res) => {
  const sqlGet = "SELECT * FROM public.object";
  pool.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error fetching objects", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

//GET SPECIFIC OBJECT
app.get("/startup-api/object/:objectid", (req, res) => {
  const { objectid } = req.params;
  const sqlGet = "SELECT * FROM public.object WHERE objectid = $1";

  pool.query(sqlGet, [objectid], (error, result) => {
    if (error) {
      console.error("Error fetching object", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

//ADD OBJECT
app.post("/startup-api/object", (req, res) => {
  const {
    objectname,
    objectcode,
    objectdescription,
    dependentobjectcode,
    iconupload,
    fileupload,
  } = req.body;

  const sqlInsert =
    "INSERT INTO public.object(objectname, objectcode, objectdescription, dependentobjectcode, iconupload, fileupload) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [
    objectname,
    objectcode,
    objectdescription,
    dependentobjectcode,
    iconupload,
    fileupload,
  ];

  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting object", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Object inserted successfully" });
    }
  });
});

//UPDATE OBJECT
app.put("/startup-api/object/:objectid", (req, res) => {
  const { objectid } = req.params;
  const {
    objectname,
    objectcode,
    objectdescription,
    dependentobjectcode,
    iconupload,
    fileupload,
  } = req.body;

  const sqlUpdate =
    "UPDATE public.object SET objectname = $1, objectcode = $2, objectdescription = $3, dependentobjectcode = $4, iconupload = $5, fileupload = $6 WHERE objectid = $7";
  const values = [
    objectname,
    objectcode,
    objectdescription,
    dependentobjectcode,
    iconupload,
    fileupload,
    objectid,
  ];

  pool.query(sqlUpdate, values, (error, result) => {
    if (error) {
      console.error("Error updating object", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Object updated successfully" });
    }
  });
});

//DELETE OBJECT
app.delete("/startup-api/object/:objectid", (req, res) => {
  const { objectid } = req.params;
  const sqlDelete = "DELETE FROM public.object WHERE objectid = $1";

  pool.query(sqlDelete, [objectid], (error, result) => {
    if (error) {
      console.error("Error deleting object", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Object deleted successfully" });
    }
  });
});
/***************************************************OBJECT TYPE APIS*********************************************************** */
//GET ALL OBJECT TYPE
app.get("/startup-api/objecttype", (req, res) => {
  const sqlGet = "SELECT * FROM public.objecttype";
  pool.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error fetching object types", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

//GET OBJECT TYPE BY ID
app.get("/startup-api/objecttype/:objecttypeid", (req, res) => {
  const { objecttypeid } = req.params;
  const sqlGet = "SELECT * FROM public.objecttype WHERE objecttypeid = $1";

  pool.query(sqlGet, [objecttypeid], (error, result) => {
    if (error) {
      console.error("Error fetching object type", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

//ADD OBJECT TYPE
app.post("/startup-api/objecttype", (req, res) => {
  const { objecttype, objecttypedescription, iconupload, fileupload } =
    req.body;

  const sqlInsert =
    "INSERT INTO public.objecttype(objecttype, objecttypedescription, iconupload, fileupload) VALUES ($1, $2, $3, $4 )";
  const values = [objecttype, objecttypedescription, iconupload, fileupload];

  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting object type", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Object type inserted successfully" });
    }
  });
});

//UPDATE OBJECT TYPE
app.put("/startup-api/objecttype/:objecttypeid", (req, res) => {
  const { objecttypeid } = req.params;
  const { objecttype, objecttypedescription, iconupload, fileupload } =
    req.body;

  const sqlUpdate =
    "UPDATE public.objecttype SET objecttype = $1, objecttypedescription = $2, iconupload = $3, fileupload = $4 WHERE objecttypeid = $5";
  const values = [
    objecttype,
    objecttypedescription,
    iconupload,
    fileupload,
    objecttypeid,
  ];

  pool.query(sqlUpdate, values, (error, result) => {
    if (error) {
      console.error("Error updating object type", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Object type updated successfully" });
    }
  });
});

//DELETE OBJECT TYPE
app.delete("/startup-api/objecttype/:objecttypeid", (req, res) => {
  const { objecttypeid } = req.params;
  const sqlDelete = "DELETE FROM public.objecttype WHERE objecttypeid = $1";

  pool.query(sqlDelete, [objecttypeid], (error, result) => {
    if (error) {
      console.error("Error deleting object type", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Object type deleted successfully" });
    }
  });
});
/*************************************************EVIDENCE APIS********************************************************* */
//GET ALL EVIDENCE
app.get("/startup-api/evidence", (req, res) => {
  const sqlGet = "SELECT * FROM public.evidence";
  pool.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error fetching evidence records", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

//GET EVIDENCE BY USERID AND PROJECTID
app.get("/startup-api/evidence/:user_id/:projectdetailsid", (req, res) => {
  const { user_id, projectdetailsid } = req.params;
  const sqlGet =
    "SELECT * FROM public.evidence WHERE user_id = $1 AND projectdetailsid=$2";

  pool.query(sqlGet, [user_id, projectdetailsid], (error, result) => {
    if (error) {
      console.error("Error fetching evidence record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//GET EVIDENCE BY ID
app.get("/startup-api/evidence/:evidenceid", (req, res) => {
  const { evidenceid } = req.params;
  const sqlGet = "SELECT * FROM public.evidence WHERE evidenceid = $1";

  pool.query(sqlGet, [evidenceid], (error, result) => {
    if (error) {
      console.error("Error fetching evidence record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//CREATE EVIDENCE
app.post("/startup-api/evidence", (req, res) => {
  const {
    projectdetailsid,
    user_id,
    governancegroup,
    thrustarea,
    controlname,
    controlwt,
    subcontrolname,
    subcontrolwt,
    expectedevidence,
    evidencereferencelink,
    evidenceremark,
    evidencestatus,
  } = req.body;

  const sqlInsert =
    "INSERT INTO public.evidence( projectdetailsid, user_id, governancegroup, thrustarea, controlname, controlwt, subcontrolname, subcontrolwt, expectedevidence, evidencereferencelink, evidenceremark, evidencestatus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
  const values = [
    projectdetailsid,
    user_id,
    governancegroup,
    thrustarea,
    controlname,
    controlwt,
    subcontrolname,
    subcontrolwt,
    expectedevidence,
    evidencereferencelink,
    evidenceremark,
    evidencestatus,
  ];

  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting evidence record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ message: "Evidence record inserted successfully" });
    }
  });
});

//UPDATE EVIDENCE
app.put("/startup-api/evidence/:evidenceid", (req, res) => {
  const { evidenceid } = req.params;
  const {
    projectdetailsid,
    user_id,
    governancegroup,
    thrustarea,
    controlname,
    controlwt,
    subcontrolname,
    subcontrolwt,
    expectedevidence,
    evidencereferencelink,
    evidenceremark,
    evidencestatus,
    uploadevidence,
  } = req.body;

  const sqlUpdate =
    "UPDATE public.evidence SET projectdetailsid = $1, user_id = $2, governancegroup = $3, thrustarea = $4, controlname = $5, controlwt = $6, subcontrolname = $7, subcontrolwt = $8, expectedevidence = $9, evidencereferencelink = $10, evidenceremark = $11, evidencestatus = $12,uploadevidence=$13 WHERE evidenceid = $14";
  const values = [
    projectdetailsid,
    user_id,
    governancegroup,
    thrustarea,
    controlname,
    controlwt,
    subcontrolname,
    subcontrolwt,
    expectedevidence,
    evidencereferencelink,
    evidenceremark,
    evidencestatus,
    uploadevidence,
    evidenceid,
  ];

  pool.query(sqlUpdate, values, (error, result) => {
    if (error) {
      console.error("Error updating evidence record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Evidence record updated successfully" });
    }
  });
});

//DELETE EVIDENCE
app.delete("/startup-api/evidence/:evidenceid", (req, res) => {
  const { evidenceid } = req.params;
  const sqlDelete = "DELETE FROM public.evidence WHERE evidenceid = $1";

  pool.query(sqlDelete, [evidenceid], (error, result) => {
    if (error) {
      console.error("Error deleting evidence record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Evidence record deleted successfully" });
    }
  });
});

/*************************************************ASSESSMENT APIS************************************************************************ */
// GET ALL ASSESSMENTS
app.get("/startup-api/assessment", (req, res) => {
  const sqlGet = "SELECT * FROM public.assessment";
  pool.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error fetching assessment records", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

// GET ASSESSMENT BY ID
app.get("/startup-api/assessment/:assessmentid", (req, res) => {
  const { assessmentid } = req.params;
  const sqlGet = "SELECT * FROM public.assessment WHERE assessmentid = $1";

  pool.query(sqlGet, [assessmentid], (error, result) => {
    if (error) {
      console.error("Error fetching assessment record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

// GET ASSESSMENT BY ID AND EVIDENCEID
app.get("/startup-api/assessment/:user_id/:evidenceid", (req, res) => {
  const { user_id, evidenceid } = req.params;
  const sqlGet =
    "SELECT * FROM public.assessment WHERE user_id = $1 AND evidenceid=$2";

  pool.query(sqlGet, [user_id, evidenceid], (error, result) => {
    if (error) {
      console.error("Error fetching assessment record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

// CREATE ASSESSMENT
app.post("/startup-api/assessment", (req, res) => {
  const {
    evidenceid,
    user_id,
    assessmentreferencelink,
    assessmentupload,
    assessmentremark,
    assessmentstatus,
    assessmentscore,
  } = req.body;

  const sqlInsert =
    "INSERT INTO public.assessment( evidenceid, user_id, assessmentreferencelink, assessmentupload, assessmentremark, assessmentstatus, assessmentscore) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  const values = [
    evidenceid,
    user_id,
    assessmentreferencelink,
    assessmentupload,
    assessmentremark,
    assessmentstatus,
    assessmentscore,
  ];

  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting assessment record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ message: "Assessment record inserted successfully" });
    }
  });
});

// UPDATE ASSESSMENT
app.put("/startup-api/assessment/:assessmentid", (req, res) => {
  const { assessmentid } = req.params;
  const {
    evidenceid,
    user_id,
    assessmentreferencelink,
    assessmentupload,
    assessmentremark,
    assessmentstatus,
    assessmentscore,
  } = req.body;

  const sqlUpdate =
    "UPDATE public.assessment SET evidenceid = $1, user_id = $2, assessmentreferencelink = $3, assessmentupload = $4, assessmentremark = $5, assessmentstatus = $6, assessmentscore = $7 WHERE assessmentid = $8";
  const values = [
    evidenceid,
    user_id,
    assessmentreferencelink,
    assessmentupload,
    assessmentremark,
    assessmentstatus,
    assessmentscore,
    assessmentid,
  ];

  pool.query(sqlUpdate, values, (error, result) => {
    if (error) {
      console.error("Error updating assessment record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ message: "Assessment record updated successfully" });
    }
  });
});

// DELETE ASSESSMENT
app.delete("/startup-api/assessment/:assessmentid", (req, res) => {
  const { assessmentid } = req.params;
  const sqlDelete = "DELETE FROM public.assessment WHERE assessmentid = $1";

  pool.query(sqlDelete, [assessmentid], (error, result) => {
    if (error) {
      console.error("Error deleting assessment record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ message: "Assessment record deleted successfully" });
    }
  });
});
/**************************************AUDIT APIS***************************************************** */
//GET ALL AUDIT
app.get("/startup-api/governanceaudit", async (req, res) => {
  const sqlGet = "SELECT * FROM public.governanceaudit";
  try {
    const result = await pool.query(sqlGet);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching governance audit records", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

//GET AUDIT BY ID

app.get("/startup-api/governanceaudit/:governanceauditid", async (req, res) => {
  const { governanceauditid } = req.params;
  const sqlGet =
    "SELECT * FROM public.governanceaudit WHERE governanceauditid = $1";

  pool.query(sqlGet, [governanceauditid], (error, result) => {
    if (error) {
      console.error("Error fetching audit record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

//GET AUDIT BY ID AND AUDITPLAN ID
app.get(
  "/startup-api/governanceaudit/:user_id/:auditplanid",
  async (req, res) => {
    const { user_id, auditplanid } = req.params;
    const sqlGet =
      "SELECT * FROM public.governanceaudit WHERE user_id = $1 AND auditplanid = $2";

    pool.query(sqlGet, [user_id, auditplanid], (error, result) => {
      if (error) {
        console.error("Error fetching assessment record", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json(result.rows);
      }
    });
  }
);

//ADD AUDIT
app.post("/startup-api/governanceaudit", async (req, res) => {
  const {
    user_id,
    assessmentid,
    auditreferencelink,
    auditupload,
    auditremark,
    auditstatus,
    auditscore,
    auditplanid,
    auditdate,
    auditreportexpirydate,
  } = req.body;

  const sqlInsert = `INSERT INTO public.governanceaudit( user_id, assessmentid, auditreferencelink, auditupload, auditremark, auditstatus, auditscore,auditplanid,auditdate,
    auditreportexpirydate) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) RETURNING *`;
  const values = [
    user_id,
    assessmentid,
    auditreferencelink,
    auditupload,
    auditremark,
    auditstatus,
    auditscore,
    auditplanid,
    auditdate,
    auditreportexpirydate,
  ];

  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting audit record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Audit record inserted successfully" });
    }
  });
});

//UPDATE AUDIT
app.put("/startup-api/governanceaudit/:governanceauditid", async (req, res) => {
  const { governanceauditid } = req.params;
  const {
    user_id,
    assessmentid,
    auditreferencelink,
    auditupload,
    auditremark,
    auditstatus,
    auditscore,
    auditplanid,
  } = req.body;

  const sqlUpdate = `UPDATE public.governanceaudit SET user_id = $1, assessmentid = $2, auditreferencelink = $3, auditupload = $4, auditremark = $5, auditstatus = $6, auditscore = $7,auditplanid=$8
    WHERE governanceauditid = $9 RETURNING *`;
  const values = [
    user_id,
    assessmentid,
    auditreferencelink,
    auditupload,
    auditremark,
    auditstatus,
    auditscore,
    auditplanid,

    governanceauditid,
  ];

  try {
    const result = await pool.query(sqlUpdate, values);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Governance audit not found" });
    } else {
      res.json({
        message: "Governance audit record updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error) {
    console.error("Error updating governance audit record", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

//DELETE AUDIT
app.delete(
  "/startup-api/governanceaudit/:governanceauditid",
  async (req, res) => {
    const { governanceauditid } = req.params;
    const sqlDelete =
      "DELETE FROM public.governanceaudit WHERE governanceauditid = $1";

    try {
      const result = await pool.query(sqlDelete, [governanceauditid]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: "Governance audit not found" });
      } else {
        res.json({ message: "Governance audit record deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting governance audit record", error.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
/****************************************************AUDIT PLAN APIS****************************************************** */
app.get("/startup-api/auditplan", (req, res) => {
  const sqlGet = "SELECT * FROM public.auditplan";
  pool.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error fetching audit plan records", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

// INSERT AUDIT PLAN
app.post("/startup-api/auditplan", (req, res) => {
  const {
    projectname,
    auditor,
    auditees,
    auditscope,
    user_id,
    projectdetailsid,
    assessmentid,
    auditorcompany,
    fromdate,
    todate,
  } = req.body;

  // Check if auditees is a string; if so, split it into an array
  let auditeesArray = Array.isArray(auditees) ? auditees : auditees.split(",");

  // Trim whitespace around each auditee name
  auditeesArray = auditeesArray.map((auditee) => auditee.trim());

  // Convert auditees to a PostgreSQL-compatible array format
  const formattedAuditees = `{${auditeesArray.join(",")}}`;

  const sqlInsert = `
    INSERT INTO public.auditplan(
       projectname, auditor, auditees, auditscope, user_id, projectdetailsid, assessmentid,auditorcompany,
    fromdate,
    todate
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10) RETURNING *;
  `;

  const values = [
    projectname,
    auditor,
    formattedAuditees,
    auditscope,

    user_id,
    projectdetailsid,
    assessmentid,
    auditorcompany,
    fromdate,
    todate,
  ];

  pool.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting audit plan record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({
        message: "Audit plan record inserted successfully",
        data: result.rows[0],
      });
    }
  });
});

// GET AUDIT PLANS BY userID
app.get("/startup-api/userauditplan/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sqlGet = `SELECT * FROM public.auditplan where user_id=$1`;
  pool.query(sqlGet, [user_id], (error, result) => {
    if (error) {
      console.error("Error fetching audit plan records", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

// GET AUDIT PLAN BY ID
app.get("/startup-api/auditplan/:auditplanid", (req, res) => {
  const { auditplanid } = req.params;
  const sqlGet = "SELECT * FROM public.auditplan WHERE auditplanid = $1";

  pool.query(sqlGet, [auditplanid], (error, result) => {
    if (error) {
      console.error("Error fetching audit plan record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

//GET PLAN BY USER AND ASSESSMENT
app.get("/startup-api/auditplan/:user_id/:assessmentid", (req, res) => {
  const { user_id, assessmentid } = req.params;
  const sqlGet =
    "SELECT * FROM public.auditplan WHERE user_id = $1 AND assessmentid = $2";

  pool.query(sqlGet, [user_id, assessmentid], (error, result) => {
    if (error) {
      console.error("Error fetching audit plan record", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

// UPDATE AUDIT PLAN
app.put("/startup-api/auditplan/:auditplanid", (req, res) => {
  const { auditplanid } = req.params;
  const {
    projectname,
    auditor,
    auditees,
    auditscope,

    user_id,
    projectdetailsid,
    assessmentid,
    auditorcompany,
    fromdate,
    todate,
  } = req.body;

  // Check if auditees is a string; if so, split it into an array
  let auditeesArray = Array.isArray(auditees) ? auditees : auditees.split(",");

  // Trim whitespace around each auditee name
  auditeesArray = auditeesArray.map((auditee) => auditee.trim());

  // Convert auditees to a PostgreSQL-compatible array format
  const formattedAuditees = `{${auditeesArray.join(",")}}`;

  const sqlUpdate = `
    UPDATE public.auditplan 
    SET projectname = $1, auditor = $2, auditees = $3, auditscope = $4,  user_id = $5, projectdetailsid = $6, assessmentid = $7,  auditorcompany=$8,
    fromdate=$9,
    todate=$10
    WHERE auditplanid = $11 RETURNING *;
  `;

  const values = [
    projectname,
    auditor,
    formattedAuditees,
    auditscope,
    user_id,
    projectdetailsid,
    assessmentid,
    auditorcompany,
    fromdate,
    todate,
    auditplanid,
  ];

  pool.query(sqlUpdate, values, (error, result) => {
    if (error) {
      console.error("Error updating audit plan record", error);
      res.status(500).json({ error: "Internal server error" });
    } else if (result.rowCount === 0) {
      res.status(404).json({ error: "Audit plan not found" });
    } else {
      res.status(200).json({
        message: "Audit plan record updated successfully",
        data: result.rows[0],
      });
    }
  });
});

// DELETE AUDIT PLAN
app.delete("/startup-api/auditplan/:auditplanid", (req, res) => {
  const { auditplanid } = req.params;
  const sqlDelete = "DELETE FROM public.auditplan WHERE auditplanid = $1";

  pool.query(sqlDelete, [auditplanid], (error, result) => {
    if (error) {
      console.error("Error deleting audit plan record", error);
      res.status(500).json({ error: "Internal server error" });
    } else if (result.rowCount === 0) {
      res.status(404).json({ error: "Audit plan not found" });
    } else {
      res
        .status(200)
        .json({ message: "Audit plan record deleted successfully" });
    }
  });
});
/*****************************************************SCORE CARD**************************************************************** */
app.get("/startup-api/scorecard/:user_id", (req, res) => {
  const { user_id } = req.params;
  const {
    governancegroup,
    organization,
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    objecttype,
    object,
    auditorcompany,
    fromdate, // Add fromdate to query parameters
    todate, // Add todate to query parameters
  } = req.query;

  // Array to store conditions and values
  const values = [user_id]; // user_id is always the first value
  const conditions = ["user_id = $" + values.length];

  // Add conditions for each provided parameter dynamically
  if (governancegroup) {
    conditions.push("governancegroup = $" + (values.length + 1));
    values.push(governancegroup);
  }
  if (organization) {
    conditions.push("organization = $" + (values.length + 1));
    values.push(organization);
  }
  if (projectname) {
    conditions.push("projectname = $" + (values.length + 1));
    values.push(projectname);
  }
  if (responsibilitygroup) {
    conditions.push("responsibilitygroup = $" + (values.length + 1));
    values.push(responsibilitygroup);
  }
  if (responsibilitycenter) {
    conditions.push("responsibilitycenter = $" + (values.length + 1));
    values.push(responsibilitycenter);
  }
  if (objecttype) {
    conditions.push("objecttype = $" + (values.length + 1));
    values.push(objecttype);
  }
  if (object) {
    conditions.push("object = $" + (values.length + 1));
    values.push(object);
  }
  if (auditorcompany) {
    conditions.push("auditorcompany = $" + (values.length + 1));
    values.push(auditorcompany);
  }

  // Add date range condition if both fromdate and todate are provided
  if (fromdate && todate) {
    conditions.push(
      `auditdate BETWEEN $${values.length + 1} AND $${values.length + 2}`
    );
    values.push(fromdate, todate);
  }

  // Construct the SQL query
  let sqlQuery =
    "SELECT * FROM ai_combined_data WHERE " + conditions.join(" AND ");

  // Execute the SQL query with the provided parameters
  pool.query(sqlQuery, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Send the results as JSON
    res.json(results.rows);
  });
});
/***************************************************EMAIL API*************************************************************** */
// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// Generate password reset link
function generateResetLink(email, user_id) {
  const secret = process.env.JWT_SECRET; // Secret key for token
  const payload = { email, user_id };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" }); // Token expires in 1 hour
  return `${process.env.CLIENT_URL}/reset-password/${token}`; // Your front-end reset password page
}

// Password Reset Request API
app.post("/startup-api/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in the database
    const result = await pool.query(
      "SELECT * FROM startupuser WHERE user_email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset link
    const resetLink = generateResetLink(email, user.user_id);

    // Send email with reset link
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<p>Hi ${user.user_name || "User"},</p>
             <p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>
             <p>This link will expire in 1 hour.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Failed to send email", error });
      }
      res
        .status(200)
        .json({ message: "Password reset link sent successfully" });
    });
  } catch (error) {
    console.error("Error handling password reset request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Token Validation API
app.post("/startup-api/validate-reset-token", (req, res) => {
  const { token } = req.body;
  const secret = process.env.JWT_SECRET;

  try {
    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Token is valid, respond with success
    res.status(200).json({ valid: true, decoded });
  } catch (error) {
    // Token is invalid or expired
    res.status(400).json({ valid: false, message: "Invalid or expired token" });
  }
});

/************************************************************************************************************************* */
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
