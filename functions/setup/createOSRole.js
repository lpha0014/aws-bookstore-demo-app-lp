"use strict";

const https = require("https");
const url = require("url");
const { IAMClient, CreateServiceLinkedRoleCommand } = require("@aws-sdk/client-iam");

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event));

  if (event.RequestType === "Delete") {
    await sendResponse(event, context.logStreamName, "SUCCESS");
    return;
  }

  try {
    const client = new IAMClient({});
    await client.send(new CreateServiceLinkedRoleCommand({
      AWSServiceName: "opensearchservice.amazonaws.com"
    }));
    console.log("OpenSearch service-linked role created, waiting for propagation...");
    await new Promise(r => setTimeout(r, 15000));
  } catch (e) {
    // Role may already exist — that's fine
    console.log("Role creation skipped:", e.message);
  }

  await sendResponse(event, context.logStreamName, "SUCCESS");
};

function sendResponse(event, logStreamName, status) {
  const body = JSON.stringify({
    Status: status,
    Reason: `See CloudWatch Log Stream: ${logStreamName}`,
    PhysicalResourceId: logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
  });

  const parsed = url.parse(event.ResponseURL);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: parsed.hostname, port: 443, path: parsed.path, method: "PUT",
      headers: { "Content-Type": "", "Content-Length": body.length }
    }, () => resolve());
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
