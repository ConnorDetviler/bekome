const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
 router.get('/', rejectUnauthenticated, async (req, res) => {

    const connection = await pool.connect();
  
    try {
      // Begin transaction
      await connection.query('BEGIN;')
  
      // first query gets array of all providers and relevant data
      // const providersSQL = `
      //   SELECT
      //   "providers_users_id", "first_name", "last_name", "pic", "video", "location"
      //   FROM "providers";
      // `;
  
      // first query gets array of all providers and relevant data
      // subquery excludes providers that current user has added to favorites list
      const providersSQL = `
      SELECT
      "providers_users_id", "first_name", "last_name", "pic", "video", "location" FROM "providers"
      WHERE
          EXISTS (
              SELECT "clients_users_id", "providers_users_id" FROM "clients_providers_favs"
              WHERE "clients_users_id" = $1 AND "providers_users_id" = "providers".providers_users_id
          );
      `;
      const providersArray = await connection.query(providersSQL, [req.user.id])
  
      // console.log(providersArray.rows);
  
      // second query will get pronouns for specific provider $1
      const preferencesSQL = `
        SELECT "preferences".name, "preferences".category FROM "providers_preferences"
        JOIN "preferences" ON "providers_preferences".preferences_id = "preferences".id
        WHERE "providers_preferences".providers_users_id = $1
        AND "preferences".category = 'pronouns';
      `;
  
      // fullProviderArray will become data that is sent back to client
      const fullProviderArray = [];
  
      // second query is looped for each provider gathered from first query
      for (let i = 0; i < providersArray.rows.length; i++) {
  
        // fullProviderObject will become the packaged object with all data for each provider's card in ExploreView
        const fullProviderObject = {...providersArray.rows[i], pronouns: ''};
  
  
        // storing result of second query in fullProviderObject as a property
        const preferences = await connection.query(preferencesSQL, [providersArray.rows[i].providers_users_id])
        // console.log('preferences:', preferences.rows)

        let pronounsCount = 0;

        // this for-loop takes pronouns from preferences and concatenates two or more of them into a single string
        // then adds them to fullProviderObject
        for (let i = 0; i < preferences.rows.length; i++) {
            const pref = preferences.rows[i]
            pronounsCount++;
  
            (pronounsCount > 1)
            ? fullProviderObject.pronouns += '; ' + pref.name
            : fullProviderObject.pronouns +=  pref.name
        }
        console.log(fullProviderObject)
  
        // pushing each fullProvider object into the array that will be sent to the client
        fullProviderArray.push(fullProviderObject);
      }
      // console.log(fullProviderArray);
  
      await connection.query('COMMIT;');
      res.send(fullProviderArray)
  
  
    } catch (error) {
      console.log('ERROR getting providers in explore.router', error)
      await connection.query('ROLLBACK;');
      res.sendStatus(500);
    } finally {
      connection.release();
    }
  
  });

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;