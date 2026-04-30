"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// Checkout - Process a customer's cart into an order
exports.handler = async (event, context) => {
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  const data = JSON.parse(event.body);
  const customerId = "anonymous";

  try {
    // Add order to Orders table
    await dynamoDb.send(new PutCommand({
      TableName: process.env.ORDERS_TABLE,
      Item: {
        customerId,
        orderId: context.awsRequestId,
        orderDate: Date.now(),
        books: data.books,
      }
    }));

    // Delete books from cart as they have been processed
    await Promise.all(data.books.map((item) =>
      dynamoDb.send(new DeleteCommand({
        TableName: process.env.CART_TABLE,
        Key: { customerId, bookId: item.bookId }
      }))
    ));

    return { statusCode: 200, headers };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
