"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// RemoveFromCart - Remove a particular book from a customer's cart
exports.handler = async (event) => {
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  const data = JSON.parse(event.body);

  try {
    await dynamoDb.send(new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        customerId: "anonymous",
        bookId: data.bookId
      }
    }));
    return { statusCode: 200, headers };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
