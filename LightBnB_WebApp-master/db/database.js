const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

//create a new pool with configuration
const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

//accepts an email address and will return a promise
const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    //promise should resolve with a user object with the given email address, or null if that user does not exist
    .then((result) => {
      //console.log(result.rows);
      if (result.rows) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};



/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    //promise should resolve with a user object with the given id, or null if that user does not exist
    .then((result) => {
      //console.log(result.rows);
      if (result.rows) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  return pool
    //accepts a user object that will have a name, email, and password property and insert the new user into the database
    .query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [user.name, user.email, user.password])
    .then((result) => {
      //console.log(result.rows);
      if (result.rows) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
  //query lightbnb database for reservations associated with a specific user
    .query(`SELECT reservations.*, properties.*, avg(property_reviews.rating) AS average_rating
    FROM reservations JOIN properties ON properties.id = reservations.property_id 
    JOIN property_reviews ON property_reviews.property_id = properties.id 
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY reservations.start_date 
    LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  //array to hold any parameters that may be available for the query
  const queryParams = [];
  //query with all information that comes before the WHERE clause
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // check if a city has been passed in as an option
  // Add the city to the params array and create a WHERE clause for the city
  if (options.city) {
    if (queryParams.length === 0) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE `;
      queryString += `city LIKE $${queryParams.length} `;
    } else {
      queryParams.push(`%${options.city}%`);
      queryString += `AND city LIKE $${queryParams.length} `;
    }
  }

  // only return properties belonging to that owner
  if (options.owner_id) {
    if (queryParams.length === 0) {
      queryParams.push(`${options.owner_id}`);
      queryString += `WHERE `;
      queryString += `properties.owner_id = $${queryParams.length} `;
    } else {
      queryParams.push(`${options.owner_id}`);
      queryString += `AND properties.owner_id = $${queryParams.length} `;
    }
  };

  // only return properties above min price
  if (options.minimum_price_per_night) {
    console.log(queryParams.length)
    if (queryParams.length === 0) {
      queryParams.push(`${options.minimum_price_per_night * 100}`);
      queryString += `WHERE `;
      queryString += `properties.cost_per_night > $${queryParams.length} `;
    } else {
      queryParams.push(`${options.minimum_price_per_night * 100}`);
      queryString += `AND properties.cost_per_night > $${queryParams.length} `;
    }
  }

  // only return properties below max price
  if (options.maximum_price_per_night) {
    console.log(queryParams.length)
    if (queryParams.length === 0) {
      queryParams.push(`${options.maximum_price_per_night * 100}`);
      queryString += `WHERE `;
      queryString += `properties.cost_per_night < $${queryParams.length} `;
    } else {
      queryParams.push(`${options.maximum_price_per_night * 100}`);
      queryString += `AND properties.cost_per_night < $${queryParams.length} `;
    }
  }

  // only return properties with an average rating equal to or higher than rating as HAVING clause after the GROUP BY
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `
    GROUP BY properties.id 
    HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  };


  // add query that comes after the WHERE clause
  // if no having clause after group by
  if (!options.minimum_rating) {
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  // if there is a having clause
  } else if (options.minimum_rating) {
    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  };
  

  // log SQL query and result to console
  console.log(queryString, queryParams);

  // return 
  return pool.query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];
  let queryString = "INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;";
  //accepts a property object and insert the new property into the database
  return pool.query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};