const { pool } = require("../DBConfig");

module.exports.registerController = async function (req, res) {
  console.log(req.body);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryText =
      "insert into users (username,password,email) values($1,$2,$3)";
    const result = await client.query(queryText, [
      req.body.username,
      req.body.password,
      req.body.email,
    ]);
    await client.query("COMMIT");
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    console.log(err);
  } finally {
  }
};

module.exports.loginController = async function (req, res) {
  console.log(req.body);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryText = "select * from users where email=$1";
    const result = await client.query(queryText, [req.body.email]);
    await client.query("COMMIT");
    console.log(result.rows);
    req.session.user = result.rows[0];

    req.session.save(function (err) {
      console.log(req.session);
      res.json(result.rows);
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
  } finally {
  }
};
