const { getSchema, getConnection } = require('../configs/mysql.config');
const { getMongoType } = require('../utils/utils');

const extractSchema = async () => {
  const connection = getConnection();
  const schema = {};

  // Get table data without array that shows the values' data types.
  const [tablesResult] = await connection.promise().query('SHOW FULL TABLES WHERE Table_Type != "VIEW"');
  // Get the values of each "Tables_in_employees" key.
  const tableNames = tablesResult.map(table => Object.values(table)[0]);
  console.log(tableNames);

  for (const table of tableNames) {
    const [fieldsResult] = await connection.promise().query(`DESCRIBE ${table}`);
    const fieldInfo = {};

    for (const row of fieldsResult) {
      fieldInfo[row.Field] = getMongoType(row.Type);
    }

    schema[table] = fieldInfo;
  }
  console.log(schema);
  return schema;
}

const extractData = async (table, limit, offset) => {
  const connection = getConnection();
  const data = {};

  const [dataResults] = await connection.promise().query(`
    SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`
  );

  data[table] = dataResults;

  return data;
}

const getCounts = async () => {
  const connection = getConnection();
  const tableNames = Object.keys(getSchema());
  const data = {};

  for (const table of tableNames) {
    const [dataResults] = await connection.promise().query(`
    SELECT COUNT(*) AS count FROM ${table}`);
    data[table] = dataResults[0].count;
  }

  return data;
}

module.exports = {
  extractSchema,
  extractData,
  getCounts
}