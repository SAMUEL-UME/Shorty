const mongoose = require("mongoose");
const { PORT, MONGO_URL } = require("../config/config");

const port = PORT || 3000;

const connect = (app) => {
  mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database is connected and ready to go!");
      app.listen(PORT, () => {
        console.log(`Server is up and running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.log("Opps an error occured", error);
    });
};

module.exports = {
  connect,
};
