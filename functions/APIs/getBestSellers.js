"use strict";

const redis = require("redis");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

// GetBestSellers - Get a list of the top 20 best selling books
exports.handler = async (event) => {
  if (event.source === "warmer") {
    return "Lambda is warm";
  }

  const redisClient = redis.createClient({ url: `redis://${process.env.URL}:6379` });

  try {
    await redisClient.connect();
    const members = await redisClient.zRange("TopBooks:AllTime", 0, 19, { REV: true });
    await redisClient.quit();
    return { statusCode: 200, headers, body: JSON.stringify(members) };
  } catch (error) {
    console.log("Redis error:", error);
    try { await redisClient.quit(); } catch (e) { /* ignore */ }
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
