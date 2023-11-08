const { deleteCollectionModels, createCollectionModels } = require('../utils/utils');
const { getSchema } = require('./mysql.config');

let collectionModels = {};

const getCollectionModels = () => {
  return collectionModels;
}

const setCollectionModels = () => {
  if (collectionModels) {
    deleteCollectionModels(collectionModels);
  }
  collectionModels = createCollectionModels(getSchema());
}

module.exports = { getCollectionModels, setCollectionModels }