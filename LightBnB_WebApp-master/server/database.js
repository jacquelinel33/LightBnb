const properties = require('./json/properties.json');
const users = require('./json/users.json');

const {
  Pool
} = require('pg');

const pool = new Pool({
  user: 'vagrant',
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

const getUserWithEmail = function (email) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE users.email = $1`, [email])
    .then(res => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch(err => console.error('Insert error'));
}
exports.getUserWithEmail = getUserWithEmail;

getUserWithEmail('jlee4332@gmail.com')
/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1;
`, [id])
    .then(res => {
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch(err => console.error('query error'));
};

exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => console.error('query error'));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id) {
  return pool.query(`
      SELECT properties.*, reservations.*, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id 
      WHERE reservations.guest_id = $1
      AND reservations.end_date < now()::date
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT 10;
  `, [guest_id])
    .then(res => {
      return res.rows;
    })
    .catch(err => console.error('Query Error'));
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  let whereAnd = () => {
    if (queryParams.length === 1) {
      return 'WHERE';
    }
    return ' AND';
  };

  //check if city has been passed in the search
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city ILIKE $${queryParams.length} `;
  }
  //check owner
  //if queryparam length is 1, add AND, else add WHERE
  if (options.owner) {
    queryParams.push(`%${options.owner_id}%`);
    queryString += `${whereAnd()} owner_id LIKE $${queryParams.length}`;
  }

  //check min price
  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night) * 100);
    queryString += `${whereAnd()} cost_per_night >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night) * 100);
    queryString += `${whereAnd()} cost_per_night <= $${queryParams.length}`;
  }

  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `GROUP BY properties.id HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  } else {
    queryString += `GROUP BY properties.id`;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  console.log(queryString, queryParams);
  // 6
  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */


// Property 
// {
//   owner_id: int,
//   title: string,
//   description: string,
//   thumbnail_photo_url: string,
//   cover_photo_url: string,
//   cost_per_night: string,
//   street: string,
//   city: string,
//   province: string,
//   post_code: string,
//   country: string,
//   parking_spaces: int,
//   number_of_bathrooms: int,
//   number_of_bedrooms: int
// }

const addProperty = function (property) {
  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
  RETURNING *`;

  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];
  
  return pool.query(queryString, values)
    .then(res => {
      return res.rows;
    })
    .catch(err => console.error('Insert Error'));
};
exports.addProperty = addProperty;