const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for interested clients
 * This route will accept the provider's id from the interestedClients saga 
 * and query the database table named "clients_providers_favs and 
 * return corresponding clients ids
 */

router.get('/', rejectUnauthenticated, (req, res) => {
  // SELECT the client id from the client_providers_favs table WHERE 
  // the providers_user_id = (id passed in from interestedClients saga)
  const sqlText = `
    SELECT "clients".clients_users_id, 
      "clients".first_name, "clients".last_name, 
      "clients".city, clients.state, 
      "clients".pic, 
      "clients".primary_reason, 
      "clients".id,
      ARRAY_AGG("clients_preferences".preferences_id) AS "preferences_array" 
    FROM "clients"
    JOIN "clients_providers_favs" ON 
      "clients_providers_favs".clients_users_id = "clients".clients_users_id
    JOIN "clients_preferences" ON "clients_preferences".clients_users_id 
      = "clients".clients_users_id
    WHERE "clients_providers_favs".providers_users_id = $1
    GROUP BY clients.id;
  `;

  pool
    .query(sqlText, [req.user.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
