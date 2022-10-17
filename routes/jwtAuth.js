const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator")
const validation = require("../middleware/validation")
const authorization = require("../middleware/authorization");

/**
 * Register User
 */

router.post("/register", validation, async (req, res) => {
    try {

        //1. destructure the req.body (name, email, password)

        const { name, email, password } = req.body;

        //2. check if user exist (if user exist then throw error)

        const user = await pool.query("select * from users where user_email = $1", [email]);

        if (user.rows.length !== 0) {
            console.log(user.rows);
            return res.status(404).send("User already exists");
        }

        //3. Bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. enter the new user inside our database

        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_pasSword) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

        //5. genrating our jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);

        console.log(newUser.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

/**
 * Login User
 */

router.post("/login", validation, async (req, res) => {
    try {

        //1. destructure the req.body

        const { email, password } = req.body;

        //2. check if user doesn't exist (if not then we throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Email is incorrect");
        }

        //3. check if incomming password is the same the database password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
          console.log(validPassword); // give boolean value

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }

        //4. give them the jwt token

        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

/**
 * Verify User
 */

router.get("/is-verify", authorization, (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;