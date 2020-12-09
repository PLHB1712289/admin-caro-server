const mongoose = require("mongoose");
const config = require("./DB");

const connect=()=>{
    mongoose.connect(
        config.DB,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        () => {
            console.log("Mongoose Is Connected");
        },
        err=>{
            console.log('Can not connect to the database'+ err);
        }
    );
}

module.exports = { connect };

