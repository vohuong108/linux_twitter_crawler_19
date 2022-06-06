const Tweet = require('./models/Tweet');
const {lookupTweet} = require('./helper');

const API_KEY = "AAAAAAAAAAAAAAAAAAAAABopbAEAAAAABjKNpF1Z6Q%2FY60kB7mGf2LkGulM%3DBsIva0OchIY5Q3Ip9VuBbT6B3Otbs9SkswbKWZ90S3xkpVrtDW";


const handleUpdateTweet = async () => {
    let NEXT_INDEX = -1;

    while (true) {
        let listTweetInfo = await findListTweetId(NEXT_INDEX);
    
        if(listTweetInfo.message === "FIND LIST TWEET ID SUCCESSFUL") {
            if(listTweetInfo.data.length > 0) {

                let listIds = listTweetInfo.data.map(item => item.tweet_id);
                NEXT_INDEX = listTweetInfo.data[listIds.length - 1].index;
    
                let lookupResponse = await lookupTweet(listIds, API_KEY);
    
                if(lookupResponse !== "FAILED TWEET LOOKUP REQUEST") {
                    if(lookupResponse.data.length > 0 || lookupResponse.errors > 0) {
                        console.log(`LOOKUP DATA RESPONSE DATA SIZE: ${lookupResponse.data.length} ERROR SIZE: ${lookupResponse.errors.length}`);

                        let lookupData = lookupResponse.data.map(item => ({tweet_id: item.id, lang: item.lang}));
                        let lookupError = lookupResponse.errors.map(item => ({tweet_id: item.resource_id, lang: item.title}));
    
                        let updateResponse = await updateTweet([...lookupData, ...lookupError]);

                        if(updateResponse !== "UPDATED TWEET SUCCESSFUL") return "FAILED IN HANDLE UPDATE TWEET";
                        await new Promise((resolve, _) => setTimeout(resolve, 1000));

                    } else {
                        console.log("[LENGTH LOOKUP RESPONSE <= 0]===================> ERROR IN HANDLE UPDATE TWEET: " 
                        + `DATA SIZE: ${lookupResponse.data.length} ERROR SIZE: ${lookupResponse.errors.length}`);

                        return "FAILED IN HANDLE UPDATE TWEET";
                    }
                } else return "FAILED IN HANDLE UPDATE TWEET";
    
            } else {
                console.log("[LENGTH LIST TWEET ID <= 0]===================> MAYBE FULL UPDATE TWEET: " + listTweetInfo.data);
                return "MAYBE FULL UPDATED TWEET";
            }
        } else return "FAILED IN HANDLE UPDATE TWEET";

    }
}

const findListTweetId = async (index) => {
    for(let i = 0; i < 3; i += 1) {
        try {
            let filter = index !== null ? { lang: { $exists: false }, index: {$gt: index} } : { lang: { $exists: false } };
            let projection = ['_id', 'tweet_id', 'index'];
            let option = { sort: {index: 1}, limit: 100 };
            console.log("FILTER LIST TWEET ID: ", filter);

            let res = await Tweet.find(filter, projection, option);
            console.log(`FIND LIST TWEET ID FROM: ${res[0].index} TO: ${res[res.length - 1].index} SIZE: ${res.length}`);

            return {
                message: "FIND LIST TWEET ID SUCCESSFUL", 
                data: res
            };

        } catch (err) {
            console.error("[DATABASE]===================> ERROR IN FIND LIST TWEET ID INDEX: ", index);
            console.log("ERROR: ", err);
            
            console.log("===>>>Replay ", i, " times");
            if(i === 2) return {message: "FAILED FIND LIST TWEET ID"};
        }
        await new Promise((resolve, _) => setTimeout(resolve, 1000));
    }
}

const updateTweet = async (data) => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        arr.push(test(data[i]));
    }
    let r = await Promise.all(arr);
    console.log("UPDATED TWEET SUCCESSFUL: ", r);
    return "UPDATED TWEET SUCCESSFUL";
}

const test = async (data) => {
    for(let j = 0; j < 3; j++) {
        try {
            await Tweet.updateOne(
                {tweet_id: data.tweet_id},
                {$set: {lang: data.lang}}, 
                {timestamps: true}
            )
        } catch (err) {
            console.error("[DATABASE]===================>ERROR IN UPDATE TWEET: ", data.tweet_id);
            console.log("=>>>>> Replay ", i, " times");
            
            if(i === 2) return "FAILED UPDATE TWEET";
        }

        await new Promise((resolve, _) => setTimeout(resolve, 1000));
    }
} 

module.exports = {handleUpdateTweet}