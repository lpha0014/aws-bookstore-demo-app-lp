"use strict";

const https = require("https");
const url = require("url");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3Client = new S3Client({});

// UploadBooks - Upload sample set of books to DynamoDB
exports.handler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (event.RequestType !== "Create") {
    await sendResponse(event, context.logStreamName, "SUCCESS");
    return;
  }

  try {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: process.env.FILE_NAME
    }));
    const booksString = await response.Body.transformToString("utf-8");
    const booksList = JSON.parse(booksString);

    // Batch items into arrays of 25 for BatchWriteItem limit
    const tableName = process.env.TABLE_NAME;
    for (let i = 0; i < booksList.length; i += 25) {
      const batch = booksList.slice(i, i + 25).map((book) => ({
        PutRequest: { Item: book }
      }));
      await dynamoDb.send(new BatchWriteCommand({
        RequestItems: { [tableName]: batch }
      }));
    }
    console.log("Books imported");
    await sendResponse(event, context.logStreamName, "SUCCESS");
  } catch (err) {
    console.log(err);
    await sendResponse(event, context.logStreamName, "FAILED", { Error: "Upload books failed" });
  }
};

function sendResponse(event, logStreamName, responseStatus, responseData) {
  const responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: `See the details in CloudWatch Log Stream: ${logStreamName}`,
    PhysicalResourceId: logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData,
  });

  const parsedUrl = url.parse(event.ResponseURL);
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: "PUT",
    headers: {
      "Content-Type": "",
      "Content-Length": responseBody.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log("STATUS:", res.statusCode);
      resolve();
    });
    req.on("error", (err) => {
      console.log("sendResponse Error:", err);
      reject(err);
    });
    req.write(responseBody);
    req.end();
  });
}
