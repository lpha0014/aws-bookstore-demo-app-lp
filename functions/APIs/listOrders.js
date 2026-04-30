"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// ListOrders - List orders for a given customer
exports.handler = async (event) => {
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  try {
    const data = await dynamoDb.send(new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "customerId = :customerId",
      ExpressionAttributeValues: {
        ":customerId": "anonymous"
      }
    }));
    return { statusCode: 200, headers, body: JSON.stringify(data.Items) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
