const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Load books data
const books = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/books.json"), "utf8"));

// In-memory store
const cart = [];
const orders = [];

// --- Books ---
app.get("/books", (req, res) => {
  if (req.query.category) {
    return res.json(books.filter(b => b.category === req.query.category));
  }
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  res.json(book || null);
});

// --- Cart ---
app.get("/cart", (req, res) => res.json(cart));

app.get("/cart/:bookId", (req, res) => {
  const item = cart.find(c => c.bookId === req.params.bookId);
  res.json(item || null);
});

app.post("/cart", (req, res) => {
  const { bookId, quantity, price } = req.body;
  cart.push({ customerId: "anonymous", bookId, quantity, price });
  res.json({});
});

app.put("/cart", (req, res) => {
  const { bookId, quantity } = req.body;
  const item = cart.find(c => c.bookId === bookId);
  if (item) item.quantity = quantity;
  res.json({});
});

app.delete("/cart/:bookId", (req, res) => {
  const idx = cart.findIndex(c => c.bookId === req.params.bookId);
  if (idx !== -1) cart.splice(idx, 1);
  res.json({});
});

// --- Orders ---
app.get("/orders", (req, res) => res.json(orders));

app.post("/orders", (req, res) => {
  const { books: orderBooks } = req.body;
  orders.push({
    customerId: "anonymous",
    orderId: `order-${Date.now()}`,
    orderDate: Date.now(),
    books: orderBooks,
  });
  // Clear cart
  cart.length = 0;
  res.json({});
});

// --- Best Sellers ---
app.get("/bestsellers", (req, res) => {
  // Return some book IDs as "best sellers"
  const topBooks = orders.flatMap(o => o.books.map(b => b.bookId));
  const unique = [...new Set(topBooks)];
  // If no orders yet, return first 5 books
  const result = unique.length > 0 ? unique.slice(0, 20) : books.slice(0, 5).map(b => b.id);
  res.json(result.map(id => JSON.stringify(id)));
});

// --- Recommendations ---
app.get("/recommendations", (req, res) => {
  // Return mock recommendations
  res.json([
    { bookId: "b001", friendsPurchased: ["friend1", "friend3"], purchases: 2 },
    { bookId: "b003", friendsPurchased: ["friend1"], purchases: 1 },
    { bookId: "b007", friendsPurchased: ["friend3"], purchases: 1 },
    { bookId: "b002", friendsPurchased: ["friend2"], purchases: 1 },
    { bookId: "b011", friendsPurchased: ["friend2"], purchases: 1 },
  ]);
});

app.get("/recommendations/:bookId", (req, res) => {
  const mockFriends = ["friend1", "friend2", "friend3"];
  const purchased = mockFriends.filter(() => Math.random() > 0.5);
  res.json([{ friendsPurchased: purchased, purchased: purchased.length }]);
});

// --- Search ---
app.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const results = books.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q)
  );
  // Return in OpenSearch format
  res.json({
    hits: {
      total: { value: results.length },
      hits: results.map(b => ({
        _source: {
          id: { S: b.id },
          name: { S: b.name },
          author: { S: b.author },
          category: { S: b.category },
          cover: { S: b.cover },
          price: { N: b.price },
          rating: { N: b.rating },
        }
      }))
    }
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Local bookstore API running at http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /books, /books/:id`);
  console.log(`  GET  /cart, POST /cart, PUT /cart, DELETE /cart/:bookId`);
  console.log(`  GET  /orders, POST /orders`);
  console.log(`  GET  /bestsellers`);
  console.log(`  GET  /recommendations, /recommendations/:bookId`);
  console.log(`  GET  /search?q=term`);
});
