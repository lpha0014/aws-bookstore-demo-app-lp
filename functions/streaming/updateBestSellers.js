"use strict";

const redis = require("redis");

// UpdateBestSellers - Updates best sellers list as orders are placed
exports.handler = async (event) => {
  const redisClient = redis.createClient({ url: `redis://${process.env.URL}:6379` });

  try {
    await redisClient.connect();

    for (const record of event.Records) {
      const booksList = record.dynamodb.NewImage.books.L;
      for (const book of booksList) {
        const itemsSold = parseInt(book.M.quantity.N, 10);
        const bookId = book.M.bookId.S;
        await redisClient.zIncrBy("TopBooks:AllTime", itemsSold, JSON.stringify(bookId));
        console.log(`Incremented ${bookId} by ${itemsSold}`);
      }
    }

    await redisClient.quit();
  } catch (error) {
    console.log("Redis error:", error);
    try { await redisClient.quit(); } catch (e) { /* ignore */ }
    throw error;
  }
};
