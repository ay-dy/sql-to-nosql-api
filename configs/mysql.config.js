let connection, schema = null;

const getConnection = () => {
  return connection;
}

const setConnection = (newConnection) => {
  connection = newConnection;
}

const getSchema = () => {
  return schema;
}

const setSchema = async (newSchema) => {
  schema = newSchema;
}

module.exports = {
  getConnection,
  setConnection,
  getSchema,
  setSchema
}