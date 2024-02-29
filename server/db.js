const {Pool} = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "superpassword",
    host:"localhost",
    port: 5432,
    database: "customer_details"
});

module.exports = pool;