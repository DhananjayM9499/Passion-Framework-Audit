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

/****************OrganizationApi******************** */

/*GET ALL Organization */
app.get("/startup-api/organization", (req, res) => {
  const sqlGet = "SELECT * FROM public.organization";
  pool.query(sqlGet, (error, result) => {
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

  db.query(sqlCheckPhase, [organizationid], (error, result) => {
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

    db.query(sqlRemove, [organizationid], (error, result) => {
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

    const result = await db.query(sqlGet, [organizationid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Organization.");
  }
});

app.post("/startup-api/organization", (req, res) => {
  const { organization, contactname, contactemail, contactphone } = req.body;
  const sqlInsert =
    "INSERT INTO public.organization(organization, contactname, contactemail, contactphone) VALUES ($1, $2, $3, $4)";
  const values = [organization, contactname, contactemail, contactphone];

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
    "UPDATE public.organizationSET organization=$1,contactname=$2,contactemail=$3,contactphone=$4 WHERE organizationid = $5";

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

/************************************************* */
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
