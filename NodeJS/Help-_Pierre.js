Help- Pierre
module = 1426867

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
            "enrichedData":"object" // NLP enriched data parsed from a user's message to your bot
            "customVars":"string" // stringified object containing any existing customVars for current session
            "fbUserData":"string" // for Messenger bots only - stringified object containing user's meta data - first name, last name, and id
            "attachedMedia":"string" // for Messenger bots only - stringified object containing attachment data from the user
        }
    */

    'use strict';
    const nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mitchatbot@gmail.com',
            pass: 'kep44dat'
        }
    });

    var from;
    if(event.from.trim().startsWith("1")){
        from = event.from.trim().substring(1);
    }else{
        from = event.from.trim();
    }

    function getName(callback){
        var mysql      = require('mysql');
        var connection = mysql.createConnection({
            host     : 'mysql.mit.edu',
            user     : 'jeffreyr',
            password : 'kep44dat',
            database : 'jeffreyr+chatbot2018'
        });

        connection.connect();
        console.log(from);
        var query = connection.query('SELECT name FROM user WHERE mobile = ' + from, function (error, results, fields) {
        callback(error, results[0].name);
        });

        connection.end();
    }

    getName(function(error, name){
        if(error){
            return console.log(error);
        }

        let mailOptions = {
            from: '"Person wanted help" <mitchatbot@gmail.com>',
            to: 'equitytransit@gmail.com',
            subject: 'Help Requested',
            text: name + " with number " +event.from + ' requested help' +  '\nThey left the message : ' + event.reply,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });

    });

    function writeToDatabase(queryString, fields){
        var mysql      = require('mysql');
        var connection = mysql.createConnection({
            host     : 'mysql.mit.edu',
            user     : 'jeffreyr',
            password : 'kep44dat',
            database : 'jeffreyr+chatbot'
        });

        connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            var insert = connection.query(queryString, fields, function(err, result) {
                if(err){
                    console.log("There was a failure inserting " + err.stack);
                    return;
                }
                console.log(insert.sql);
                connection.end(function(err){
                    if(err){
                        console.log("Failure ending connection " + err.stack);
                        return;
                    }
                });
            });
        });
    }

    function getUserID(callback){

        var mysql      = require('mysql');
        var connection = mysql.createConnection({
            host     : 'mysql.mit.edu',
            user     : 'jeffreyr',
            password : 'kep44dat',
            database : 'jeffreyr+chatbot'
        });

        connection.connect();

        console.log("from: "+ from);

        var query = connection.query('SELECT userid FROM user WHERE mobile = ' + from, function (error, results, fields) {
        callback(error, results[0].userid);
        });

        connection.end();


    }

    var id  = getUserID(function(err, result){
        if(err){
            console.log("An error selecting occurred");
            return;
        }
        var queryString = 'INSERT INTO service SET ? ON DUPLICATE KEY UPDATE question = ?';
        var insertJSON = {userid       : result,
                          question     : event.reply };

        var fields = [insertJSON, event.reply];
        writeToDatabase(queryString, fields);
    });



    // this is the object we will return to Motion AI in the callback
    var responseJSON = {
        "response": "I’ve recorded your question, Jeff @ MIT will get back to you. If you want to add more to your question, text any time.", // what the bot will respond with (more is appended below)
        "continue": false, // denotes that Motion AI should hit this module again, rather than continue further in the flow
        "customPayload": "", // working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // a JSON object containing suggested/quick replies to display to the user
        "cards": null, // a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": 636682 // the ID of the module to follow the nodeJS module
    }

    // callback to return data to Motion AI (must exist, or bot will not work)
    callback(null, responseJSON);
}
