const Tweet = require('./models/Tweet');
const {searchTweet} = require('./helper');

//const API_KEY = "AAAAAAAAAAAAAAAAAAAAABopbAEAAAAABjKNpF1Z6Q%2FY60kB7mGf2LkGulM%3DBsIva0OchIY5Q3Ip9VuBbT6B3Otbs9SkswbKWZ90S3xkpVrtDW";
//const API_KEY = "AAAAAAAAAAAAAAAAAAAAAORkbgEAAAAAAcQTpVTL1JW5kQsqXVLrghj0q84%3DhGKngmKtw03vI5expf1O15qibaESFefHHGah34mRngrVTzMwIm";
// const API_KEY = "AAAAAAAAAAAAAAAAAAAAAC5iegEAAAAApMUw1cVIf8Y2JLwdy3y%2BIXknb50%3D0mgfp6m6EvtB7oWplJhoMxpP1UnvODEeCWQn1fCiws1zK23mOI";
const API_KEY = "AAAAAAAAAAAAAAAAAAAAAFv6egEAAAAAtIatpQMP5xxsg8dB5Zmbe%2BOHcd0%3DrgUzn2UrfRz65oHoPSgCxKVd1VH3hTaDi9x7TXcVpYBBnigQCM";
const QUERY = "robotic%20OR%20%22machine%20learning%22%20OR%20%22artificial%20intelligence%22%20OR%20%22ai%22%20lang%3Aen";


const handleSearchTweet = async () => {
    // let NEXT_TOKEN = "";
    // let INDEX_DOCUMENT = 0;
    //let NEXT_TOKEN = "b26v89c19zqg8o3fnlu0y3jqjeqyhbymm08ypcnlx7tkt";
    //let INDEX_DOCUMENT = 13000920;

    // let tokenInfo = await getNextToken();

    // if(tokenInfo !== "FAILED GET NEXTTOKEN") {
    //     console.log("GET NEXTTOKEN SUCCESSFULL: ", tokenInfo);

    //     NEXT_TOKEN = tokenInfo.next_token;
    //     INDEX_DOCUMENT = tokenInfo.currentIndex + 1;

    // } else return "FAILED IN SEARCH TWEET";

    await saveTweet([{
        index: 13001016,
        tweet_id: "1134610502255030272",
        conversation_id: "1134610502255030272",
        text: "AI+ NEWS * SecureWorks Corp. (SCWX) Stock: A Strong Pick In The Tech Industry? – iWatch Markets https://t.co/ejvzXVOKjA",
        lang: "en",
        created_tweet_at: "2019-05-31T23:59:58.000Z",
        public_metrics: {retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0},
        referenced_tweets: [],
        next_token: "b26v89c19zqg8o3fnlu0y3jqjdwi3bb37gnvrdaox4hh9",
        key_words: "OPTION 1"
    }, {
        index: 13001017,
        tweet_id: "1134610495288352772",
        conversation_id: "1134610495288352772",
        text: "AI+ NEWS * Vislink Technologies, Inc. (VISL) Stock: Is This Tech Stock Worth Your Attention? – iWatch Markets https://t.co/P0W1GCMy0i",
        lang: "en",
        created_tweet_at: "2019-05-31T23:59:56.000Z",
        public_metrics: {retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0},
        referenced_tweets: [],
        next_token: "b26v89c19zqg8o3fnlu0y3jqjdwi3bb37gnvrdaox4hh9",
        key_words: "OPTION 1"
    }])

    return "DONE INSERT";

    while (true) {
        let searchResponse = await searchTweet(QUERY, NEXT_TOKEN, API_KEY);

        if (searchResponse !== "FAILED TWEET SEARCH REQUEST") {
            NEXT_TOKEN = searchResponse.meta?.next_token;

            console.log("RESULT_COUNT IN RESPONSE: ", searchResponse.meta.result_count);

            if(searchResponse?.data?.length > 0) {
                
                let data = searchResponse.data.map((item, item_index) => ({
                    index: INDEX_DOCUMENT + item_index,
                    tweet_id: item.id,
                    conversation_id: item.conversation_id,
                    text: item.text,
                    lang: item.lang,
                    created_tweet_at: item.created_at,
                    public_metrics: item.public_metrics,
                    referenced_tweets: item?.referenced_tweets ? item?.referenced_tweets : [],
                    next_token: NEXT_TOKEN,
                    key_words: "OPTION 1"
                }));

                let saveResponse = await saveTweet(data);

                if (saveResponse.message === "SAVE LIST TWEET SUCCESSFUL") {
                    if(saveResponse.size !== searchResponse.meta.result_count) {
                        console.log(`[COMPARE SIZE]===================> SIZE: ${saveResponse.size} RESULT_COUNT: ${searchResponse.meta.result_count}`);
                        return "FAILED IN SEARCH TWEET";
                    }

                    if(!NEXT_TOKEN) return "SEARCH TWEET FULL";
                    else {
                        INDEX_DOCUMENT += searchResponse.data.length;
                        console.log("DATE: ", data[data.length - 1].created_tweet_at,  "\n");
                        await new Promise((resolve, _) => setTimeout(resolve, 1000));
                    }

                } else return "FAILED IN SEARCH TWEET";

            } else if(NEXT_TOKEN === '') {
                console.log("[LENGTH DATA <= 0]===================> ERROR IN SEARCH TWEET");
                return "FAILED IN SEARCH TWEET";
            }

        } else return "FAILED IN SEARCH TWEET";
    }
}

const saveTweet = async (data) => {
    for(let i = 0; i < 3; i += 1) {
        try {
            let res = await Tweet.create(data);
            console.log("SAVE LIST TWEET SUCCESSFUL SIZE: ", res?.length);

            return {message: "SAVE LIST TWEET SUCCESSFUL", size: res.length};

        } catch (err) {
            console.error("[DATABASE]===================> ERROR IN SAVE LIST TWEET SIZE: ", data?.length);
            console.log("ERROR: ", err);

            if(err?.code === 11000) {
                console.log(`SAVE DUPLICATE = ${data?.length} - ${err?.writeErrors.length} = ${data?.length - err?.writeErrors.length}\n`);
                return {
                    message: "SAVE LIST TWEET WITH DUPLICATE",
                    amount_done: data?.length - err?.writeErrors.length
                }
            }
            
            console.log("===>>>Replay ", i, " times");
            if(i === 2) return {message: "FAILED SAVE LIST TWEET"};
        }
        await new Promise((resolve, _) => setTimeout(resolve, 1000));
    }
}

const getNextToken = async () => {
    for (let i = 0; i < 3; i += 1) {
        try {
            let result = await Tweet.findOne({}, ["next_token", "index", "key_words", "tweet_id"], { sort: {"_id": -1}})
            
            if(result) return { 
                tweet_id: result.tweet_id,
                currentIndex: result.index, 
                next_token: result.next_token, 
                key_words: result.key_words
            };
            else return {
                tweet_id: "",
                currentIndex: -1,
                next_token: "",
                key_words: ""
            };
        } catch (err) {
            console.log("[DATABASE]===================> ERROR IN GET NEXTTOKEN", err);
            console.log("===>>>Replay ", i, " times");

            if(i === 2) return "FAILED GET NEXTTOKEN";
        }
        await new Promise((resolve, _) => setTimeout(resolve, 1000));
    }
}

module.exports = {handleSearchTweet}
