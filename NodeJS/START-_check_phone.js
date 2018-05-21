START - check phone

module = 1384718

exports.handler = (event, context, callback) => {

    // VIEW DOCS HERE:  https://github.com/MotionAI/nodejs-samples

    /* "event" object contains payload from Motion AI
        {
            "from":"string", // the end-user's identifier (may be FB ID, email address, Slack username etc, depends on bot type)
            "session":"string", // a unique session identifier
            "botId":"string", // the Motion AI ID of the bot
            "botType":"string", // the type of bot this is (FB, Slack etc)
            "customPayload":"string", // a developer-defined payload for carrying information
            "moduleId":"string", // the current Motion AI Module ID
            "moduleNickname":"string", // the current Motion AI Module's nickname
            "inResponseTo":"string", // the Motion AI module that directed the conversation flow to this module
            "reply":"string", // the end-user's reply that led to this module
            "result":"string" // any extracted data from the prior module, if applicable,
            "replyHistory":"object" // an object containing the current session's conversation messages
            "nlpData":"object" // stringified NLP data object parsed from a user's message to your bot if NLP engine is enabled
            "customVars":"string" // stringified object containing any existing customVars for current session
            "fbUserData":"string" // for Messenger bots only - stringified object containing user's meta data - first name, last name, and id
            "attachedMedia":"string" // for Messenger bots only - stringified object containing attachment data from the user
        }
    */

    // this is the object we will return to Motion AI in the callback

    function checkphone(callback){

        var mysql      = require('mysql');
        var connection = mysql.createConnection({
            host     : 'mysql.mit.edu',
            user     : 'jeffreyr',
            password : 'kep44dat',
            database : 'jeffreyr+chatbot2018'
        });

        connection.connect();

        var query = connection.query("SELECT 1 FROM intake WHERE phone = '"+(event.from.trim().substring(1))+"' ORDER BY phone LIMIT 1", function (error, results, fields) {
        callback(error, results);
        });

        connection.end();
    }

    var response;
    checkphone(function(err, result){
        if(err){
            console.log("error checking if phone exist");
        } if (result.length > 0) {
            console.log("phone number exists!");
            if ((((event.reply).toLowerCase()).indexOf("consent")) > -1) {
                var responseJSON = {
                    "response": null, // what the bot will respond with
                    "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
                    "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
                    "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
                    "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
                    "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
                    "nextModule": 1374432 // OPTIONAL: the ID of a module to follow this Node JS module
                };
            } else {
                var responseJSON = {
                    "response": null, // what the bot will respond with
                    "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
                    "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
                    "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
                    "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
                    "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
                    "nextModule": 1385209 // OPTIONAL: the ID of a module to follow this Node JS module
                };
            };
        } else {
            console.log("phone number does not exist!");
            var responseJSON = {
                "response": null, // what the bot will respond with
                "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
                "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
                "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
                "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
                "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
                "nextModule": 1379897 // OPTIONAL: the ID of a module to follow this Node JS module
            };
        }
        // callback to return data to Motion AI (must exist, or bot will not work)
        callback(null, responseJSON);
    });
};
