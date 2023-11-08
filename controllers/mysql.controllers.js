const mysql = require('mysql2');
const { setConnection, getConnection, setSchema } = require('../configs/mysql.config');
const { setCollectionModels } = require('../configs/mongodb.config');
const { extractSchema } = require('../models/mysql.models');

const establishConnection = async (req, res) => {
  let status, message;

  const config = req.body;
  // Trim any whitespaces from the 'user' and 'database' properties.
  config.user = config.user.trim();
  config.database = config.database.trim();

  const newConnection = mysql.createConnection(config);

  // Attempt a connection and handle errors that may occur in the process.
  newConnection.connect(async (err) => {
    if (err) {
      console.log(err);
      switch (err.code) {
        case 'ER_ACCESS_DENIED_ERROR':
          status = 401;
          message = 'Access denied: Invalid credentials.';
          break;
        case 'ER_DBACCESS_DENIED_ERROR':
          status = 403;
          message = 'Access denied: Restricted user privileges.';
          break;
        case 'ER_BAD_DB_ERROR':
          status = 404;
          message = 'Specified database does not exist.';
          break;
        case 'ETIMEDOUT':
          status = 408;
          message = 'Connection request has timed out.';
          break;
        case 'ECONNREFUSED':
          status = 503;
          message = 'Service unavailable. Give it a nudge!';
          break;
        default:
          status = 500;
          message = 'Server\'s playing dodgeball with duties.';
      }
    } else {
      status = 200;
      message = `Connection to '${newConnection.config.database}' established`;

      setConnection(newConnection);
      // Extract the MySQL schema and set it in the MySQL config.
      setSchema(await extractSchema());
      setCollectionModels();
    }

    res.status(status).send({ message: message });
  });
}

const closeConnection = (_, res) => {
  let status, message;

  try {
    getConnection().end();
    status = 200;
    message = 'Connection closed.';
  } catch (error) {
    console.log(error);
    status = 503;
    message = 'Server unreachable: Connection already closed.';
  }

  setConnection(null);
  res.status(status).send({ message: message });
}

module.exports = { establishConnection, closeConnection }