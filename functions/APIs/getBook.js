"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// GetBook - Get book information for a given book id
exports.handler = async (event) => {
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  try {
    const data = await dynamoDb.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: event.pathParameters.id }
    }));
    return { statusCode: 200, headers, body: JSON.stringify(data.Item) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
