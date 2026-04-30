"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// AddToCart - add books to a customer's cart
exports.handler = async (event) => {
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  const data = JSON.parse(event.body);

  try {
    await dynamoDb.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        customerId: "anonymous",
        bookId: data.bookId,
        quantity: data.quantity,
        price: data.price,
      }
    }));
    return { statusCode: 200, headers };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
