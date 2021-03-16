const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// GET route for retrieving data from "preferences" table
router.get('/preferences', rejectUnauthenticated, (req, res) => {
  const sqlText = `
        SELECT * FROM "preferences"
        `;
  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500);
    });
});

// GET route for retrieving data from "questions" table
router.get('/provider_questions', rejectUnauthenticated, (req, res) => {
  const sqlText = `
          SELECT * FROM "questions"
          `;
  pool
    .query(sqlText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500);
    });
});

// POST route for adding new client data to DB
router.post('/add_client', rejectUnauthenticated, async (req, res) => {
  // Open the connection to our database
  // connection replaces pool

  const connection = await pool.connect();
  try {
    // Start transaction
    await connection.query('BEGIN;');
    // First sql query to insert new client into clients
    const firstSqlText = `
        INSERT INTO "clients" (
            "clients_users_id", 
            "first_name", 
            "last_name", 
            "pic", 
            "date_of_birth", 
            "write_in_pronouns", 
            "city",
            "state_id", 
            "primary_reason", 
            "previous_therapy", 
            "previous_experience",
            "sliding_scale"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;
    await connection.query(firstSqlText, [
      req.user.id,
      req.body.first_name,
      req.body.last_name,
      req.body.pic,
      req.body.date_of_birth,
      req.body.write_in_pronouns,
      req.body.city,
      req.body.state_id,
      req.body.primary_reason,
      req.body.previous_therapy,
      req.body.previous_experience,
      req.body.sliding_scale,
    ]);

    // Take the preferences array and generate values for query
    const preferenceValues = req.body.preferences
      .reduce((valueString, val, i) => (valueString += `($1, $${i + 2}),`), '')
      .slice(0, -1); // Takes off last comma
    // Second sql query to insert preferences into clients_preferences
    const secondSqlText = `
        INSERT INTO "clients_preferences" ("clients_users_id", "preferences_id")
        VALUES ${preferenceValues};
    `;
    await connection.query(secondSqlText, [
      req.user.id,
      ...req.body.preferences,
    ]);
    // 3rd query to mark filled_out_form as true
    const thirdSqlText = `
    UPDATE "users"
    SET "filled_out_form" = true
    WHERE "id" = $1;
    `;
    await connection.query(thirdSqlText, [req.user.id]);
    // last action
    await connection.query('COMMIT;');
    // send success status
    res.sendStatus(201);
  } catch (err) {
    console.log('error in post /add-client:', err);
    await connection.query('ROLLBACK;');
    res.sendStatus(500);
  } finally {
    // hang up the phone
    connection.release();
  }
});

// POST route for adding new client data to DB
router.post('/add_provider', rejectUnauthenticated, async (req, res) => {
  // Open the connection to our database
  // connection replaces pool
  const connection = await pool.connect();
  //
  try {
    // Start transaction
    await connection.query('BEGIN;');
    // Work for first query
    // First sql query to insert new provider into providers
    const firstSqlText = `
      INSERT INTO "providers" (
        "providers_users_id", 
        "first_name", 
        "last_name", 
        "pic", 
        "video",
        "city",
        "state_id",
        "date_of_birth", 
        "write_in_pronouns", 
        "background",
        "strengths",
        "approach",
        "sliding_scale",
        "accepting_clients",
        "license_number"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;
    await connection.query(firstSqlText, [
      req.user.id,
      req.body.first_name,
      req.body.last_name,
      req.body.pic,
      req.body.video,
      req.body.city,
      req.body.state_id,
      req.body.date_of_birth,
      req.body.write_in_pronouns,
      req.body.background,
      req.body.strengths,
      req.body.approach,
      req.body.sliding_scale,
      req.body.accepting_clients,
      req.body.license_number,
    ]);
    // Work for second query
    // Take the preferences array and generate values for query
    const preferenceValues = req.body.preferences
      .reduce((valueString, val, i) => (valueString += `($1, $${i + 2}),`), '')
      .slice(0, -1); // Takes off last comma
    // Second sql query to insert preferences into clients_preferences
    const secondSqlText = `
      INSERT INTO "providers_preferences" ("providers_users_id", "preferences_id")
      VALUES ${preferenceValues};
    `;
    await connection.query(secondSqlText, [
      req.user.id,
      ...req.body.preferences,
    ]);
    // Work for third query
    // Take the questions array and use the same SQL query for each
    const providerQuestionsQuery = `
      INSERT INTO "providers_questions" ("providers_users_id", "questions_id", "answer")
      VALUES ($1, $2, $3);
    `;

    req.body.questions.forEach(async (question) => {
      try {
        await connection.query(providerQuestionsQuery, [
          req.user.id,
          question.question_id,
          question.answer,
        ]);
      } catch (err) {
        console.log('error in post to providers_questions:', err);
        await connection.query('ROLLBACK;');
        res.sendStatus(500);
      }
    });
    // 4th query to mark filled_out_form as true
    const fourthSqlText = `
    UPDATE "users"
    SET "filled_out_form" = true
    WHERE "id" = $1;
    `;
    await connection.query(fourthSqlText, [req.user.id]);
    // last action
    await connection.query('COMMIT;');
    // send success status
    res.sendStatus(201);
  } catch (err) {
    console.log('error in post /add_provider:', err);
    await connection.query('ROLLBACK;');
    res.sendStatus(500);
  } finally {
    // hang up the phone
    connection.release();
  }
});

module.exports = router;
