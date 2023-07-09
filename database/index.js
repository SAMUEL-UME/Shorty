const mongoose = require("mongoose");
const { PORT, MONGO_URL } = require("../config/config");

const port = PORT || 3000;
console.log("PORT", port)

const connect = (app) => {
  mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database is connected and ready to go!");
      app.listen(port, () => {
        console.log(`Server is up and running on port ${port}`);
      });
    })
    .catch((error) => {
      console.log("Opps an error occured", error.message);
    });
};

module.exports = {
  connect,
};
