const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5009; // Choose your desired port
app.use(cors());
// PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "34.71.87.187",
  database: "startupaudit",
  password: "India@5555",
  port: 5432,
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
  const { email, password } = req.body;

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

    // Store hashed password in database
    await pool.query(
      "INSERT INTO startupuser (user_email, user_password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ message: "Error signing up" });
  }
});

// Login Endpoint

const secretKey = "g63D0b5E4&fU^E#^q2tE8j5#4Z3Kp7@1"; // Replace with your actual secret key

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

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].user_id, email: result.rows[0].user_email },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*******************************************************************OrganizationApi***************************************************************************** */

/*GET ALL Organization */
app.get("/startup-api/organization/:user_id", (req, res) => {
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
  } = req.body;

  // Validation
  if (
    !organization ||
    !projectname ||
    !projectcode ||
    !auditdate ||
    !audittime ||
    !objecttype ||
    !object ||
    !stakeholder ||
    !technology ||
    !environment ||
    !theme ||
    !themeactivity ||
    !issue ||
    !user_id ||
    !project_type ||
    !project_category ||
    !responsibilitycenter ||
    !responsibilitygroup
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const sqlInsert = `
      INSERT INTO public.projectdetails(
        organization, projectname, projectcode, auditdate, audittime, objecttype, object, stakeholder, technology, environment, theme, themeactivity, issue, user_id, project_type, project_category, responsibilitycenter, responsibilitygroup
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
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
  if (
    !organization ||
    !projectname ||
    !projectcode ||
    !auditdate ||
    !audittime ||
    !objecttype ||
    !object ||
    !stakeholder ||
    !technology ||
    !environment ||
    !theme ||
    !themeactivity ||
    !issue ||
    !user_id ||
    !project_type ||
    !project_category ||
    !responsibilitycenter ||
    !responsibilitygroup
  ) {
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

/************************************************************************************************************************* */
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
