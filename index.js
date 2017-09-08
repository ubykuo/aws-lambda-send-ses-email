﻿console.log('Version 0.1.3');

var aws = require('aws-sdk');

var ses = new aws.SES();
var fs = require('fs')

exports.handler = function (event, context, callback) {
    
    console.log("Event: " + JSON.stringify(event));
    
    var input = event.data;

    // Check required parameters
    if (input.email == null) {
        context.fail('Bad Request: Missing required member: email');
        return;
    }

    var config = require('./config.js');
    
    if (input.name == null) {
        input.name = input.email;
    }
    
    if (input.subject == null) {
        input.subject = config.defaultSubject;
    }
    
    fs.readFile(config.templateKey, 'utf8', function (err,data) {
        if (err) {
            console.log(err, err.stack);
            context.fail('Internal Error: Failed to load template.')
        }else{
            var templateBody = data.toString(); 
            console.log("Template Body: " + templateBody);
            
            // Convert newlines in the message
            if (input.message != null) {
                input.message = input.message
                .replace("\r\n", "<br />")
                .replace("\r", "<br />")
                .replace("\n", "<br />");
            }

            // Perform the substitutions
            var mark = require('markup-js');
            
            var message = mark.up(templateBody, input);
            console.log("Final message: " + message);
            
            var params = {
                Destination: {
                    ToAddresses: [
                        config.targetAddress
                    ]
                },
                Message: {
                    
                    Subject: {
                        Data: 'Email from ubykuo.com', // subject
                        Charset: 'UTF-8'
                    }, 
                    Body: {
                        Html: {
                            Data: message,
                            Charset: 'UTF-8'
                        }
                    }
                },
                Source: config.fromAddress,
                ReplyToAddresses: [
                    input.name + '<' + input.email + '>'
                ]
            };
            
            // Send the email
            ses.sendEmail(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    context.fail('Internal Error: The email could not be sent.');
                } else {
                    console.log(data);
                    context.done('The email was successfully sent.');
                }
            });
        }
    });
};
