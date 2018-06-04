Complete Diary
module = 1426869

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
            "inResponseTo":"string", // the Motion AI module that directed the conversation flow to this module
            "reply":"string", // the end-user's reply that led to this module
            "result":"string" // any extracted data from the prior module, if applicable,
            "enrichedData":"object" // stringified NLP enriched data object parsed from a user's message to your bot
            "customVars":"string" // stringified object containing any existing customVars for current session
            "fbUserData":"string" // for Messenger bots only - stringified object containing user's meta data - first name, last name, and id
            "attachedMedia":"string" // for Messenger bots only - stringified object containing attachment data from the user
        }
    */

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'mysql.mit.edu',
        user     : 'jeffreyr',
        password : 'kep44dat',
        database : 'jeffreyr+chatbot'
    });


    function getWinnerName(connection, callback){

        var query = connection.query('SELECT userid FROM winners WHERE date = (SELECT MAX(DATE) from winners)', function (error, results) {
            if(error){
                callback(error, null);
            }else if(results[0].userid === null || results[0].userid === undefined){
                callback(new TypeError("Undefined object received when reading from table"), null);
            }else{
                console.log(results);
                var query2 = connection.query('SELECT name FROM user WHERE userid = ' + results[0].userid, function(error, results, fields){
                    callback(error, results[0].name);
                });
            }
        });
    }

   try{
       getWinnerName(connection, function(error, winner){
           if(error){
               console.log(error.stack);
               throw error;
           }

            connection.end();

            var responseJSON = {
                "response": "Got it, thanks. You've been entered into today's $5 lottery. Have a great rest of the day.", // what the bot will respond with
                "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
                "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
                "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
                "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
                "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
                "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
            }

            callback(null, responseJSON);
       });
   }catch(error){
        var responseJSON = {
                "response": "Apologies! Something went wrong with my programming :(. I will be fixed shortly.", // what the bot will respond with
                "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
                "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
                "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
                "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
                "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
                "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
            }

            callback(null, responseJSON);
   }

};
