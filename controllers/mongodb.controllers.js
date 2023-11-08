const mongoose = require('mongoose');

const establishConnection = async (req, res) => {
  let status, message;

  const uri = req.body.uri;

  try {
    await mongoose.connect(uri);
    status = 200;
    message = 'Connection established.';
  } catch (error) {
    status = 400;
    message = 'Failed to establish connection.';
  }

  res.status(status).send({ message: message });
}

const closeConnection = (_, res) => {
  let status, message;

  try {
    mongoose.disconnect();
    status = 200;
    message = 'Database connection closed.';
  } catch (error) {
    status = 503;
    message = 'Server unreachable: Database connection already closed.';
  }

  res.status(status).send({ message: message });
};

module.exports = {
  establishConnection,
  closeConnection
}