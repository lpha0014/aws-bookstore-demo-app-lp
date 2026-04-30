"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// UpdateCart - Update quantity of a book in a customer's cart
exports.handler = async (event) => {
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  const data = JSON.parse(event.body);

  try {
    await dynamoDb.send(new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        customerId: "anonymous",
        bookId: data.bookId
      },
      UpdateExpression: "SET quantity = :quantity",
      ExpressionAttributeValues: {
        ":quantity": data.quantity
      },
      ReturnValues: "ALL_NEW"
    }));
    return { statusCode: 200, headers };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
