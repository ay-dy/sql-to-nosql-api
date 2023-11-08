const mongoose = require('mongoose');

const getMongoType = (mysqlType) => {
  // Exclude character limits from data type;
  mysqlType = mysqlType.split('(')[0];

  const mongoTypes = {
    String: ['varchar', 'text', 'char', 'enum'],
    Number: ['int', 'float', 'double', 'decimal'],
    Date: ['date', 'datetime', 'timestamp']
  }

  for (const type in mongoTypes) {
    if (mongoTypes[type].includes(mysqlType)) {
      return { type };
    }
  }
}

const createCollectionModels = (schema) => {
  const collectionModels = {};

  for (const collection in schema) {
    let collectionData = schema[collection];
    let mongoSchema = new mongoose.Schema(collectionData, { collection });
    let model = mongoose.model(collection, mongoSchema);

    collectionModels[collection] = model;
  }

  return collectionModels;
}

const deleteCollectionModels = (currentCollectionModels) => {
  Object.keys(currentCollectionModels).forEach((modelName) => {
    delete mongoose.connection.models[modelName];
  });
}

module.exports = {
  getMongoType,
  createCollectionModels,
  deleteCollectionModels
}