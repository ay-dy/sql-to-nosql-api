const { getCollectionModels } = require('../configs/mongodb.config');

const createDocuments = async (data) => {
  const models = getCollectionModels();

  for (const collection in data) {
    // Select an appropriate model based on collection name.
    let model = models[collection];
    // Get the array of documents from the data object.
    let documents = data[collection];

    try {
      const result = await model.insertMany(documents);
      console.log(`${result.length} documents inserted.`);
    } catch (error) {
      console.log('Failed to insert records: ', error.message);
    }
  }
}

module.exports = { createDocuments }