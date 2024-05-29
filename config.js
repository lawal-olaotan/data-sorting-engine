const AWS = require('aws-sdk');
require("dotenv").config();

// add aws cridentials here 
AWS.config.update(
    {region:'eu-west-2', 
    apiVersion:"latest",
    maxRetries:3,
    httpOptions:{
        timeout:3000,
        connectTimeout:5000
    },
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

const dynamoDb = new AWS.DynamoDB({apiVersion:'2012-08-10'})
const docClient = new AWS.DynamoDB.DocumentClient(); 


module.exports = docClient