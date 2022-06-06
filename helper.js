const axios = require('axios');

const searchTweet = async(query, nextToken, API_KEY, maxResults=100, start_time="2020-01-01T00:00:00.000Z", end_time="2022-04-07T00:00:00.000Z") => {
    let baseUrl = "https://api.twitter.com/2/tweets/search/all?tweet.fields=id,created_at,text,referenced_tweets,public_metrics,lang,conversation_id";
    
    if(nextToken) {
        url = baseUrl 
            + "&query=" + query
            + "&start_time=" + start_time
            + "&end_time=" + end_time
            + "&max_results=" + maxResults
            + "&next_token=" + nextToken 

    } else {
        url = baseUrl
            + "&query=" + query
            + "&start_time=" + start_time
            + "&end_time=" + end_time
            + "&max_results=" + maxResults
    }

    for(let i = 0; i < 3; i += 1) {
        try {
            console.log("START SEND TWEET SEARCH REQUEST");
            let res = await axios({
                method: "GET",
                url: url,
                headers: {
                    "Authorization": `Bearer ${API_KEY}`
                }
            });
            
            console.log("SEND TWEET SEARCH REQUEST SUCCESS");
            return res.data;
        } catch (err) {
            console.error("[REQUEST SEARCH]===================> ERROR IN TWEET SEARCH REQUEST: ", err?.message);
            // console.log("ERROR CODE: ", err?.response?.status, " ERROR STATUS: ", err?.response?.statusText);
            console.error(err);

            console.log("===>>> RESEND TWEET SEARCH REQUEST: ", i, " times");
            if(i === 2) return "FAILED TWEET SEARCH REQUEST";
        }
        await new Promise((resolve, _) => setTimeout(resolve, 1000));
        
    }
};

const lookupTweet = async (listTweetId, API_KEY) => {
    let baseUrl = "https://api.twitter.com/2/tweets?tweet.fields=lang";
    
    let stringIds = listTweetId.reduce((prevValue, curValue) => `${prevValue},${curValue}`);
    let url = baseUrl + "&ids=" + stringIds;


    for(let i = 0; i < 3; i += 1) {
        try {
            let res = await axios({
                method: "GET",
                url: url,
                headers: {
                    "Authorization": `Bearer ${API_KEY}`
                }
            });
            
            console.log("SEND TWEET LOOKUP REQUEST SUCCESS");
            return res.data;
        } catch (err) {
            console.error("[REQUEST LOOKUP]===================> ERROR IN TWEET LOOKUP REQUEST: ", err?.message);
            console.log("ERROR CODE: ", err?.response?.status, " ERROR STATUS: ", err?.response?.statusText);

            console.log("===>>> RESEND TWEET LOOKUP REQUEST: ", i, " times");
            if(i === 2) return "FAILED TWEET LOOKUP REQUEST";
        }
        await new Promise((resolve, _) => setTimeout(resolve, 1000));
        
    }
}

module.exports = {searchTweet, lookupTweet};