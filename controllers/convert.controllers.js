const { createDocuments } = require('../models/mongodb.models');
const { extractData, getCounts } = require('../models/mysql.models');

const getProgressPercentage = (docsInserted, docsRemaining) => {
  console.log(docsInserted, docsRemaining);
  const percentage = Math.floor((docsInserted / docsRemaining) * 100);
  return `${percentage}%`;
}

const getFormattedDuration = (startTime, endTime) => {
  const msPerHour = 3600000;
  const msPerMinute = 60000;
  const msPerSecond = 1000;

  const duration = endTime - startTime;
  const hours = Math.floor(duration / msPerHour)
  const minutes = Math.floor((duration % msPerHour) / msPerMinute);
  const seconds = Math.floor((duration % msPerMinute) / msPerSecond);

  return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
}

const formatTime = (time) => {
  return time < 10 ? `0${time}` : time;
}

const convert = async (_, res) => {
  // Initialise variables for data that prepares the loop for the conversion.
  const recordCounts = await getCounts();
  const tableNames = Object.keys(recordCounts);
  const startTime = new Date();
  const limit = 22400;

  // Main loop for iterating through each table and extracting data in chunks.
  for (const table of tableNames) {
    // Initialise variables for progress tracking.
    let offset = 0
    let docsInserted = 0;
    let docsRemaining = recordCounts[table];

    // Loop until all the data is extracted from the current table.
    while (docsRemaining > offset) {
      // Extract data in chunks of "limit" size from the current table.
      const data = await extractData(table, limit, offset);

      // Update the number of inserted documents for progress tracking.
      docsInserted += data[table].length;

      const percentage = getProgressPercentage(docsInserted, docsRemaining);
      console.log(`${table} progress: ${percentage}`);

      // Create documents in the target databvase from the extracted data.
      await createDocuments(data);

      // Move the offset to fetch the next chunk of data.
      offset += limit;
    }
  }

  // Conversion process complete. Now calculate the total duration.
  const endTime = new Date();
  const duration = getFormattedDuration(startTime, endTime);

  // Send a response with the duration information.
  res.status(200).send({ message: `Conversion time: ${duration}` });
}

module.exports = { convert };