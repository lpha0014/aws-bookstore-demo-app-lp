"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// ListBooks - List all books or list all books in a particular category
exports.handler = async (event) => {
  // Return immediately if being called by warmer
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  try {
    let data;
    if (event.queryStringParameters) {
      // Query books for a particular category
      data = await dynamoDb.send(new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: "category-index",
        KeyConditionExpression: "category = :category",
        ExpressionAttributeValues: {
          ":category": event.queryStringParameters.category
        }
      }));
    } else {
      // List all books in bookstore
      data = await dynamoDb.send(new ScanCommand({
        TableName: process.env.TABLE_NAME
      }));
    }
    return { statusCode: 200, headers, body: JSON.stringify(data.Items) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
