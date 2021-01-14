function keepNecessaryFields(obj, fields) {
  const myObj = { ...obj };
   for (var key in myObj) {
    if (fields.indexOf(key) < 0) {
      delete myObj[key];
    }
  }
  return myObj;
}

module.exports = { keepNecessaryFields };
