const { handleSearchTweet } = require("./crawlTweet");
const { handleUpdateTweet } = require("./updateTweet");
const connectDB = require("./db");


const tool = async () => {
    let isConnected = await connectDB();

    if(isConnected === "CONNECTED TO DATABASE") {
        console.log("[START SERVER]===================> RUN CRAWL TWEET");
        let res = await handleSearchTweet();
        console.log("[END SERVER]===================> SHUTDOWM CRAWL TWEET: ", res);

        // console.log("[START SERVER]===================> RUN UPDATE TWEET");
        // let res = await handleUpdateTweet();
        // console.log("[END SERVER]===================> SHUTDOWM UPDATE TWEET: ", res);
    }
}

module.exports = tool;