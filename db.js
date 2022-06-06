const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/twitter_db"


const connectDB = async () => {
    for(let i = 0; i < 3; i += 1) {
        try {
            await mongoose.connect(uri, { 
                useUnifiedTopology: true, 
                useNewUrlParser: true 
            });
            console.log("db connectted...!");
            return "CONNECTED TO DATABASE";
            
        } catch (err) {
            console.log("Occured error while connect to DB");
            console.error("Error: ", err);

            if(i === 2) return "FAILED IN CONNECT TO DATABASE";
        }
        await new Promise((resolve, _) => setTimeout(resolve, 800));
    }
}


module.exports = connectDB;

